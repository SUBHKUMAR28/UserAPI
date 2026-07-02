

// const Kyc = require('../models/userkyc.model');
// const ApiError = require('../utils/ApiError');

// // ==================== Regex Patterns ====================
// const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
// const AADHAAR_REGEX = /^\d{12}$/;
// const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
// const MOBILE_REGEX = /^[6-9]\d{9}$/;

// // ==================== Helper: Age Calculate ====================
// const calculateAge = (dob) => {
//   const birthDate = new Date(dob);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// };

// // ==================== Submit KYC ====================
// exports.submitKyc = async (userId, data, files) => {
//   // ---------- 1. Duplicate check (same user) ----------
//   const existing = await Kyc.findOne({
//     user: userId,
//     status: { $in: ['pending', 'under_review', 'approved'] },
//   });
//   if (existing) {
//     throw new ApiError(400, 'KYC already submitted or approved');
//   }

//   // ---------- 2. File validation (required images) ----------
//   if (!files?.pan_image?.[0]) {
//     throw new ApiError(400, 'PAN image is required');
//   }
//   if (!files?.aadhaar_front_image?.[0]) {
//     throw new ApiError(400, 'Aadhaar front image is required');
//   }
//   if (!files?.aadhaar_back_image?.[0]) {
//     throw new ApiError(400, 'Aadhaar back image is required');
//   }
//   if (!files?.selfie_image?.[0]) {
//     throw new ApiError(400, 'Selfie image is required');
//   }

//   // ---------- 3. Format validation (PAN / Aadhaar / IFSC / Mobile) ----------
//   const pan_number = data.pan_number?.trim().toUpperCase();
//   const aadhaar_number = data.aadhaar_number?.trim();
//   const ifsc_code = data.ifsc_code?.trim().toUpperCase();
//   const mobile = data.mobile?.trim();

//   if (!pan_number || !PAN_REGEX.test(pan_number)) {
//     throw new ApiError(400, 'Invalid PAN number format (e.g. ABCDE1234F)');
//   }
//   if (!aadhaar_number || !AADHAAR_REGEX.test(aadhaar_number)) {
//     throw new ApiError(400, 'Invalid Aadhaar number format (must be 12 digits)');
//   }
//   if (!ifsc_code || !IFSC_REGEX.test(ifsc_code)) {
//     throw new ApiError(400, 'Invalid IFSC code format (e.g. HDFC0001234)');
//   }
//   if (!mobile || !MOBILE_REGEX.test(mobile)) {
//     throw new ApiError(400, 'Invalid mobile number format');
//   }

//   // ---------- 4. Duplicate PAN / Aadhaar check (fraud prevention) ----------
//   const duplicatePan = await Kyc.findOne({
//     pan_number,
//     status: { $ne: 'rejected' },
//   });
//   if (duplicatePan) {
//     throw new ApiError(400, 'This PAN number is already registered');
//   }

//   const duplicateAadhaar = await Kyc.findOne({
//     aadhaar_number,
//     status: { $ne: 'rejected' },
//   });
//   if (duplicateAadhaar) {
//     throw new ApiError(400, 'This Aadhaar number is already registered');
//   }

//   // ---------- 5. Age validation (18+) ----------
//   if (!data.date_of_birth) {
//     throw new ApiError(400, 'Date of birth is required');
//   }
//   const age = calculateAge(data.date_of_birth);
//   if (age < 18) {
//     throw new ApiError(400, 'Applicant must be at least 18 years old');
//   }
//   if (age > 100) {
//     throw new ApiError(400, 'Invalid date of birth');
//   }

//   // ---------- 6. KYC create ----------
//   const kyc = await Kyc.create({
//     user: userId,
//     ...data,
//     pan_number,
//     aadhaar_number,
//     ifsc_code,
//     mobile,
//     gender: data.gender?.trim(),
//     employment_type: data.employment_type?.trim(),
//     pan_image: files.pan_image[0].path,
//     aadhaar_front_image: files.aadhaar_front_image[0].path,
//     aadhaar_back_image: files.aadhaar_back_image[0].path,
//     selfie_image: files.selfie_image[0].path,
//   });

//   return kyc;
// };

// // ==================== Get KYC Status ====================
// exports.getKycStatus = async (userId) => {
//   const kyc = await Kyc.findOne({ user: userId }).sort({ createdAt: -1 });
//   if (!kyc) {
//     throw new ApiError(404, 'KYC not submitted yet');
//   }
//   return {
//     kyc_id: kyc._id,
//     status: kyc.status,
//     rejection_reason: kyc.rejection_reason,
//     submitted_at: kyc.createdAt,
//     reviewed_at: kyc.reviewed_at,
//   };
// };
const Kyc = require('../models/userkyc.model');

