// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  customerSchema,
  createPasswordFromcustomerSchema,
} = require('../validations/auth.validator');


router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.post('/logout', authMiddleware, authController.logout);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/check-customer', validate(customerSchema), authController.checkCustomer);
router.post('/create-password', validate(createPasswordFromcustomerSchema), authController.createPasswordFromCustomer);
module.exports = router;