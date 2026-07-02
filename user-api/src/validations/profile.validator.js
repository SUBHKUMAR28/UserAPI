const Joi = require('joi');

exports.updateProfileSchema = Joi.object({
  full_name: Joi.string().trim().min(2).max(50),
  email: Joi.string().email(),
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).messages({
    'string.pattern.base': 'Mobile number must be a valid 10-digit Indian number',
  }),
});

exports.kycSubmitSchema = Joi.object({
  pan_number: Joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .messages({ 'string.pattern.base': 'Invalid PAN format (e.g. ABCDE1234F)' }),
  aadhaar_number: Joi.string()
    .pattern(/^\d{12}$/)
    .messages({ 'string.pattern.base': 'Aadhaar must be exactly 12 digits' }),
}).or('pan_number', 'aadhaar_number').messages({
  'object.missing': 'pan_number ya aadhaar_number mein se kam se kam ek required hai',
});