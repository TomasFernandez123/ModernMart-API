const Product = require('../models/Product')
const { validateProduct, validateProductUpdate } = require('../utils/validators')
const cloudinary = require('../config/cloudinary');

class ProductController {
    // GET - Obtener todos los productos
    async getAllProducts(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const total = await Product.countDocuments();

            const products = await Product.find()
                .skip(skip)
                .limit(limit)
                .lean()
                .select('-__v')
                .maxTimeMS(8000);

            res.status(200).json({
                success: true,
                data: products,
                total_products: total,
                page: page,
                total_pages: Math.ceil(total / limit),
                limit: limit
            });
            
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Producto no encontrado"
                })
            }

            res.status(200).json({
                success: true,
                data: product
            });

        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: "ID de producto invalido"
                });
            }
            next(error)
        }
    }

    async createProduct(req, res, next) {
        try {
            const { error } = validateProduct(req.body)

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada invalidos',
                    errors: error.details.map(detail => detail.message)
                })
            }

            const product = new Product(req.body)

            if (req.file) {
                product.image = {
                    url: req.file.path, // URL de la imagen
                    public_id: req.file.filename // ID público de la imagen
                }
            }
            
            await product.save();

            res.status(201).json({
                success: true,
                message: 'Producto creado correctamente',
                data: product
            })

        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const { error } = validateProductUpdate(req.body)

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada invalidos',
                    errors: error.details.map(detail => detail.message)
                })
            }

            const product = await Product.findById(id)

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Producto no encontrado"
                })
            }

            Object.keys(req.body).forEach(key => {
                if (req.body[key] !== undefined) {
                    product[key] = req.body[key];
                }
            });

            if (req.file) {
                console.log('✅ Imagen subida correctamente');
                if (product.image && product.image.public_id) {
                    try {
                        await cloudinary.uploader.destroy(product.image.public_id);
                        console.log('✅ Imagen anterior eliminada de Cloudinary');
                    } catch (error) {
                        console.error('❌ Error al eliminar imagen anterior:', error);
                    }
                }

                product.image = {
                    url: req.file.path,
                    public_id: req.file.filename
                };
            } else {
                console.log('✅ Imagen no subida');
            }

            await product.save();

            res.status(200).json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: product
            });

        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: "ID de producto invalido"
                });
            }
            next(error)
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Producto no encontrado"
                })
            }

            if (product.image && product.image.public_id) {
                try {
                    await cloudinary.uploader.destroy(product.image.public_id);
                } catch (error) {
                    console.log('❌ Error eliminando imagen:', error.message);
                }
            }

            await Product.findByIdAndDelete(id);

            res.status(200).json({
                success: true,
                message: 'Producto eliminado correctament',
                data: product
            })

        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({
                    success: false,
                    message: "ID de producto invalido"
                });
            }
            next(error);
        }
    }

    async getByCategory(req, res, next) {
        try {
            const { category } = req.params;

            const products = await Product.find({ category: category.toLowerCase() });

            res.status(200).json({
                success: true,
                data: products
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();