const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { validationResult, check } = require('express-validator');

// Validation rules for products
const productValidationRules = [
  check('name').trim().isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  check('quantity').isInt({ min: 0 }).withMessage('La quantité doit être un nombre positif'),
  check('price').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  check('category').notEmpty().withMessage('La catégorie est obligatoire')
];

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('products', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// GET new product form
router.get('/new', (req, res) => {
  res.render('productForm', {
    title: 'Ajouter un nouveau produit',
    product: null,
    errors: null,
    action: '/products'
  });
});

// POST create new product
router.post('/', productValidationRules, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('productForm', {
      title: 'Ajouter un nouveau produit',
      product: req.body,
      errors: errors.array(),
      action: '/products'
    });
  }

  try {
    const product = new Product({
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      category: req.body.category
    });

    await product.save();
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// GET product details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Produit non trouvé');
    }
    res.render('product-detail', { product });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// GET edit product form
router.get('/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Produit non trouvé');
    }
    res.render('productForm', {
      title: 'Modifier le produit',
      product: product,
      errors: null,
      action: `/products/${product._id}?_method=PUT`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// PUT update product
router.put('/:id', productValidationRules, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('productForm', {
      title: 'Modifier le produit',
      product: { ...req.body, _id: req.params.id },
      errors: errors.array(),
      action: `/products/${req.params.id}?_method=PUT`
    });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        category: req.body.category
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).send('Produit non trouvé');
    }

    res.redirect('/products');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).send('Produit non trouvé');
    }

    res.redirect('/products');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
