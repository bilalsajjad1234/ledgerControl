const mongoose = require('mongoose');

const CreditSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerName: { type: String },
    amount: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Credit', CreditSchema);
