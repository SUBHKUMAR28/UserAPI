// // src/services/loan.service.js
// const Loan = require('../models/loan.model');
// const UserKyc = require('../models/userkyc.model');
// const ApiError = require('../utils/ApiError');

// exports.applyLoan = async (userId, payload) => {
//   // Step 1: Sabse latest approved KYC dhundo
//   const kyc = await UserKyc.findOne({ user: userId, status: 'approved' }).sort({ createdAt: -1 });

//   if (!kyc) {
//     throw new ApiError(400, 'Please complete and get your KYC approved before applying for loan');
//   }

//   // Step 2: Loan create karo - sab data KYC se copy, sirf naya wala payload se
//   const loan = await Loan.create({
//     user: userId,
//     kyc: kyc._id,

//     full_name: kyc.full_name,
//     mobile: kyc.mobile,
//     email: kyc.email,
//     pan_number: kyc.pan_number,
//     aadhaar_number: kyc.aadhaar_number,
//     monthly_salary: kyc.monthly_salary,
//     bank_name: kyc.bank_name,
//     bank_account_number: kyc.bank_account_number,
//     ifsc_code: kyc.ifsc_code,

//     requested_amount: payload.requested_amount,
//     tenure_months: payload.tenure_months,
//     purpose: payload.purpose || null,
//   });

//   return loan;
// };

// exports.getLoanList = async (userId) => {
//   return await Loan.find({ user: userId }).sort({ createdAt: -1 });
// };

// exports.getLoanById = async (userId, loanId) => {
//   const loan = await Loan.findOne({ _id: loanId, user: userId });
//   if (!loan) throw new ApiError(404, 'Loan application not found');
//   return loan;
// };
// const sendAdminNotification = require('../utils/sendNotification');

// exports.applyLoan = async (userId, payload) => {
//   // ... existing code ...

//   const loan = await Loan.create({ ... });

//   const user = await User.findById(userId);
//   await sendAdminNotification({
//     userId,
//     userName: user?.full_name || 'Unknown',
//     type: 'loan',
//     message: `${user?.full_name} ne ₹${payload.requested_amount} ka loan apply kiya`,
//     data: {
//       loan_id: loan._id,
//       requested_amount: payload.requested_amount,
//       tenure_months: payload.tenure_months,
//     },
//   });

//   return loan;
// };

// src/services/loan.service.js
const Loan = require('../models/loan.model');
const UserKyc = require('../models/userkyc.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const sendAdminNotification = require('../utils/sendNotification');

exports.applyLoan = async (userId, payload) => {
  const kyc = await UserKyc.findOne({ user: userId, status: 'approved' }).sort({ createdAt: -1 });

  if (!kyc) {
    throw new ApiError(400, 'Please complete and get your KYC approved before applying for loan');
  }

  const loan = await Loan.create({
    user: userId,
    kyc: kyc._id,
    full_name: kyc.full_name,
    mobile: kyc.mobile,
    email: kyc.email,
    pan_number: kyc.pan_number,
    aadhaar_number: kyc.aadhaar_number,
    monthly_salary: kyc.monthly_salary,
    bank_name: kyc.bank_name,
    bank_account_number: kyc.bank_account_number,
    ifsc_code: kyc.ifsc_code,
    requested_amount: payload.requested_amount,
    tenure_months: payload.tenure_months,
    purpose: payload.purpose || null,
  });

  // Admin notification
  const user = await User.findById(userId);
  await sendAdminNotification({
    userId,
    userName: user?.full_name || 'Unknown',
    type: 'loan',
    message: `${user?.full_name} ne ₹${payload.requested_amount} ka loan apply kiya`,
    data: {
      loan_id: loan._id,
      requested_amount: payload.requested_amount,
      tenure_months: payload.tenure_months,
    },
  });

  return loan;
};

exports.getLoanList = async (userId) => {
  return await Loan.find({ user: userId }).sort({ createdAt: -1 });
};

exports.getLoanById = async (userId, loanId) => {
  const loan = await Loan.findOne({ _id: loanId, user: userId });
  if (!loan) throw new ApiError(404, 'Loan application not found');
  return loan;
};