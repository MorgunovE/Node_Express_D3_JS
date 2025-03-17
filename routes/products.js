const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Routes using controller methods
router.get('/', productController.getAllProducts);
router.get('/new', productController.showProductForm);
router.post('/', productController.createProduct);
router.get('/:id', productController.getProductDetails);
router.get('/edit/:id', productController.showEditForm);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
