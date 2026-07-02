const Joi = require('joi');

exports.payEmiSchema = Joi.object({
  emi_id: Joi.string().required(),
  amount: Joi.number().positive().required(),
});