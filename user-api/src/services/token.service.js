// src/services/token.service.js
const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
console.log('DEBUG ACCESS_SECRET:', ACCESS_SECRET); // ye line add karo
console.log('DEBUG REFRESH_SECRET:', REFRESH_SECRET); // ye line add karo

exports.generateTokens = (userId, role) => {
  const access_token = jwt.sign({ id: userId, role }, ACCESS_SECRET, { expiresIn: '1d' });
  const refresh_token = jwt.sign({ id: userId, role }, REFRESH_SECRET, { expiresIn: '7d' });
  return { access_token, refresh_token };
};

exports.verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);
exports.verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);