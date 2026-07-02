exports.success = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({ status: true, message, data });
};

exports.error = (res, statusCode, message) => {
  return res.status(statusCode).json({ status: false, message });
};