const Loan = require('../../models/loan.model');
const ApiError = require('../../utils/ApiError');

exports.getAllLoans = async () => {
  return await Loan.find().populate('user', 'full_name email mobile').sort({ createdAt: -1 });
};

exports.getLoanById = async (id) => {
  const loan = await Loan.findById(id).populate('user', 'full_name email mobile');
  if (!loan) throw new ApiError(404, 'Loan application not found');
  return loan;
};

exports.approveLoan = async (id, approved_amount) => {
  const loan = await Loan.findById(id);
  if (!loan) throw new ApiError(404, 'Loan application not found');

  if (loan.status === 'approved' || loan.status === 'disbursed') {
    throw new ApiError(400, 'Loan already approved/disbursed');
  }

  loan.status = 'approved';
  loan.approved_amount = approved_amount || loan.requested_amount;
  loan.rejection_reason = null;
  await loan.save();

  return loan;
};

exports.rejectLoan = async (id, rejection_reason) => {
  const loan = await Loan.findById(id);
  if (!loan) throw new ApiError(404, 'Loan application not found');

  loan.status = 'rejected';
  loan.rejection_reason = rejection_reason || 'Not specified';
  await loan.save();

  return loan;
};

exports.disburseLoan = async (id) => {
  const loan = await Loan.findById(id);
  if (!loan) throw new ApiError(404, 'Loan application not found');

  if (loan.status !== 'approved') {
    throw new ApiError(400, 'Loan must be approved before disbursing');
  }

  loan.status = 'disbursed';
  await loan.save();

  return loan;
};