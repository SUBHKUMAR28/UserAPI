// src/services/payment.service.js
const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const ApiError = require('../utils/ApiError');

// Step 1: Order create karo
exports.createOrder = async (userId, amount) => {
  if (amount <= 0) throw new ApiError(400, 'Amount must be greater than 0');

  const options = {
    amount: amount * 100, // paise me convert (₹500 = 50000)
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpayInstance.orders.create(options);

  await Transaction.create({
    user: userId,
    razorpay_order_id: order.id,
    amount,
    type: 'credit',
    status: 'created',
  });

  return {
    order_id: order.id,
    amount: order.amount,      // yeh wahi amount hai jo user ne enter kiya, paise me
    currency: order.currency,
    key_id: process.env.RAZORPAY_KEY_ID,
  };
};

// Step 2: Payment verify karo (confirmation ke baad)
exports.verifyPayment = async (userId, razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, 'Payment verification failed - invalid signature');
  }

  const transaction = await Transaction.findOne({ razorpay_order_id });
  if (!transaction) throw new ApiError(404, 'Transaction not found');

  transaction.razorpay_payment_id = razorpay_payment_id;
  transaction.status = 'success';
  await transaction.save();

  const wallet = await Wallet.findOne({ user: userId });
  wallet.balance += transaction.amount;
  wallet.total_added += transaction.amount;
  await wallet.save();

  return { wallet, transaction };
};