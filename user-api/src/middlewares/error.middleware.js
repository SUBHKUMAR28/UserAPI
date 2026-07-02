const ApiError = require('../utils/ApiError');

module.exports = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ status: false, message: err.message });
  }
  console.error(err);
  return res.status(500).json({ status: false, message: 'Internal server error' });
};