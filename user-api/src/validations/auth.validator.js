// // src/validations/auth.validator.js
// const Joi = require('joi');

// exports.registerSchema = Joi.object({
//   full_name: Joi.string().trim().min(2).max(50).required(),
//   email: Joi.string().email().required(),
//   mobile: Joi.string()
//     .pattern(/^[6-9]\d{9}$/)
//     .required()
//     .messages({ 'string.pattern.base': 'Mobile must be a valid 10-digit Indian number' }),
//   password: Joi.string().min(6).required(),
//   referral_code: Joi.string().trim().optional().allow(null, ''),
//   device_id: Joi.string().trim().optional().allow(null, ''),
// });

// exports.loginSchema = Joi.object({
//   email: Joi.string().email().optional(),
//   mobile: Joi.string()
//     .pattern(/^[6-9]\d{9}$/)
//     .optional(),
//   password: Joi.string().required(),
//   device_id: Joi.string().trim().optional().allow(null, ''),
// })
//   .or('email', 'mobile')
//   .messages({ 'object.missing': 'Either email or mobile is required' });

// exports.forgotPasswordSchema = Joi.object({
//   email: Joi.string().email().required(),
// });

// exports.verifyOtpSchema = Joi.object({
//   email: Joi.string().email().required(),
//   otp: Joi.string().length(6).required(),
// });

// exports.resetPasswordSchema = Joi.object({
//   email: Joi.string().email().required(),
//   newPassword: Joi.string().min(6).required(),
//   confirmPassword: Joi.string().min(6).required(),
// });

// exports.refreshTokenSchema = Joi.object({
//   refresh_token: Joi.string().required(),
// });

// src/validations/auth.validator.js

const Joi = require('joi');

exports.registerSchema = Joi.object({
  full_name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({ 'string.pattern.base': 'Phone must be a valid 10-digit Indian number' }),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').optional().default('user'),
  referral_code: Joi.string().trim().optional().allow(null, ''),
  device_id: Joi.string().trim().optional().allow(null, ''),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().optional(),
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
  userId: Joi.string().trim().optional(),
  role: Joi.string().valid('user', 'admin').optional(), 
  password: Joi.string().required(),
  device_id: Joi.string().trim().optional().allow(null, ''),
}).or('email', 'mobile', 'phone', 'userId')
  .messages({ 'object.missing': 'Either email, mobile, phone or userId is required' });

exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

exports.verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

exports.resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().min(6).required(),
});

exports.refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

exports.customerSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .messages({ 'string.pattern.base': 'Phone must be a valid 10-digit Indian number' }),
  userId: Joi.string().trim().optional(),
}).or('phone', 'userId')
  .messages({ 'object.missing': 'Either phone or userId is required' });

exports.createPasswordFromcustomerSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .messages({ 'string.pattern.base': 'Phone must be a valid 10-digit Indian number' }),
  userId: Joi.string().trim().optional(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().min(6).required(),
}).or('phone', 'userId')
  .messages({ 'object.missing': 'Either phone or userId is required' });