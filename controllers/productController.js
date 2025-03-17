const Product = require('../models/product');
const validator = require('validator');

// Validation function using validator
exports.validateProduct = (data) => {
  const errors = [];

  // Validate name
  if (!validator.isLength(data.name, { min: 2, max: 100 })) {
    errors.push({ msg: 'Le nom doit contenir entre 2 et 100 caractères' });
  }

  // Validate quantity
  if (!validator.isInt(data.quantity.toString(), { min: 0 })) {
    errors.push({ msg: 'La quantité doit être un nombre positif' });
  }

  // Validate price
  if (!validator.isFloat(data.price.toString(), { min: 0 })) {
    errors.push({ msg: 'Le prix doit être un nombre positif' });
  }

  // Validate category
  const validCategories = ['Électronique', 'Alimentation', 'Vêtements', 'Maison', 'Sports', 'Autre'];
  if (!validCategories.includes(data.category)) {
    errors.push({ msg: 'Catégorie invalide' });
  }

  return errors;
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('products', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

// Show product form
exports.showProductForm = (req, res) => {
  res.render('productForm', {
    title: 'Ajouter un nouveau produit',
    product: null,
    errors: null,
    action: '/products'
  });
};

// Create new product
exports.createProduct = async (req, res) => {
  const errors = this.validateProduct(req.body);

  if (errors.length > 0) {
    return res.render('productForm', {
      title: 'Ajouter un nouveau produit',
      product: req.body,
      errors: errors,
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
};

// Get product details
exports.getProductDetails = async (req, res) => {
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
};

// Show edit form
exports.showEditForm = async (req, res) => {
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
};

// Update product
exports.updateProduct = async (req, res) => {
  const errors = this.validateProduct(req.body);

  if (errors.length > 0) {
    return res.render('productForm', {
      title: 'Modifier le produit',
      product: { ...req.body, _id: req.params.id },
      errors: errors,
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
};

// Delete product
exports.deleteProduct = async (req, res) => {
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
};
