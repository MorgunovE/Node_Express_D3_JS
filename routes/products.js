const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Routes pour les produits
router.get('/', productController.getAllProducts);
router.get('/nouveau', productController.getCreateForm);
router.post('/nouveau', productController.createProduct);
router.get('/modifier/:id', productController.getEditForm);
router.post('/modifier/:id', productController.updateProduct);
router.get('/supprimer/:id', productController.deleteProduct);

module.exports = router;
