const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
    amount: { type: Number, required: true },
    paymentType: { type: String, enum: ['paid', 'credit'], default: 'paid' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    returned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Sale', SaleSchema);
