const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Électronique', 'Alimentation', 'Vêtements', 'Maison', 'Sports', 'Autre']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Product', productSchema, 'listofproducttp');
