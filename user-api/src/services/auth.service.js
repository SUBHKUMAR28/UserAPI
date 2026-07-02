// // src/services/auth.service.js
// const User = require('../models/user.model');
// const Wallet = require('../models/wallet.model');
// const ApiError = require('../utils/ApiError');
// const tokenService = require('./token.service');
// const otpService = require('./otp.service');
// const sendEmail = require('./email.service');

// // Helper: profile + wallet summary build karna (register/login dono me use hoga)
// const buildAuthResponse = async (user, tokens) => {
//   let wallet = await Wallet.findOne({ user: user._id });
//   if (!wallet) {
//     wallet = await Wallet.create({ user: user._id });
//   }

//   return {
//     user_id: user._id,
//     access_token: tokens.access_token,
//     refresh_token: tokens.refresh_token,
//     profile: {
//       full_name: user.full_name,
//       email: user.email,
//       mobile: user.mobile,
//       profile_image: user.profile_image,
//       member_id: user.member_id,
//       account_status: user.account_status,
//       my_referral_code: user.my_referral_code,
//     },
//     wallet_summary: {
//       balance: wallet.balance,
//       total_added: wallet.total_added,
//       total_spent: wallet.total_spent,
//       currency: wallet.currency,
//     },
//   };
// };

// // Unique referral code generate karna
// const generateReferralCode = (name) => {
//   const prefix = name.substring(0, 3).toUpperCase();
//   const random = Math.floor(1000 + Math.random() * 9000);
//   return `${prefix}${random}`;
// };

// exports.register = async (payload) => {
//   const { full_name, email, mobile, password, referral_code, device_id } = payload;

//   const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
//   if (existingUser) {
//     throw new ApiError(409, 'Email or mobile already registered');
//   }

//   let referredByUser = null;
//   if (referral_code) {
//     referredByUser = await User.findOne({ my_referral_code: referral_code });
//     if (!referredByUser) {
//       throw new ApiError(400, 'Invalid referral code');
//     }
//   }

//   const user = await User.create({
//     full_name,
//     email,
//     mobile,
//     password,
//     device_id: device_id || null,
//     referral_code: referral_code || null,
//     referred_by: referredByUser ? referredByUser._id : null,
//     my_referral_code: generateReferralCode(full_name),
//     member_id: `LP${Date.now().toString().slice(-8)}`,
//   });

//   // Wallet buildAuthResponse mein create hogi — yahan dobara mat banao
//   const tokens = tokenService.generateTokens(user._id, user.role);
//   user.refreshToken = tokens.refresh_token;
//   await user.save();

//   return buildAuthResponse(user, tokens);
// };

// // exports.login = async (payload) => {
// //   const { email, mobile, password, device_id } = payload;

// //   const query = email ? { email } : { mobile };
// //   const user = await User.findOne(query);

// //   if (!user) {
// //     throw new ApiError(401, 'Invalid credentials');
// //   }

// //   const isMatch = await user.comparePassword(password);
// //   if (!isMatch) {
// //     throw new ApiError(401, 'Invalid credentials');
// //   }

// //   if (user.account_status !== 'active') {
// //     throw new ApiError(403, `Account is ${user.account_status}`);
// //   }

// //   if (device_id) {
// //     user.device_id = device_id; // latest device track
// //   }

// //   //   const tokens = tokenService.generateTokens(user._id);
// //   const tokens = tokenService.generateTokens(user._id, user.role);
// //   user.refreshToken = tokens.refresh_token;
// //   await user.save();

// //   return buildAuthResponse(user, tokens);
// // };

// exports.login = async (payload) => {
//   const { email, phone, userId, password, device_id } = payload;

//   let query;
//   if (email) query = { email };
//   else if (phone) query = { phone };
//   else if (userId) query = { userId: userId };
//   else throw new ApiError(400, 'Email, mobile or user_id is required');

//   const user = await User.findOne(query);

