const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');
const UserKyc = require('../models/userkyc.model');
const ApiError = require('../utils/ApiError');

exports.getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const kyc = await UserKyc.findOne({ user: userId });

  return {
    user_id: user._id,
    full_name: user.full_name,
    email: user.email,
    mobile: user.mobile,
    profile_image: user.profile_image,
    member_id: user.member_id,
    account_status: user.account_status,
    my_referral_code: user.my_referral_code,
    kyc_status: kyc ? kyc.kyc_status : 'not_submitted',
    pan_number: kyc ? kyc.pan_number : null,
    aadhaar_number: kyc ? kyc.aadhaar_number : null,
  };
};

exports.updateProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (updateData.email && updateData.email !== user.email) {
    const exists = await User.findOne({ email: updateData.email });
    if (exists) throw new ApiError(409, 'Email already in use');
  }

  if (updateData.mobile && updateData.mobile !== user.mobile) {
    const exists = await User.findOne({ mobile: updateData.mobile });
    if (exists) throw new ApiError(409, 'Mobile number already in use');
  }

  // Bug #4 Fix: sirf allowed fields update ho sakti hain (role/account_status se protect)
  const allowedFields = ['full_name', 'email', 'mobile'];
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) user[field] = updateData[field];
  });

  await user.save();
  return user;
};

exports.uploadProfilePhoto = async (userId, fileUrl) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  user.profile_image = fileUrl;
  await user.save();

  return { profile_image: user.profile_image };
};

exports.submitKyc = async (userId, kycData, files) => {
  let kyc = await UserKyc.findOne({ user: userId });

  if (!kyc) {
    kyc = new UserKyc({ user: userId });
  }

  if (kyc.kyc_status === 'approved') {
    throw new ApiError(400, 'KYC already approved, cannot resubmit');
  }

  if (kycData.pan_number) kyc.pan_number = kycData.pan_number;
  if (kycData.aadhaar_number) kyc.aadhaar_number = kycData.aadhaar_number;

  if (files?.pan_image) kyc.pan_image = files.pan_image;
  if (files?.aadhaar_front_image) kyc.aadhaar_front_image = files.aadhaar_front_image;
  if (files?.aadhaar_back_image) kyc.aadhaar_back_image = files.aadhaar_back_image;

  kyc.kyc_status = 'pending';
  kyc.rejection_reason = null;

  await kyc.save();
  return kyc;
};