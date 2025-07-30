const Joi = require('joi');

// Validación para crear producto
const validateProduct = (product) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(3)
      .max(100)
      .required()
      .trim()
      .messages({
        'string.empty': 'El título es obligatorio',
        'string.min': 'El título debe tener al menos 3 caracteres',
        'string.max': 'El título no puede exceder 100 caracteres',
        'any.required': 'El título es obligatorio'
      }),
    
    price: Joi.number()
      .min(0)
      .required()
      .messages({
        'number.base': 'El precio debe ser un número',
        'number.min': 'El precio no puede ser negativo',
        'any.required': 'El precio es obligatorio'
      }),
    
    description: Joi.string()
      .min(10)
      .max(1000)
      .required()
      .trim()
      .messages({
        'string.empty': 'La descripción es obligatoria',
        'string.min': 'La descripción debe tener al menos 10 caracteres',
        'string.max': 'La descripción no puede exceder 1000 caracteres',
        'any.required': 'La descripción es obligatoria'
      }),
    
    category: Joi.string()
      .valid('electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'food', 'automotive', 'other')
      .required()
      .messages({
        'any.only': 'La categoría debe ser una de las siguientes: electronics, clothing, books, home, sports, beauty, toys, food, automotive, other',
        'any.required': 'La categoría es obligatoria'
      })
  });

  return schema.validate(product, { abortEarly: false });
};

// Validación para actualizar producto (todos los campos opcionales)
const validateProductUpdate = (product) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(3)
      .max(100)
      .trim()
      .messages({
        'string.min': 'El título debe tener al menos 3 caracteres',
        'string.max': 'El título no puede exceder 100 caracteres'
      }),
    
    price: Joi.number()
      .min(0)
      .messages({
        'number.base': 'El precio debe ser un número',
        'number.min': 'El precio no puede ser negativo'
      }),
    
    description: Joi.string()
      .min(10)
      .max(1000)
      .trim()
      .messages({
        'string.min': 'La descripción debe tener al menos 10 caracteres',
        'string.max': 'La descripción no puede exceder 1000 caracteres'
      }),
    
    category: Joi.string()
      .valid('electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'food', 'automotive', 'other')
      .messages({
        'any.only': 'La categoría debe ser una de las siguientes: electronics, clothing, books, home, sports, beauty, toys, food, automotive, other'
      })
  })

  return schema.validate(product, { abortEarly: false });
};

module.exports = {
  validateProduct,
  validateProductUpdate
};
