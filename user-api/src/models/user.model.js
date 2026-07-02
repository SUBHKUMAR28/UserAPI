// // src/models/user.model.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema(
//   {
//     full_name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     mobile: { type: String, required: true, unique: true, trim: true },
//     password: { type: String, required: true, minlength: 6 },

//     referral_code: { type: String, default: null }, // jo isne use kiya
//     my_referral_code: { type: String, unique: true }, // iska apna code (auto-generate)
//     referred_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

//     device_id: { type: String, default: null },

//     profile_image: { type: String, default: null },
//     member_id: { type: String, unique: true, sparse: true },
//     account_status: { type: String, enum: ['active', 'inactive', 'blocked'], default: 'active' },
//     role: { type: String, enum: ['user', 'admin'], default: 'user' },
//     isVerified: { type: Boolean, default: false },

//     otp: { type: String, default: null },
//     otpExpiry: { type: Date, default: null },
//     otpVerified: { type: Boolean, default: false },

//     refreshToken: { type: String, default: null },
//   },
//   { timestamps: true }
// );

// // userSchema.pre('save', async function (next) {
// //   if (!this.isModified('password')) return next();
// //   const salt = await bcrypt.genSalt(10);
// //   this.password = await bcrypt.hash(this.password, salt);
// //   next();
// // });
// userSchema.pre('save', async function () {
//   if (!this.isModified('password')) return;
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// userSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   delete obj.otp;
//   delete obj.refreshToken;
//   return obj;
// };

// module.exports = mongoose.model('User', userSchema);
// src/models/user.model.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },

    referral_code: { type: String, default: null },
    my_referral_code: { type: String, unique: true },
    referred_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    device_id: { type: String, default: null },

    profile_image: { type: String, default: null },
    member_id: { type: String, unique: true, sparse: true },
    account_status: { type: String, enum: ['active', 'inactive', 'blocked'], default: 'active' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },

    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    otpVerified: { type: Boolean, default: false },

    refreshToken: { type: String, default: null },

    // ---------- Customer se copy kiya gaya data ----------
    customer_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    userId: { type: String, default: null },
    keyRemoveCode: { type: String, default: null },
    dob: { type: Date, default: null },
    aadhaarNumber: { type: String, default: null },
    aadhaarFront: { type: String, default: null },
    aadhaarBack: { type: String, default: null },
    signature: { type: String, default: null },
    companyId: { type: mongoose.Schema.Types.ObjectId, default: null },
    imei1: { type: String, default: null },
    imei2: { type: String, default: null },
    deviceType: { type: String, default: null },

    loanby: {
      loanBy: { type: String, default: null },
      key_type: { type: String, default: null },
      retailer_id: { type: mongoose.Schema.Types.ObjectId, default: null },
      bank_id: { type: mongoose.Schema.Types.ObjectId, default: null },
      author: { type: mongoose.Schema.Types.ObjectId, default: null },
      is_link: { type: Boolean, default: false },
      isActive: { type: Boolean, default: false },
      deviceId: { type: mongoose.Schema.Types.ObjectId, default: null },
      kycStatus: { type: String, default: 'pending' },
      kycRejectionReason: { type: String, default: null },
      kycVerifiedAt: { type: Date, default: null },
      emi: {
        total_amount: { type: Number, default: 0 },
        down_payment: { type: Number, default: 0 },
        loan_amount: { type: Number, default: 0 },
        interest_rate: { type: Number, default: 0 },
        emi_amount: { type: Number, default: 0 },
        tenure_months: { type: Number, default: 0 },
        total_emi_paid: { type: Number, default: 0 },
        total_emi_remaining: { type: Number, default: 0 },
        start_date: { type: Date, default: null },
        end_date: { type: Date, default: null },
        next_due_date: { type: Date, default: null },
        bank_id: { type: mongoose.Schema.Types.ObjectId, default: null },
        loan_provider: { type: String, default: null },
        loan_account_number: { type: String, default: null },
        payment_history: { type: Array, default: [] },
        status: { type: String, default: 'active' },
        is_overdue: { type: Boolean, default: false },
        overdue_days: { type: Number, default: 0 },
        overdue_amount: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);