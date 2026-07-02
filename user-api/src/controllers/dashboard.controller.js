const dashboardService = require('../services/dashboard.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.getDashboard = catchAsync(async (req, res) => {
  const data = await dashboardService.getDashboard(req.user.id);
  return success(res, 200, 'Dashboard data fetched successfully', data);
});