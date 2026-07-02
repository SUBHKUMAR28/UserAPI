
const productService = require('../../services/admin/product.admin.service');
const catchAsync = require('../../utils/catchAsync');
const { success } = require('../../utils/apiResponse');

exports.createProduct = catchAsync(async (req, res) => {
  // req.files ek OBJECT hai (upload.fields se), Array nahi
  const images = req.files?.images
    ? req.files.images.map((file) => file.path)
    : [];

  const productData = {
    ...req.body,
    images,
  };

  const product = await productService.createProduct(productData);
  return success(res, 201, 'Product created successfully', product);
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await productService.getAllProducts();
  return success(res, 200, 'Products fetched successfully', products);
});

exports.updateProduct = catchAsync(async (req, res) => {
  const updateData = { ...req.body };

  if (req.files?.images && req.files.images.length > 0) {
    updateData.images = req.files.images.map((file) => file.path);
  }

  const product = await productService.updateProduct(req.params.id, updateData);
  return success(res, 200, 'Product updated successfully', product);
});

exports.deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return success(res, 200, 'Product deleted successfully');
});