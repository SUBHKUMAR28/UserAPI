// const Product = require('../models/product.model');
// const ApiError = require('../utils/ApiError');

// exports.getAllProducts = async (filters) => {
//   const query = { is_active: true };

//   if (filters.category) query.category = filters.category;
//   if (filters.search) query.name = { $regex: filters.search, $options: 'i' };
//   if (filters.best_seller) query.is_best_seller = true;

//   return await Product.find(query).populate('category', 'name').sort({ createdAt: -1 });
// };

// exports.getProductById = async (id) => {
//   const product = await Product.findOne({ _id: id, is_active: true }).populate('category', 'name');
//   if (!product) throw new ApiError(404, 'Product not found');
//   return product;
// };

const Product = require('../models/product.model');
const Offer = require('../models/offer.model');
const ApiError = require('../utils/ApiError');

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