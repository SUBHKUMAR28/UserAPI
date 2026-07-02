const kycService = require('../../services/admin/kyc.admin.service');
const catchAsync = require('../../utils/catchAsync');
const { success } = require('../../utils/apiResponse');

exports.getAllKyc = catchAsync(async (req, res) => {
  const data = await kycService.getAllKyc(req.query.status);
  return success(res, 200, 'KYC list fetched', data);
});

exports.getKycById = catchAsync(async (req, res) => {
  const data = await kycService.getKycById(req.params.id);
  return success(res, 200, 'KYC detail fetched', data);
});

exports.updateKycStatus = catchAsync(async (req, res) => {
  const data = await kycService.updateKycStatus(req.params.id, req.body, req.user.id);
  return success(res, 200, 'KYC status updated', data);
});