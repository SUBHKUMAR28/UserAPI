
const Product = require('../models/product.model');
const Offer = require('../models/offer.model');
const ApiError = require('../utils/ApiError');
const sendAdminNotification = require('../utils/sendNotification');

exports.getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, is_active: true })
    .populate('category', 'name');
  if (!product) throw new ApiError(404, 'Product not found');

  // Is product ke saare active offers fetch karo
  const now = new Date();
  const offers = await Offer.find({
    applicable_products: id,
    is_active: true,
    $or: [
      { valid_till: null },
      { valid_till: { $gte: now } },
    ],
  }).select('title description discount_amount valid_till');

  return { ...product.toObject(), offers };
};


exports.viewProduct = async (userId, productId) => {
  const product = await Product.findById(productId);
  const user = await User.findById(userId);

  await sendAdminNotification({
    userId,
    userName: user?.full_name || 'Unknown',
    type: 'product',
    message: `${user?.full_name} ne "${product?.name}" product dekha`,
    data: { product_id: productId, product_name: product?.name },
  });

  return product;
};