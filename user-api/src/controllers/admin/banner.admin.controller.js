const bannerService = require('../../services/admin/banner.admin.service');
const catchAsync = require('../../utils/catchAsync');
const { success } = require('../../utils/apiResponse');

exports.createBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.createBanner(req.body);
  return success(res, 201, 'Banner created successfully', banner);
});

exports.getAllBanners = catchAsync(async (req, res) => {
  const banners = await bannerService.getAllBanners();
  return success(res, 200, 'Banners fetched successfully', banners);
});

exports.updateBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.updateBanner(req.params.id, req.body);
  return success(res, 200, 'Banner updated successfully', banner);
});

exports.deleteBanner = catchAsync(async (req, res) => {
  await bannerService.deleteBanner(req.params.id);
  return success(res, 200, 'Banner deleted successfully');
});