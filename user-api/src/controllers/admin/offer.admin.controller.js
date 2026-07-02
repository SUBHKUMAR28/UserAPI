const offerService = require('../../services/admin/offer.admin.service');
const catchAsync = require('../../utils/catchAsync');
const { success } = require('../../utils/apiResponse');

exports.createOffer = catchAsync(async (req, res) => {
  const offer = await offerService.createOffer(req.body);
  return success(res, 201, 'Offer created successfully', offer);
});

exports.getAllOffers = catchAsync(async (req, res) => {
  const offers = await offerService.getAllOffers();
  return success(res, 200, 'Offers fetched successfully', offers);
});

exports.updateOffer = catchAsync(async (req, res) => {
  const offer = await offerService.updateOffer(req.params.id, req.body);
  return success(res, 200, 'Offer updated successfully', offer);
});

exports.deleteOffer = catchAsync(async (req, res) => {
  await offerService.deleteOffer(req.params.id);
  return success(res, 200, 'Offer deleted successfully');
});