const Category = require('../models/category.model');

exports.getAllCategories = async () => {
  return await Category.find({ is_active: true }).sort({ position: 1 });
};