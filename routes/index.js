const express = require('express');
const productRoutes = require('./productRoutes');

const router = express.Router();

// Rutas principales
router.use('/products', productRoutes);

// Ruta de información de la API
router.get('/', (req, res) => {
  res.json({
    message: 'API de Productos - Funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      products: {
        'GET /api/products': 'Obtener todos los productos (con paginación y filtros)',
        'GET /api/products/:id': 'Obtener producto por ID',
        'POST /api/products': 'Crear nuevo producto',
        'PUT /api/products/:id': 'Actualizar producto',
        'DELETE /api/products/:id': 'Eliminar producto',
        'GET /api/products/category/:category': 'Productos por categoría',
        'GET /api/products/stats': 'Estadísticas de productos'
      }
    },
    queryParams: {
      pagination: 'page, limit',
      filters: 'category, minPrice, maxPrice, search',
      sorting: 'sortBy, sortOrder'
    }
  });
});

module.exports = router;