const Wallet = require('../../models/wallet.model');
const ApiError = require('../../utils/ApiError');

exports.updateWallet = async (userId, data) => {
  const { credit_limit, reward_points, balance } = data;
  const updateData = {};
  if (credit_limit !== undefined) updateData.credit_limit = credit_limit;
  if (reward_points !== undefined) updateData.reward_points = reward_points;
  if (balance !== undefined) updateData.balance = balance;

  const wallet = await Wallet.findOneAndUpdate({ user: userId }, updateData, { new: true });
  if (!wallet) throw new ApiError(404, 'Wallet not found');
  return wallet;
};

exports.getAllWallets = async () => {
  return await Wallet.find().populate('user', 'full_name email mobile');
};