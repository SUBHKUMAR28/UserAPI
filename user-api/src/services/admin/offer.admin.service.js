const Offer = require('../../models/offer.model');
const ApiError = require('../../utils/ApiError');

exports.createOffer = async (data) => {
  return await Offer.create(data);
};

exports.getAllOffers = async () => {
  return await Offer.find();
};

exports.updateOffer = async (id, data) => {
  const offer = await Offer.findByIdAndUpdate(id, data, { new: true });
  if (!offer) throw new ApiError(404, 'Offer not found');
  return offer;
};

exports.deleteOffer = async (id) => {
  const offer = await Offer.findByIdAndDelete(id);
  if (!offer) throw new ApiError(404, 'Offer not found');
  return offer;
};