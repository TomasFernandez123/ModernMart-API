const mongoose = require('mongoose');
const { image } = require('../config/cloudinary');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres'],
    minlength: [3, 'El título debe tener al menos 3 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'El precio debe ser un número positivo'
    }
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
    minlength: [10, 'La descripción debe tener al menos 10 caracteres']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true,
    lowercase: true,
    enum: {
      values: ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'food', 'automotive', 'other'],
      message: 'Categoría no válida'
    }
  },
  image: {
    url: String,
    public_id: String
  }
}, {
  timestamps: false, // Añade createdAt y updatedAt automáticamente
  versionKey: false // Elimina el campo __v
});

// Índices para mejorar el rendimiento
productSchema.index({ title: 'text', description: 'text' }); // Búsqueda de texto
productSchema.index({ category: 1 }); // Filtro por categoría
productSchema.index({ price: 1 }); // Ordenar por precio
productSchema.index({ createdAt: -1 }); // Ordenar por fecha de creación

// Middleware pre-save para formatear datos
productSchema.pre('save', function(next) {
  // Capitalizar la primera letra del título
  if (this.title) {
    this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
  }
  next();
});

// Método estático para buscar productos
productSchema.statics.findByCategory = function(category) {
  return this.find({ category: category.toLowerCase() });
};

// Método de instancia para obtener resumen del producto
productSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    price: this.price,
    category: this.category
  };
};

// Transformar el objeto al convertir a JSON
productSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;