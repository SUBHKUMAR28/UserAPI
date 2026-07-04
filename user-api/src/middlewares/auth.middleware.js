// // src/middlewares/auth.middleware.js
// const tokenService = require('../services/token.service');
// const ApiError = require('../utils/ApiError');

// module.exports = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new ApiError(401, 'Access token missing');
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = tokenService.verifyAccessToken(token);

//     // req.user = { id: decoded.id };
//     req.user = { id: decoded.id, role: decoded.role };
//     next();
//   } catch (err) {
//     return res.status(401).json({ status: false, message: 'Invalid or expired token' });
//   }
// };
// src/middlewares/auth.middleware.js

const tokenService = require('../services/token.service');
const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Token missing
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: false,
        message: 'Please login to continue',
        error_code: 'UNAUTHORIZED',  // Flutter app is code ko check karega
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = tokenService.verifyAccessToken(token);
    } catch (err) {
      // Token expired ya invalid
      return res.status(401).json({
        status: false,
        message: 'Session expired, please login again',
        error_code: 'TOKEN_EXPIRED',
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'User not found, please login again',
        error_code: 'USER_NOT_FOUND',
      });
    }

    if (user.account_status !== 'active') {
      return res.status(403).json({
        status: false,
        message: `Your account is ${user.account_status}`,
        error_code: 'ACCOUNT_BLOCKED',
      });
    }

    // req.user = { id: decoded.id };
    // req.userRole = user.role || 'user';
    req.user = { 
  id: decoded.id,
  role: user.role || 'user',      // ← yahan add karo
  status: user.account_status,
};
    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: 'Authentication failed',
      error_code: 'AUTH_FAILED',
    });
  }
};