//   if (!user) {
//     throw new ApiError(401, 'Invalid credentials');
//   }

//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) {
//     throw new ApiError(401, 'Invalid credentials');
//   }

//   if (user.account_status !== 'active') {
//     throw new ApiError(403, `Account is ${user.account_status}`);
//   }

//   if (device_id) {
//     user.device_id = device_id; // latest device track
//   }

//   const tokens = tokenService.generateTokens(user._id, user.role);
//   user.refreshToken = tokens.refresh_token;
//   await user.save();

//   return buildAuthResponse(user, tokens);
// };
// exports.forgotPassword = async (email) => {
//   const user = await User.findOne({ email });
//   if (!user) throw new ApiError(404, 'User not found');

//   const otp = otpService.generateOTP();
//   user.otp = otp;
//   user.otpExpiry = Date.now() + 10 * 60 * 1000;
//   user.otpVerified = false;
//   await user.save();

//   try {
//     await sendEmail(email, 'Password Reset OTP', `Your OTP is: ${otp}. Valid for 10 minutes.`);
//   } catch (err) {
//     console.log('Email send failed:', err.message);
//   }

//   return process.env.NODE_ENV === 'development' ? { otp } : {};
// };

// exports.verifyOtp = async (email, otp) => {
//   const user = await User.findOne({ email });
//   if (!user) throw new ApiError(404, 'User not found');

//   if (!user.otp || user.otp !== otp) {
//     throw new ApiError(400, 'Invalid OTP');
//   }

//   if (user.otpExpiry < Date.now()) {
//     throw new ApiError(400, 'OTP expired');
//   }

//   user.otpVerified = true;
//   user.otp = null;
//   await user.save();

//   return true;
// };

// exports.resetPassword = async (email, newPassword, confirmPassword) => {
//   if (newPassword !== confirmPassword) {
//     throw new ApiError(400, 'Passwords do not match');
//   }

//   const user = await User.findOne({ email });
//   if (!user) throw new ApiError(404, 'User not found');

//   if (!user.otpVerified) {
//     throw new ApiError(400, 'OTP verification required before reset');
//   }

//   user.password = newPassword;
//   user.otpVerified = false;
//   user.refreshToken = null;
//   await user.save();

//   return true;
// };

// exports.logout = async (userId) => {
//   await User.findByIdAndUpdate(userId, { refreshToken: null });
//   return true;
// };

// exports.refreshToken = async (oldRefreshToken) => {
//   let decoded;
//   try {
//     decoded = tokenService.verifyRefreshToken(oldRefreshToken);
//   } catch (err) {
//     throw new ApiError(401, 'Invalid or expired refresh token');
//   }

//   const user = await User.findById(decoded.id);
//   if (!user || user.refreshToken !== oldRefreshToken) {
//     throw new ApiError(401, 'Refresh token mismatch');
//   }

// //   const tokens = tokenService.generateTokens(user._id);
//   const tokens = tokenService.generateTokens(user._id, user.role);
//   user.refreshToken = tokens.refresh_token;
//   await user.save();

//   return tokens;
// };

// src/services/auth.service.js

const mongoose = require('mongoose');
const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');
const ApiError = require('../utils/ApiError');
const tokenService = require('./token.service');
const otpService = require('./otp.service');
const sendEmail = require('./email.service');

// Helper: profile + wallet summary build karna
const buildAuthResponse = async (user, tokens) => {
  let wallet = await Wallet.findOne({ user: user._id });
  if (!wallet) {
    wallet = await Wallet.create({ user: user._id });
  }

  return {
    user_id: user._id,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    profile: {
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      profile_image: user.profile_image,
      member_id: user.member_id,
      account_status: user.account_status,
      my_referral_code: user.my_referral_code,
    },
    wallet_summary: {
      balance: wallet.balance,
      total_added: wallet.total_added,
      total_spent: wallet.total_spent,
      currency: wallet.currency,
    },
  };
};

