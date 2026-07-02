const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const ApiError = require('../utils/ApiError');

exports.getWalletSummary = async (userId) => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) throw new ApiError(404, 'Wallet not found');
  return {
    balance: wallet.balance,
    total_added: wallet.total_added,
    total_spent: wallet.total_spent,
    currency: wallet.currency,
  };
};

exports.getTransactions = async (userId) => {
  const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });
  return transactions.map((t) => ({
    transaction_id: t.transaction_id,
    amount: t.amount,
    status: t.status,
    payment_method: t.payment_method,
    created_at: t.createdAt,
  }));
};