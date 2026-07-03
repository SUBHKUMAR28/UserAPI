const bannerService = require('../services/banner.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.getBanners = catchAsync(async (req, res) => {
  const banners = await bannerService.getActiveBanners();
  return success(res, 200, 'Banners fetched successfully', banners);
});