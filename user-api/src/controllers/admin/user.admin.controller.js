const userService = require('../../services/admin/user.admin.service');
const catchAsync = require('../../utils/catchAsync');
const { success } = require('../../utils/apiResponse');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  return success(res, 200, 'Users fetched successfully', users);
});

exports.updateUserStatus = catchAsync(async (req, res) => {
  const user = await userService.updateUserStatus(req.params.id, req.body.account_status);
  return success(res, 200, 'User status updated successfully', user);
});

exports.updateUserProfile = catchAsync(async (req, res) => {
  const user = await userService.updateUserProfile(req.params.id, req.body);
  return success(res, 200, 'User profile updated successfully', user);
});