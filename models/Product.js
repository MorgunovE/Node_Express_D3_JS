const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du produit est obligatoire'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères']
  },
  quantite: {
    type: Number,
    required: [true, 'La quantité est obligatoire'],
    min: [0, 'La quantité ne peut pas être négative']
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  categorie: {
    type: String,
    required: [true, 'La catégorie est obligatoire'],
    trim: true
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: null
  }
}, {
  timestamps: {
    createdAt: 'dateCreation',
    updatedAt: 'dateModification'
  }
});

module.exports = mongoose.model('Product', ProductSchema, 'listofproducttp');
