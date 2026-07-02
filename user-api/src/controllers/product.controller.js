const productService = require('../services/product.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await productService.getAllProducts(req.query);
  return success(res, 200, 'Products fetched successfully', products);
});

exports.getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return success(res, 200, 'Product details fetched successfully', product);
});