// ==================== Regex Patterns ====================
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const AADHAAR_REGEX = /^\d{12}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;

// ==================== Helper: Age Calculate ====================
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// ==================== Submit / Update KYC (Upsert) ====================
exports.submitKyc = async (userId, data, files) => {

  // Sirf jo data aaya hai usse validate karo (optional validation)
  const updateData = {};

  // Basic fields - agar aaye to save karo, nahi to null rahega
  if (data.full_name) updateData.full_name = data.full_name.trim();
  if (data.email) updateData.email = data.email.trim();

  // Mobile - format validate karo agar diya ho
  if (data.mobile) {
    const mobile = data.mobile.trim();
    if (!MOBILE_REGEX.test(mobile)) {
      throw new Error('Invalid mobile number format');
    }
    updateData.mobile = mobile;
  }

  // PAN - format validate karo agar diya ho
  if (data.pan_number) {
    const pan = data.pan_number.trim().toUpperCase();
    if (!PAN_REGEX.test(pan)) {
      throw new Error('Invalid PAN number format (e.g. ABCDE1234F)');
    }
    updateData.pan_number = pan;
  }

  // Aadhaar - format validate karo agar diya ho
  if (data.aadhaar_number) {
    const aadhaar = data.aadhaar_number.trim();
    if (!AADHAAR_REGEX.test(aadhaar)) {
      throw new Error('Invalid Aadhaar number format (must be 12 digits)');
    }
    updateData.aadhaar_number = aadhaar;
  }

  // Personal fields
  if (data.gender) updateData.gender = data.gender.trim();
  if (data.date_of_birth) {
    const age = calculateAge(data.date_of_birth);
    if (age < 18) throw new Error('Applicant must be at least 18 years old');
    if (age > 100) throw new Error('Invalid date of birth');
    updateData.date_of_birth = data.date_of_birth;
  }

  // Address fields
  if (data.current_address) updateData.current_address = data.current_address.trim();
  if (data.pincode) updateData.pincode = data.pincode.trim();
  if (data.city) updateData.city = data.city.trim();
  if (data.state) updateData.state = data.state.trim();

  // Financial fields
  if (data.employment_type) updateData.employment_type = data.employment_type.trim();
  if (data.monthly_salary) updateData.monthly_salary = Number(data.monthly_salary);
  if (data.annual_income) updateData.annual_income = Number(data.annual_income);
  if (data.company_name) updateData.company_name = data.company_name.trim();
  if (data.company_address) updateData.company_address = data.company_address.trim();
  if (data.bank_name) updateData.bank_name = data.bank_name.trim();
  if (data.bank_account_number) updateData.bank_account_number = data.bank_account_number.trim();

  // IFSC - format validate karo agar diya ho
  if (data.ifsc_code) {
    const ifsc = data.ifsc_code.trim().toUpperCase();
    if (!IFSC_REGEX.test(ifsc)) {
      throw new Error('Invalid IFSC code format (e.g. HDFC0001234)');
    }
    updateData.ifsc_code = ifsc;
  }

  // Images - agar file aayi to Cloudinary URL save karo, nahi to null rahega
  if (files?.pan_image?.[0]) updateData.pan_image = files.pan_image[0].path;
  if (files?.aadhaar_front_image?.[0]) updateData.aadhaar_front_image = files.aadhaar_front_image[0].path;
  if (files?.aadhaar_back_image?.[0]) updateData.aadhaar_back_image = files.aadhaar_back_image[0].path;
  if (files?.selfie_image?.[0]) updateData.selfie_image = files.selfie_image[0].path;

  // Status reset - jab bhi submit hoga, pending ho jayega
  updateData.status = 'pending';
  updateData.rejection_reason = null;

  // UPSERT - agar exist karta hai to update, nahi to create
  const kyc = await Kyc.findOneAndUpdate(
    { user: userId },
    {
      $set: updateData,
      $setOnInsert: { user: userId }, // sirf create hone par
    },
    {
      new: true,
      upsert: true,
    }
  );

  return kyc;
};

// ==================== Get KYC ====================
exports.getKycStatus = async (userId) => {
  const kyc = await Kyc.findOne({ user: userId }).sort({ createdAt: -1 });
  if (!kyc) return null; // error nahi throw karenge, null return karenge
  return kyc;
};