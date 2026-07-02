const Kyc = require('../../models/userkyc.model');
const ApiError = require('../../utils/ApiError');

exports.getAllKyc = async (status) => {
  const filter = status ? { status } : {};
  return await Kyc.find(filter)
    .populate('user', 'full_name email mobile')
    .sort({ createdAt: -1 });
};

exports.getKycById = async (id) => {
  const kyc = await Kyc.findById(id).populate('user', 'full_name email mobile');
  if (!kyc) throw new ApiError(404, 'KYC not found');
  return kyc;
};

exports.updateKycStatus = async (id, { status, rejection_reason }, adminId) => {
  const kyc = await Kyc.findById(id);
  if (!kyc) throw new ApiError(404, 'KYC not found');

  if (!['approved', 'rejected', 'under_review'].includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  if (status === 'rejected' && !rejection_reason) {
    throw new ApiError(400, 'Rejection reason required');
  }

  kyc.status = status;
  kyc.rejection_reason = rejection_reason || null;
  kyc.reviewed_by = adminId;
  kyc.reviewed_at = new Date();
  await kyc.save();

  return kyc;
};