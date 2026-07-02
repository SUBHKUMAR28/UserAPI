const Joi = require('joi');

exports.applyLoanSchema = Joi.object({
  requested_amount: Joi.number().positive().required(),
  tenure_months: Joi.number().integer().min(1).max(60).required(),
  purpose: Joi.string().trim().optional().allow(''),
});