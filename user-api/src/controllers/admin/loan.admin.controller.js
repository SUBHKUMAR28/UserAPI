const loanService = require('../../services/admin/loan.admin.service');
const catchAsync = require('../../utils/catchAsync');
const { success } = require('../../utils/apiResponse');

exports.getAllLoans = catchAsync(async (req, res) => {
  const loans = await loanService.getAllLoans();
  return success(res, 200, 'Loan applications fetched successfully', loans);
});

exports.getLoanById = catchAsync(async (req, res) => {
  const loan = await loanService.getLoanById(req.params.id);
  return success(res, 200, 'Loan details fetched successfully', loan);
});

exports.approveLoan = catchAsync(async (req, res) => {
  const loan = await loanService.approveLoan(req.params.id, req.body.approved_amount);
  return success(res, 200, 'Loan approved successfully', loan);
});

exports.rejectLoan = catchAsync(async (req, res) => {
  const loan = await loanService.rejectLoan(req.params.id, req.body.rejection_reason);
  return success(res, 200, 'Loan rejected', loan);
});

exports.disburseLoan = catchAsync(async (req, res) => {
  const loan = await loanService.disburseLoan(req.params.id);
  return success(res, 200, 'Loan disbursed successfully', loan);
});