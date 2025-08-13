const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  category: {
    type: String,
    enum: ['scarf', 'hat', 'sweater', 'accessory', 'other'],
    default: 'other'
  },
  colors: [String],
  sizes: [String],
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema); 