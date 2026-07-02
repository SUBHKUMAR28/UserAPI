// src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.register = catchAsync(async (req, res) => {
  const data = await authService.register(req.body);
  return success(res, 201, 'Registered successfully', data);
});

exports.login = catchAsync(async (req, res) => {
  const data = await authService.login(req.body);
  return success(res, 200, 'Login successful', data);
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const data = await authService.forgotPassword(req.body.email);
  return success(res, 200, 'OTP sent to your email', data);
});

exports.verifyOtp = catchAsync(async (req, res) => {
  await authService.verifyOtp(req.body.email, req.body.otp);
  return success(res, 200, 'OTP verified successfully');
});

exports.resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.email, req.body.newPassword, req.body.confirmPassword);
  return success(res, 200, 'Password reset successful');
});

exports.logout = catchAsync(async (req, res) => {
  await authService.logout(req.user.id);
  return success(res, 200, 'Logged out successfully');
});

exports.refreshToken = catchAsync(async (req, res) => {
  const tokens = await authService.refreshToken(req.body.refresh_token);
  return success(res, 200, 'Token refreshed', tokens);
});
exports.checkCustomer = catchAsync(async (req, res) => {
  const data = await authService.checkCustomer(req.body);
  return success(res, 200, 'Customer check successful', data);
});

exports.createPasswordFromCustomer = catchAsync(async (req, res) => {
  const data = await authService.createPasswordFromCustomer(req.body);
  return success(res, 201, 'Account created successfully', data);
});