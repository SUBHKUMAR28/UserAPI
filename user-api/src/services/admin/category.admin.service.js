const Category = require('../../models/category.model');
const ApiError = require('../../utils/ApiError');

exports.createCategory = async (data) => {
  return await Category.create(data);
};

exports.getAllCategories = async () => {
  return await Category.find().sort({ position: 1 });
};

exports.updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
};

exports.deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
};