// src/models/loan.model.js
const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kyc: { type: mongoose.Schema.Types.ObjectId, ref: 'UserKyc', required: true }, // konsi KYC se loan liya

    // Snapshot - KYC se copy kiya gaya (taaki future me KYC change ho to purana loan record affect na ho)
    full_name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    pan_number: { type: String, required: true },
    aadhaar_number: { type: String, required: true },
    monthly_salary: { type: Number, required: true },
    bank_name: { type: String, required: true },
    bank_account_number: { type: String, required: true },
    ifsc_code: { type: String, required: true },

    // Naya data jo sirf Loan ke time poocha jata hai
    requested_amount: { type: Number, required: true },
    tenure_months: { type: Number, required: true },
    purpose: { type: String, default: null },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'disbursed'],
      default: 'pending',
    },
    rejection_reason: { type: String, default: null },
    approved_amount: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Loan', loanSchema);