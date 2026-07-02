// const mongoose = require('mongoose');

// const kycSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

//     // Basic
//     full_name: { type: String, required: true },
//     mobile: { type: String, required: true },
//     email: { type: String, required: true },

//     // Identity
//     pan_number: { type: String, required: true },
//     aadhaar_number: { type: String, required: true },
//     pan_image: { type: String, default: null },
//     aadhaar_front_image: { type: String, default: null },
//     aadhaar_back_image: { type: String, default: null },
//     selfie_image: { type: String, default: null },
//     // Personal
//     date_of_birth: { type: Date, required: true },
//     gender: { type: String, enum: ['male', 'female', 'other'], required: true },

//     // Address
//     current_address: { type: String, required: true },
//     pincode: { type: String, required: true },
//     city: { type: String, required: true },
//     state: { type: String, required: true },

//     // Financial
//     employment_type: { type: String, enum: ['salaried', 'self-employed', 'business'], required: true },
//     monthly_salary: { type: Number, required: true },
//     annual_income: { type: Number, required: true },
//     company_name: { type: String },
//     company_address: { type: String },
//     bank_name: { type: String, required: true },
//     bank_account_number: { type: String, required: true },
//     ifsc_code: { type: String, required: true },
//     requested_amount: { type: Number, required: true },

//     // Status
//     status: {
//       type: String,
//       enum: ['pending', 'under_review', 'approved', 'rejected'],
//       default: 'pending',
//     },
//     rejection_reason: { type: String, default: null },
//     reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
//     reviewed_at: { type: Date, default: null },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('UserKyc', kycSchema);

const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Basic
    full_name: { type: String, default: null },
    mobile: { type: String, default: null },
    email: { type: String, default: null },

    // Identity
    pan_number: { type: String, default: null },
    aadhaar_number: { type: String, default: null },

    // Document Images (Cloudinary URLs)
    pan_image: { type: String, default: null },
    aadhaar_front_image: { type: String, default: null },
    aadhaar_back_image: { type: String, default: null },
    selfie_image: { type: String, default: null },

    // Personal
    date_of_birth: { type: Date, default: null },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', null],
      default: null
    },

    // Address
    current_address: { type: String, default: null },
    pincode: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },

    // Financial
    employment_type: {
      type: String,
      enum: ['salaried', 'self-employed', 'business', null],
      default: null,
    },
    monthly_salary: { type: Number, default: null },
    annual_income: { type: Number, default: null },
    company_name: { type: String, default: null },
    company_address: { type: String, default: null },
    bank_name: { type: String, default: null },
    bank_account_number: { type: String, default: null },
    ifsc_code: { type: String, default: null },

    // Status
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
    },
    rejection_reason: { type: String, default: null },
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewed_at: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserKyc', kycSchema);