const Emi = require('../../models/emi.model');
const ApiError = require('../../utils/ApiError');

exports.createEmi = async (data) => {
  return await Emi.create(data);
};

exports.getAllEmis = async () => {
  return await Emi.find().populate('user', 'full_name email mobile');
};

exports.updateEmi = async (id, data) => {
  const emi = await Emi.findByIdAndUpdate(id, data, { new: true });
  if (!emi) throw new ApiError(404, 'EMI not found');
  return emi;
};

exports.deleteEmi = async (id) => {
  const emi = await Emi.findByIdAndDelete(id);
  if (!emi) throw new ApiError(404, 'EMI not found');
  return emi;
};