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

const validateSale = (sale) => {
  const schema = Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          product: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
              'string.pattern.base': 'El ID del producto debe ser un ObjectId válido',
              'any.required': 'El producto es obligatorio'
            }),

          quantity: Joi.number()
            .integer()
            .min(1)
            .max(1000)
            .required()
            .messages({
              'number.base': 'La cantidad debe ser un número',
              'number.integer': 'La cantidad debe ser un número entero',
              'number.min': 'La cantidad debe ser al menos 1',
              'number.max': 'La cantidad no puede exceder 1000',
              'any.required': 'La cantidad es obligatoria'
            })
          // ✅ REMOVIDO: price ya no es requerido, se obtiene automáticamente
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'Debe incluir al menos un producto',
        'any.required': 'Los productos son obligatorios'
      }),

    tax: Joi.number()
      .min(0)
      .messages({
        'number.base': 'El impuesto debe ser un número',
        'number.min': 'El impuesto no puede ser negativo'
      }),

    discount: Joi.number()
      .min(0)
      .messages({
        'number.base': 'El descuento debe ser un número',
        'number.min': 'El descuento no puede ser negativo'
      }),

    status: Joi.string()
      .valid('pending', 'completed', 'cancelled')
      .messages({
        'any.only': 'El estado debe ser: pending, completed o cancelled'
      }),

    paymentMethod: Joi.string()
      .valid('cash', 'card', 'transfer', 'other')
      .messages({
        'any.only': 'El método de pago debe ser: cash, card, transfer u other'
      })
  });

  return schema.validate(sale, { abortEarly: false });
};

const validateSaleUpdate = (sale) => {
  const schema = Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          product: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .messages({
              'string.pattern.base': 'El ID del producto debe ser un ObjectId válido'
            }),

          quantity: Joi.number()
            .integer()
            .min(1)
            .max(1000)
            .messages({
              'number.base': 'La cantidad debe ser un número',
              'number.integer': 'La cantidad debe ser un número entero',
              'number.min': 'La cantidad debe ser al menos 1',
              'number.max': 'La cantidad no puede exceder 1000'
            })
        })
      )
      .min(1)
      .messages({
        'array.min': 'Debe incluir al menos un producto'
      }),

    tax: Joi.number()
      .min(0)
      .messages({
        'number.base': 'El impuesto debe ser un número',
        'number.min': 'El impuesto no puede ser negativo'
      }),

    status: Joi.string()
      .valid('pending', 'completed', 'cancelled')
      .messages({
        'any.only': 'El estado debe ser: pending, completed o cancelled'
      }),

    paymentMethod: Joi.string()
      .valid('cash', 'card', 'transfer', 'other')
      .messages({
        'any.only': 'El método de pago debe ser: cash, card, transfer u other'
      })
  });

  return schema.validate(sale, { abortEarly: false });
};

module.exports = {
  validateProduct,
  validateProductUpdate,
  validateSale,
  validateSaleUpdate
};
