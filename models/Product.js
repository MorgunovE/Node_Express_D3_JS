const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
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
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
