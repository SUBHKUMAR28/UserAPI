const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.placeOrder = catchAsync(async (req, res) => {
  return success(res, 200, 'Order placed successfully', {});
});

exports.getOrders = catchAsync(async (req, res) => {
  return success(res, 200, 'Orders fetched successfully', []);
});

exports.getOrderById = catchAsync(async (req, res) => {
  return success(res, 200, 'Order fetched successfully', {});
});

exports.buyNow = catchAsync(async (req, res) => {
  return success(res, 200, 'Buy now initiated', {});
});