// Unique referral code generate karna
const generateReferralCode = (name) => {
  const prefix = name.substring(0, 3).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${random}`;
};

exports.register = async (payload) => {
  const { full_name, email, phone, password, referral_code, device_id } = payload;

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    throw new ApiError(409, 'Email or phone already registered');
  }

  let referredByUser = null;
  if (referral_code) {
    referredByUser = await User.findOne({ my_referral_code: referral_code });
    if (!referredByUser) {
      throw new ApiError(400, 'Invalid referral code');
    }
  }

  const user = await User.create({
    full_name,
    email,
    phone,
    password,
    device_id: device_id || null,
    referral_code: referral_code || null,
    referred_by: referredByUser ? referredByUser._id : null,
    my_referral_code: generateReferralCode(full_name),
    member_id: `LP${Date.now().toString().slice(-8)}`,
  });

  const tokens = tokenService.generateTokens(user._id, user.role);
  user.refreshToken = tokens.refresh_token;
  await user.save();

  return buildAuthResponse(user, tokens);
};

exports.login = async (payload) => {
  const { email, phone, userId, password, device_id } = payload;

  let query;
  if (email) query = { email };
  else if (phone) query = { phone };
  else if (userId) query = { userId };
  else throw new ApiError(400, 'Email, phone or userId is required');

  const user = await User.findOne(query);

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (user.account_status !== 'active') {
    throw new ApiError(403, `Account is ${user.account_status}`);
  }

  if (device_id) {
    user.device_id = device_id;
  }

  const tokens = tokenService.generateTokens(user._id, user.role);
  user.refreshToken = tokens.refresh_token;
  await user.save();

  return buildAuthResponse(user, tokens);
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');

  const otp = otpService.generateOTP();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  user.otpVerified = false;
  await user.save();

  try {
    await sendEmail(email, 'Password Reset OTP', `Your OTP is: ${otp}. Valid for 10 minutes.`);
  } catch (err) {
    console.log('Email send failed:', err.message);
  }

  return process.env.NODE_ENV === 'development' ? { otp } : {};
};

exports.verifyOtp = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');

  if (!user.otp || user.otp !== otp) {
    throw new ApiError(400, 'Invalid OTP');
  }

  if (user.otpExpiry < Date.now()) {
    throw new ApiError(400, 'OTP expired');
  }

  user.otpVerified = true;
  user.otp = null;
  await user.save();

  return true;
};

exports.resetPassword = async (email, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, 'Passwords do not match');
  }

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');

  if (!user.otpVerified) {
    throw new ApiError(400, 'OTP verification required before reset');
  }

  user.password = newPassword;
  user.otpVerified = false;
  user.refreshToken = null;
  await user.save();

  return true;
};

exports.logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  return true;
};

exports.refreshToken = async (oldRefreshToken) => {
  let decoded;
  try {
    decoded = tokenService.verifyRefreshToken(oldRefreshToken);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== oldRefreshToken) {
    throw new ApiError(401, 'Refresh token mismatch');
  }

  const tokens = tokenService.generateTokens(user._id, user.role);
  user.refreshToken = tokens.refresh_token;
  await user.save();

  return tokens;
};

// ---------- Customer Auth ----------

exports.checkCustomer = async (payload) => {
  const { phone, userId } = payload;

  let query;
  if (phone) query = { phone };
  else if (userId) query = { userId };
  else throw new ApiError(400, 'Phone or userId is required');

  const customer = await mongoose.connection.db.collection('customers').findOne(query);

  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  const existingUser = await User.findOne({ phone: customer.phone });
  if (existingUser) {
    return {
      exists: true,
      already_registered: true,
      message: 'Password already set. Please login',
    };
  }

  return {
    exists: true,
    already_registered: false,
    name: customer.name,
    phone: customer.phone,
    profileImage: customer.profileImage || null,
    message: 'Customer found. Please create password',
  };
};

exports.createPasswordFromCustomer = async (payload) => {
  const { phone, userId, password, confirmPassword } = payload;

  if (password !== confirmPassword) {
    throw new ApiError(400, 'Passwords do not match');
  }

  let query;
  if (phone) query = { phone };
  else if (userId) query = { userId };
  else throw new ApiError(400, 'Phone or userId is required');

  const customer = await mongoose.connection.db.collection('customers').findOne(query);

  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  const existingUser = await User.findOne({ mobile: customer.phone });
  if (existingUser) {
    throw new ApiError(409, 'User already registered. Please login');
  }

  const user = await User.create({
    full_name: customer.name,
    email: customer.email || `${customer.phone}@noemail.com`,
    phone: customer.phone,
    password,
    profile_image: customer.profileImage || null,
    // member_id: customer.userId,
    my_referral_code: generateReferralCode(customer.name),

    customer_id: customer._id || null,
    userId: customer.userId || null,
    keyRemoveCode: customer.keyRemoveCode || null,
    // dob: customer.dob || null,
    // aadhaarNumber: customer.aadhaarNumber || null,
    // aadhaarFront: customer.aadhaarFront || null,
    // aadhaarBack: customer.aadhaarBack || null,
    // signature: customer.signature || null,
    companyId: customer.companyId || null,
    imei1: customer.imei1 || null,
    imei2: customer.imei2 || null,
    deviceType: customer.deviceType || null,

    loanby: customer.loanby ? {
      loanBy: customer.loanby?.loanBy ?? null,
      key_type: customer.loanby?.key_type ?? null,
      retailer_id: customer.loanby?.retailer_id ?? null,
      bank_id: customer.loanby?.bank_id ?? null,
      author: customer.loanby?.author ?? null,
      is_link: customer.loanby?.is_link ?? false,
      isActive: customer.loanby?.isActive ?? false,
      deviceId: customer.loanby?.deviceId ?? null,
      kycStatus: customer.loanby?.kycStatus ?? 'pending',
      kycRejectionReason: customer.loanby?.kycRejectionReason ?? null,
      kycVerifiedAt: customer.loanby?.kycVerifiedAt ?? null,
      emi: {
        total_amount: customer.loanby?.emi?.total_amount ?? 0,
        down_payment: customer.loanby?.emi?.down_payment ?? 0,
        loan_amount: customer.loanby?.emi?.loan_amount ?? 0,
        interest_rate: customer.loanby?.emi?.interest_rate ?? 0,
        emi_amount: customer.loanby?.emi?.emi_amount ?? 0,
        tenure_months: customer.loanby?.emi?.tenure_months ?? 0,
        total_emi_paid: customer.loanby?.emi?.total_emi_paid ?? 0,
        total_emi_remaining: customer.loanby?.emi?.total_emi_remaining ?? 0,
        start_date: customer.loanby?.emi?.start_date ?? null,
        end_date: customer.loanby?.emi?.end_date ?? null,
        next_due_date: customer.loanby?.emi?.next_due_date ?? null,
        bank_id: customer.loanby?.emi?.bank_id ?? null,
        loan_provider: customer.loanby?.emi?.loan_provider ?? null,
        loan_account_number: customer.loanby?.emi?.loan_account_number ?? null,
        payment_history: customer.loanby?.emi?.payment_history ?? [],
        status: customer.loanby?.emi?.status ?? 'active',
        is_overdue: customer.loanby?.emi?.is_overdue ?? false,
        overdue_days: customer.loanby?.emi?.overdue_days ?? 0,
        overdue_amount: customer.loanby?.emi?.overdue_amount ?? 0,
      },
    } : undefined,
  });

  const tokens = tokenService.generateTokens(user._id, user.role);
  user.refreshToken = tokens.refresh_token;
  await user.save();

  return buildAuthResponse(user, tokens);
};