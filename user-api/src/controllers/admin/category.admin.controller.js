const categoryService = require('../../services/admin/category.admin.service');
const catchAsync = require('../../utils/catchAsync');
const { success } = require('../../utils/apiResponse');

exports.createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return success(res, 201, 'Category created successfully', category);
});

exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  return success(res, 200, 'Categories fetched successfully', categories);
});

exports.updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  return success(res, 200, 'Category updated successfully', category);
});

exports.deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return success(res, 200, 'Category deleted successfully');
});