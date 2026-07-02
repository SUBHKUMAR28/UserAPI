const kycService = require('../services/userkyc.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.submitKyc = catchAsync(async (req, res) => {
  const data = await kycService.submitKyc(req.user.id, req.body, req.files);
  return success(res, 201, 'KYC submitted successfully', data);
});

exports.getKycStatus = catchAsync(async (req, res) => {
  const data = await kycService.getKycStatus(req.user.id);
  return success(res, 200, 'KYC status fetched', data);
});