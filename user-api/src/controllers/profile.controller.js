const profileService = require('../services/profile.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.getProfile = catchAsync(async (req, res) => {
  const profile = await profileService.getProfile(req.user.id);
  return success(res, 200, 'Profile fetched successfully', profile);
});

exports.updateProfile = catchAsync(async (req, res) => {
  const updatedUser = await profileService.updateProfile(req.user.id, req.body);
  return success(res, 200, 'Profile updated successfully', updatedUser);
});

exports.uploadPhoto = catchAsync(async (req, res) => {
  if (!req.file) {
    return success(res, 400, 'No file uploaded', null);
  }
  // Cloudinary se direct secure URL milta hai
  const fileUrl = req.file.path;
  const result = await profileService.uploadProfilePhoto(req.user.id, fileUrl);
  return success(res, 200, 'Profile photo uploaded successfully', result);
});

exports.submitKyc = catchAsync(async (req, res) => {
  const files = {};
  if (req.files?.pan_image) files.pan_image = req.files.pan_image[0].path;
  if (req.files?.aadhaar_front_image) files.aadhaar_front_image = req.files.aadhaar_front_image[0].path;
  if (req.files?.aadhaar_back_image) files.aadhaar_back_image = req.files.aadhaar_back_image[0].path;

  const kyc = await profileService.submitKyc(req.user.id, req.body, files);
  return success(res, 200, 'KYC submitted successfully', kyc);
});