
const Kyc = require('../models/userkyc.model');
const sendAdminNotification = require('../utils/sendNotification');
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
  
  // Notification bhejo
  const user = await User.findById(userId);
  await sendAdminNotification({
    userId,
    userName: user?.full_name || 'Unknown',
    type: 'kyc',
    message: `${user?.full_name} ne KYC submit ki`,
    data: { kyc_id: kyc._id, status: kyc.status },
  });

  return kyc;
};

// ==================== Get KYC ====================
exports.getKycStatus = async (userId) => {
  const kyc = await Kyc.findOne({ user: userId }).sort({ createdAt: -1 });
  if (!kyc) return null; // error nahi throw karenge, null return karenge
  return kyc;
};





