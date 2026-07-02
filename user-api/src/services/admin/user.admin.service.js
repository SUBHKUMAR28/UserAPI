const User = require('../../models/user.model');
const ApiError = require('../../utils/ApiError');

exports.getAllUsers = async () => {
  return await User.find().select('-password -otp -refreshToken');
};

exports.updateUserStatus = async (id, account_status) => {
  const user = await User.findByIdAndUpdate(id, { account_status }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

exports.updateUserProfile = async (id, data) => {
  const { full_name, email, mobile, account_status } = data;
  const updateData = {};
  if (full_name) updateData.full_name = full_name;
  if (email) updateData.email = email;
  if (mobile) updateData.mobile = mobile;
  if (account_status) updateData.account_status = account_status;

  const user = await User.findByIdAndUpdate(id, updateData, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};