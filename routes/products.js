const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { body, validationResult } = require('express-validator');

// Input validation rules
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('La quantité doit être un nombre entier positif'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  body('category')
    .notEmpty()
    .withMessage('La catégorie est obligatoire')
];

// GET /products - Display all products
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find().sort({ updatedAt: -1 });
    res.render('products', { products });
  } catch (err) {
    next(err);
  }
});

// GET /products/new - Display product creation form
router.get('/new', (req, res) => {
  res.render('productForm', {
    title: 'Ajouter un nouveau produit',
    action: '/products',
    product: null,
    errors: []
  });
});

// POST /products - Create a new product
router.post('/', productValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('productForm', {
        title: 'Ajouter un nouveau produit',
        action: '/products',
        product: req.body,
        errors: errors.array()
      });
    }

    const { name, quantity, price, category } = req.body;

    const newProduct = new Product({
      name,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      category
    });

    await newProduct.save();
    res.redirect('/products');

  } catch (err) {
    next(err);
  }
});

// GET /products/:id - Display a single product
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send('Produit non trouvé');
    }

    res.render('product-detail', { product });
  } catch (err) {
    next(err);
  }
});

// GET /products/edit/:id - Display product edit form
router.get('/edit/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send('Produit non trouvé');
    }

    res.render('productForm', {
      title: 'Modifier le produit',
      action: `/products/update/${product._id}`,
      product,
      errors: []
    });
  } catch (err) {
    next(err);
  }
});

// POST /products/update/:id - Update a product
router.post('/update/:id', productValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('productForm', {
        title: 'Modifier le produit',
        action: `/products/update/${req.params.id}`,
        product: { ...req.body, _id: req.params.id },
        errors: errors.array()
      });
    }

    const { name, quantity, price, category } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        category,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send('Produit non trouvé');
    }

    res.redirect('/products');
  } catch (err) {
    next(err);
  }
});

// POST /products/delete/:id - Delete a product
router.post('/delete/:id', async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).send('Produit non trouvé');
    }

    res.redirect('/products');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
