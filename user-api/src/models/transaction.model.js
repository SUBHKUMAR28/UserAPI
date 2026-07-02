const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    transaction_id: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    payment_method: { type: String, enum: ['upi', 'card', 'netbanking', 'wallet'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);