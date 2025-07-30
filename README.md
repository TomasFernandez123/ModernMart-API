# API ModernMart

API REST para gestión de productos con imágenes usando Node.js, Express, MongoDB y Cloudinary.

## Características
- ✅ CRUD completo de productos
- ✅ Subida de imágenes a Cloudinary
- ✅ Validación con Joi
- ✅ Base de datos MongoDB

## Tecnologías
- Node.js
- Express
- MongoDB/Mongoose
- Cloudinary
- Multer
- Joi

## Endpoints
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/category/:category` - Obtener productos por categoría
- `GET /api/products/stats` - Obtener estadísticas de productos

## Instalación
```bash
npm install
npm start