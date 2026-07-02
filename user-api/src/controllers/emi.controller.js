const emiService = require('../services/emi.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.getEmiList = catchAsync(async (req, res) => {
  const emis = await emiService.getEmiList(req.user.id);
  return success(res, 200, 'EMI list fetched successfully', emis);
});

exports.getEmiById = catchAsync(async (req, res) => {
  const emi = await emiService.getEmiById(req.user.id, req.params.id);
  return success(res, 200, 'EMI details fetched successfully', emi);
});

exports.payEmi = catchAsync(async (req, res) => {
  const emi = await emiService.payEmi(req.user.id, req.body.emi_id, req.body.amount);
  return success(res, 200, 'EMI payment successful', emi);
});