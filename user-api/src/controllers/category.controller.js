const categoryService = require('../services/category.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  return success(res, 200, 'Categories fetched successfully', categories);
});