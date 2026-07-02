const walletService = require('../services/wallet.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.getWalletSummary = catchAsync(async (req, res) => {
  const data = await walletService.getWalletSummary(req.user.id);
  return success(res, 200, 'Wallet summary fetched', data);
});

exports.getTransactions = catchAsync(async (req, res) => {
  const data = await walletService.getTransactions(req.user.id);
  return success(res, 200, 'Transactions fetched', data);
});