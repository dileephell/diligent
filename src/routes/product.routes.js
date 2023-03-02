const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Endpoint for creating a new product
router.post('/', productController.createProduct);

// Endpoint for getting a single product by ID
router.get('/:productId', productController.getProduct);

// Endpoint for listing the most viewed products
router.get('/most-viewed', productController.getMostViewedProducts);

// Endpoint for deleting a product by ID
router.delete('/:productId', productController.deleteProduct);

module.exports = router;
