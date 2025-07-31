const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    // Información básica de la venta
    saleNumber: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            // Generar número de venta único: SALE-YYYYMMDD-XXXXX
            const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
            return `SALE-${date}-${random}`;
        }
    },

    // Productos vendidos
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        // Este será el precio unitario del producto al momento de la venta
        unitPrice: {
            type: Number,
            required: true,
            min: 0
        },
        // Subtotal por producto (quantity * unitPrice)
        subtotal: {
            type: Number,
            min: 0
        }
    }],

    // Totales de la venta
    subtotal: {
        type: Number,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    total: {
        type: Number,
        min: 0
    },

    // Estado de la venta
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },

    // Método de pago
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'transfer', 'other'],
        default: 'cash'
    }
}, {
    timestamps: true
});

// Índices para mejorar performance
saleSchema.index({ createdAt: -1 }); // Para ordenar por fecha
saleSchema.index({ status: 1 }); // Para filtrar por estado
saleSchema.index({ saleNumber: 1 }); // Para búsquedas por número de venta

// Middleware pre-save para calcular totales automáticamente
saleSchema.pre('save', function (next) {
    // Calcular subtotal de cada item
    this.products.forEach(item => {
        item.subtotal = item.quantity * item.unitPrice;
    });

    // Calcular subtotal total
    this.subtotal = this.products.reduce((sum, item) => sum + item.subtotal, 0);

    // Calcular total final
    this.total = this.subtotal + this.tax;

    next();
});

// Método para obtener ventas del mes actual
saleSchema.statics.getCurrentMonthSales = function () {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    return this.find({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        status: 'completed'
    });
};

// Método para obtener estadísticas básicas
saleSchema.statics.getBasicStats = async function () {
    const stats = await this.aggregate([
        { $match: { status: 'completed' } },
        {
            $group: {
                _id: null,
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: '$total' },
                averageOrderValue: { $avg: '$total' }
            }
        }
    ]);

    return stats[0] || { totalSales: 0, totalRevenue: 0, averageOrderValue: 0 };
};

// Virtual para obtener el total de items en la venta
saleSchema.virtual('totalItems').get(function () {
    return this.products.reduce((total, item) => total + item.quantity, 0);
});

// Configuración del JSON output
saleSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        // Reorganizar campos en el orden deseado
        const orderedRet = {
            id: ret._id,
            saleNumber: ret.saleNumber,
            products: ret.products.map(item => ({
                product: item.product.title,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.subtotal
            })),
            subtotal: ret.subtotal,
            tax: ret.tax,
            discount: ret.discount,
            total: ret.total,
            status: ret.status,
            paymentMethod: ret.paymentMethod,
            totalItems: ret.totalItems,
            createdAt: ret.createdAt,
            updatedAt: ret.updatedAt
        };

        return orderedRet;
    }
});

module.exports = mongoose.model('Sale', saleSchema);