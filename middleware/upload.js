const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products', // Carpeta donde se guardarán las imágenes en CLOUDINARY
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Formatos permitidos
        transformation: [
            { width: 500, height: 500, crop: 'limit' },
            { quality: 'auto'} // Calidad de compresión automática (Optimización de imágenes)
        ]
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB MAXIMO
    }
});

module.exports = upload;