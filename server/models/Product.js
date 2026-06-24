const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, enum: ['shirts', 'hoodies', 'suits', 'streetwear', 'accessories'], required: true },
  image: { type: String, required: true },
  sizes: [{ type: String, enum: ['S', 'M', 'L', 'XL'] }],
  colors: [String],
  description: String,
  specs: { type: Map, of: String }, // e.g. { "Material": "100% Cotton", "Fit": "Regular" }
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  inStock: { type: Number, required: true, default: 0 },
  salesCount: { type: Number, default: 0 } // Tracks bestseller status dynamically
});

module.exports = mongoose.model('Product', ProductSchema);
