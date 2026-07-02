const emiService = require('../../services/admin/emi.admin.service');
const catchAsync = require('../../utils/catchAsync');
const { success } = require('../../utils/apiResponse');

exports.createEmi = catchAsync(async (req, res) => {
  const emi = await emiService.createEmi(req.body);
  return success(res, 201, 'EMI record created successfully', emi);
});

exports.getAllEmis = catchAsync(async (req, res) => {
  const emis = await emiService.getAllEmis();
  return success(res, 200, 'EMIs fetched successfully', emis);
});

exports.updateEmi = catchAsync(async (req, res) => {
  const emi = await emiService.updateEmi(req.params.id, req.body);
  return success(res, 200, 'EMI updated successfully', emi);
});

exports.deleteEmi = catchAsync(async (req, res) => {
  await emiService.deleteEmi(req.params.id);
  return success(res, 200, 'EMI deleted successfully');
});