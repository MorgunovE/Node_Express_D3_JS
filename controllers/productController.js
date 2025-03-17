const Product = require('../models/Product');
const validator = require('validator');

// Validation des données
const validateProduct = (data) => {
  const errors = {};

  if (!data.name || validator.isEmpty(data.name.trim())) {
    errors.name = 'Le name du produit est obligatoire';
  }

  if (!data.quantite || isNaN(data.quantite) || Number(data.quantite) < 0) {
    errors.quantite = 'La quantité doit être un namebre positif';
  }

  if (!data.prix || isNaN(data.prix) || Number(data.prix) < 0) {
    errors.prix = 'Le prix doit être un namebre positif';
  }

  if (!data.categorie || validator.isEmpty(data.categorie.trim())) {
    errors.categorie = 'La catégorie est obligatoire';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Obtenir tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const produits = await Product.find().sort({ dateCreation: -1 });
    res.render('products', { title: 'Liste des produits', produits });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
  }
};

// Afficher le formulaire de création
exports.getCreateForm = (req, res) => {
  res.render('product-form', { title: 'Ajouter un produit', product: {}, errors: {} });
};

// Créer un nouveau produit
exports.createProduct = async (req, res) => {
  const { isValid, errors } = validateProduct(req.body);

  if (!isValid) {
    return res.render('product-form', {
      title: 'Ajouter un produit',
      product: req.body,
      errors
    });
  }

  try {
    const newProduct = new Product({
      name: req.body.name,
      quantite: req.body.quantite,
      prix: req.body.prix,
      categorie: req.body.categorie
    });

    await newProduct.save();
    res.redirect('/produits');
  } catch (err) {
    res.render('product-form', {
      title: 'Ajouter un produit',
      product: req.body,
      errors: { general: 'Erreur lors de la création du produit' }
    });
  }
};

// Afficher le formulaire de modification
exports.getEditForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render('404', { title: 'Produit non trouvé' });
    }
    res.render('product-edit', { title: 'Modifier le produit', product, errors: {} });
  } catch (err) {
    res.status(500).render('500', { title: 'Erreur serveur' });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  const { isValid, errors } = validateProduct(req.body);

  if (!isValid) {
    return res.render('product-edit', {
      title: 'Modifier le produit',
      product: { ...req.body, _id: req.params.id },
      errors
    });
  }

  try {
    const updatedProduct = {
      name: req.body.name,
      quantite: req.body.quantite,
      prix: req.body.prix,
      categorie: req.body.categorie,
      dateModification: Date.now()
    };

    await Product.findByIdAndUpdate(req.params.id, updatedProduct);
    res.redirect('/produits');
  } catch (err) {
    res.render('product-edit', {
      title: 'Modifier le produit',
      product: { ...req.body, _id: req.params.id },
      errors: { general: 'Erreur lors de la mise à jour du produit' }
    });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/produits');
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
  }
};
