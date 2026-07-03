const Product = require('../../models/product.model');
const ApiError = require('../../utils/ApiError');

// exports.createProduct = async (data) => {
//   return await Product.create(data);
// };
exports.createProduct = async (data, files) => {
  let specifications = {};

  if (data.specifications) {
    try {
      specifications = typeof data.specifications === 'string'
        ? JSON.parse(data.specifications)
        : data.specifications;
    } catch (e) {
      specifications = {};
    }
  }

  const product = await Product.create({
    ...data,
    specifications,
  });
  return product;
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