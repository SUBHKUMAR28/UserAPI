const Product = require('../../models/product.model');
const ApiError = require('../../utils/ApiError');

exports.createProduct = async (data) => {
  return await Product.create(data);
};

exports.getAllProducts = async () => {
  return await Product.find();
};

exports.updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

exports.deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};