const loanService = require('../services/loan.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.applyLoan = catchAsync(async (req, res) => {
  const loan = await loanService.applyLoan(req.user.id, req.body);
  return success(res, 201, 'Loan application submitted successfully', loan);
});

exports.getLoanList = catchAsync(async (req, res) => {
  const loans = await loanService.getLoanList(req.user.id);
  return success(res, 200, 'Loan list fetched successfully', loans);
});

exports.getLoanById = catchAsync(async (req, res) => {
  const loan = await loanService.getLoanById(req.user.id, req.params.id);
  return success(res, 200, 'Loan details fetched successfully', loan);
});