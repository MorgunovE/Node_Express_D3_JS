const express = require('express');
const router = express.Router();
const path = require('path');
const Product = require('../models/product');
const { body, validationResult } = require('express-validator');

// Home page route
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Accueil' });
});

// Products routes
router.get('/products', async function(req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('products', { products });
  } catch (error) {
    next(error);
  }
});

// Add new product form
router.get('/products/new', function(req, res, next) {
  res.render('productForm', {
    title: 'Ajouter un Produit',
    action: '/products',
    product: null,
    errors: null
  });
});

// Edit product form
router.get('/products/edit/:id', async function(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Produit non trouvé');
    }
    res.render('productForm', {
      title: 'Modifier le Produit',
      action: `/products/${product._id}?_method=PUT`,
      product,
      errors: null
    });
  } catch (error) {
    next(error);
  }
});

// View product details
router.get('/products/:id', async function(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Produit non trouvé');
    }
    res.render('product-detail', { product });
  } catch (error) {
    next(error);
  }
});

// Create new product
router.post('/products', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('quantity').isInt({ min: 0 }).withMessage('La quantité doit être un nombre entier positif'),
  body('price').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('category').notEmpty().withMessage('La catégorie est requise')
], async function(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('productForm', {
        title: 'Ajouter un Produit',
        action: '/products',
        product: req.body,
        errors: errors.array()
      });
    }

    const product = new Product({
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      category: req.body.category
    });

    await product.save();
    res.redirect('/products');
  } catch (error) {
    next(error);
  }
});

// Update product
router.put('/products/:id', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('quantity').isInt({ min: 0 }).withMessage('La quantité doit être un nombre entier positif'),
  body('price').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('category').notEmpty().withMessage('La catégorie est requise')
], async function(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('productForm', {
        title: 'Modifier le Produit',
        action: `/products/${req.params.id}?_method=PUT`,
        product: { ...req.body, _id: req.params.id },
        errors: errors.array()
      });
    }

    await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      category: req.body.category
    });

    res.redirect('/products');
  } catch (error) {
    next(error);
  }
});

// Delete product
router.delete('/products/:id', async function(req, res, next) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (error) {
    next(error);
  }
});

// Alternative delete route for form in products.ejs
router.post('/products/delete/:id', async function(req, res, next) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (error) {
    next(error);
  }
});

// Temperature visualization route
router.get('/temp', function(req, res, next) {
  res.render('temp', { title: 'Visualisation Température' });
});

// Counties visualization route
router.get('/counties', function(req, res, next) {
  res.render('counties', { title: 'Visualisation Counties' });
});

// Kickstarter visualization route
router.get('/kickstarter', function(req, res, next) {
  res.render('kickstarter', { title: 'Visualisation Kickstarter' });
});

// Serve JSON data for visualization
router.get('/data/global-temperature.json', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/data/global-temperature.json'));
});

router.get('/data/counties.json', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/data/counties.json'));
});

router.get('/data/kickstarter.json', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/data/kickstarter.json'));
});

module.exports = router;
