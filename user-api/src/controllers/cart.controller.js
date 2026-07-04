const cartService = require('../services/cart.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  return success(res, 200, 'Cart fetched successfully', cart);
});

exports.addToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user.id, productId, quantity);
  return success(res, 200, 'Product added to cart', cart);
});

exports.removeFromCart = catchAsync(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user.id, req.params.productId);
  return success(res, 200, 'Product removed from cart', cart);
});

exports.clearCart = catchAsync(async (req, res) => {
  await cartService.clearCart(req.user.id);
  return success(res, 200, 'Cart cleared successfully');
});