const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Product', ProductSchema);
