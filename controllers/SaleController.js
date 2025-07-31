const Sale = require('../models/Sale');
const Product = require('../models/Product');
const { validateSale, validateSaleUpdate } = require('../utils/validators')

class SaleController {
    async getAllSales(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const total = await Sale.countDocuments();

            const sales = await Sale.find()
                .skip(skip)
                .limit(limit)
                .populate('products.product', 'title price category')
                .sort({ createdAt: -1 })
                .maxTimeMS(8000);

            res.status(200).json({
                success: true,
                data: sales,
                total_sales: total,
                page: page,
                total_pages: Math.ceil(total / limit),
                limit: limit
            });

        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;

            const sale = await Sale.findById(id)
                .populate('products.product', 'title price category')
                .maxTimeMS(8000);

            if (!sale) {
                return res.status(404).json({
                    success: false,
                    message: "Venta no encontrada"
                })
            }

            res.status(200).json({
                success: true,
                data: sale
            })

        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: "ID de venta invalido"
                });
            }
            next(error);
        }
    }

    async createSale(req, res, next) {
        try {

            const { error } = validateSale(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada invalidos',
                    errors: error.details.map(detail => detail.message)
                })
            }

            const { products, tax, status, paymentMethod } = req.body;

            const itemsWithPrices = await Promise.all(
                products.map(async (item) => {
                    const product = await Product.findById(item.product);
                    if (!product) {
                        throw new Error(`Producto con ID ${item.product} no encontrado`);
                    }

                    return {
                        product: item.product,
                        quantity: item.quantity,
                        unitPrice: product.price 
                    };
                })
            );

            const sale = new Sale({
                products: itemsWithPrices,
                tax: typeof tax === 'number' ? tax : 0,
                status: status || 'pending',
                paymentMethod: paymentMethod || 'cash'
            });

            await sale.save();

            await sale.populate('products.product', 'title price category');

            res.status(201).json({
                success: true,
                message: 'Venta creada exitosamente',
                data: sale.toJSON()
            })

        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: 'Error: Número de venta duplicado'
                });
            }
            next(error);
        }
    }

    async updateSale(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = validateSaleUpdate(req.body);

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada invalidos',
                    errors: error.details.map(detail => detail.message)
                })
            }

            const sale = await Sale.findById(id);

            if (!sale) {
                return res.status(404).json({
                    success: false,
                    message: "Venta no encontrada"
                })
            }

            if (req.body.products) {
                const itemsWithPrices = await Promise.all(
                    req.body.products.map(async (item) => {
                        const product = await Product.findById(item.product);
                        if (!product) {
                            throw new Error(`Producto con ID ${item.product} no encontrado`);
                        }

                        return {
                            product: item.product,
                            quantity: item.quantity,
                            unitPrice: product.price
                        };
                    })
                );
                req.body.products = itemsWithPrices;
            }

            Object.keys(req.body).forEach(key => {
                if (req.body[key] !== undefined) {
                    sale[key] = req.body[key];
                }
            });

            await sale.save();

            await sale.populate('products.product', 'title price category description image');

            res.status(200).json({
                success: true,
                message: 'Venta actualizada exitosamente',
                data: sale.toJSON()
            });

        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: "ID de venta invalido"
                });
            }
            next(error);
        }
    }

    async deleteSale(req, res, next) {
        try {
            const { id } = req.params;

            const sale = await Sale.findById(id);

            if (!sale) {
                return res.status(404).json({
                    success: false,
                    message: "Venta no encontrada"
                })
            }

            await Sale.findByIdAndDelete(id);

            res.status(200).json({
                success: true,
                message: 'Venta eliminada exitosamente',
                data: sale.toJSON()
            })

        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: "ID de venta invalido"
                });
            }
            next(error);
        }
    }

    async getSalesStats(req, res, next) {
        try {
            const stats = await Sale.getBasicStats();
            const monthSales = await Sale.getCurrentMonthSales();

            res.status(200).json({
                success: true,
                data: {
                    ...stats,
                    currentMonthSales: monthSales.length,
                    currentMonthRevenue: monthSales.reduce((sum, sale) => sum + sale.total, 0)
                }
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SaleController();