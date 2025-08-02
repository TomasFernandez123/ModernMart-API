const express = require('express');
const ProductController = require('../controllers/ProductController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get("/", ProductController.getAllProducts)
router.get("/active", ProductController.getAllActiveProducts)
router.get("/stats", ProductController.getProductStats)
router.get("/:id", ProductController.getById)
router.get("/category/:category", ProductController.getByCategory)
router.post("/", upload.single('image'),ProductController.createProduct)
router.put("/:id", upload.single('image') ,ProductController.updateProduct)
router.put("/status/:id", ProductController.changeStatus)
router.delete("/:id", ProductController.deleteProduct)

module.exports = router;