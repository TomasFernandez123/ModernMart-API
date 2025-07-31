const express = require('express');
const SaleController = require('../controllers/SaleController');

const router = express.Router();

router.get("/", SaleController.getAllSales)
router.get("/stats", SaleController.getSalesStats)
router.get("/:id", SaleController.getById)
router.post("/", SaleController.createSale)
router.put("/:id", SaleController.updateSale)
router.delete("/:id", SaleController.deleteSale)

module.exports = router;