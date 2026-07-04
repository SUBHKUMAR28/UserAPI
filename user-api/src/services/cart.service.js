const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');

exports.getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId })
    .populate('items.product', 'name price images is_active');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], total_amount: 0 });
  }
  return cart;
};

exports.addToCart = async (userId, productId, quantity = 1) => {
  // Product exist karta hai check karo
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  if (!product.is_active) throw new ApiError(400, 'Product is not available');
  if (product.stock < quantity) throw new ApiError(400, 'Insufficient stock');

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [], total_amount: 0 });
  }

  // Pehle se cart me hai ya nahi check karo
  const existingItem = cart.items.find(
    item => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity; // quantity badha do
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.discounted_price || product.price,
    });
  }

  // Total calculate karo
  cart.total_amount = cart.items.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  await cart.save();
  return await cart.populate('items.product', 'name price images');
};

exports.removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  cart.total_amount = cart.items.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  await cart.save();
  return cart;
};

exports.clearCart = async (userId) => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { items: [], total_amount: 0 },
    { new: true }
  );
  return cart;
};