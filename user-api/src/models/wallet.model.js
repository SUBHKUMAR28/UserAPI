const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0 },
    total_added: { type: Number, default: 0 },
    total_spent: { type: Number, default: 0 },
    credit_limit: { type: Number, default: 0 },        // naya field
    reward_points: { type: Number, default: 0 },        // naya field
    currency: { type: String, default: 'INR' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', walletSchema);