const walletService = require('../../services/admin/wallet.admin.service');
const catchAsync = require('../../utils/catchAsync');
const { success } = require('../../utils/apiResponse');

exports.updateWallet = catchAsync(async (req, res) => {
  const wallet = await walletService.updateWallet(req.params.userId, req.body);
  return success(res, 200, 'Wallet updated successfully', wallet);
});

exports.getAllWallets = catchAsync(async (req, res) => {
  const wallets = await walletService.getAllWallets();
  return success(res, 200, 'Wallets fetched successfully', wallets);
});