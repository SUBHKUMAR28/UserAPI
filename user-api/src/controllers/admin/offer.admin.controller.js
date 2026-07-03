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

exports.getOfferById = catchAsync(async (req, res) => {
  const offer = await offerService.getOfferById(req.params.id);
  return success(res, 200, 'Offer fetched successfully', offer);
});

exports.updateOffer = catchAsync(async (req, res) => {
  const offer = await offerService.updateOffer(req.params.id, req.body);
  return success(res, 200, 'Offer updated successfully', offer);
});

exports.deleteOffer = catchAsync(async (req, res) => {
  await offerService.deleteOffer(req.params.id);
  return success(res, 200, 'Offer deleted successfully');
});

// Offer me product add karo
exports.addProductToOffer = catchAsync(async (req, res) => {
  const { productId } = req.body;
  const offer = await offerService.addProductToOffer(req.params.id, productId);
  return success(res, 200, 'Product added to offer successfully', offer);
});

// Offer se product remove karo
exports.removeProductFromOffer = catchAsync(async (req, res) => {
  const { productId } = req.body;
  const offer = await offerService.removeProductFromOffer(req.params.id, productId);
  return success(res, 200, 'Product removed from offer successfully', offer);
});