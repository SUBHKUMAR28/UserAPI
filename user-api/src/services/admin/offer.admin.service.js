// const Offer = require('../../models/offer.model');
// const ApiError = require('../../utils/ApiError');

// exports.createOffer = async (data) => {
//   return await Offer.create(data);
// };

// exports.getAllOffers = async () => {
//   return await Offer.find()
//     .populate('applicable_products', 'name price discounted_price images')
//     .sort({ createdAt: -1 });
// };

// exports.getOfferById = async (id) => {
//   const offer = await Offer.findById(id)
//     .populate('applicable_products', 'name price discounted_price images');
//   if (!offer) throw new ApiError(404, 'Offer not found');
//   return offer;
// };

// exports.updateOffer = async (id, data) => {
//   const offer = await Offer.findByIdAndUpdate(id, data, { new: true })
//     .populate('applicable_products', 'name price discounted_price images');
//   if (!offer) throw new ApiError(404, 'Offer not found');
//   return offer;
// };

// exports.deleteOffer = async (id) => {
//   const offer = await Offer.findByIdAndDelete(id);
//   if (!offer) throw new ApiError(404, 'Offer not found');
//   return offer;
// };

// // Specific product ke saare active offers fetch karo
// exports.getOffersByProduct = async (productId) => {
//   const now = new Date();
//   return await Offer.find({
//     applicable_products: productId,
//     is_active: true,
//     $or: [
//       { valid_till: null },
//       { valid_till: { $gte: now } },
//     ],
//   });
// };

// // Offer me product add karo
// exports.addProductToOffer = async (offerId, productId) => {
//   const offer = await Offer.findByIdAndUpdate(
//     offerId,
//     { $addToSet: { applicable_products: productId } }, // duplicate nahi jayega
//     { new: true }
//   ).populate('applicable_products', 'name price images');
//   if (!offer) throw new ApiError(404, 'Offer not found');
//   return offer;
// };

// // Offer se product remove karo
// exports.removeProductFromOffer = async (offerId, productId) => {
//   const offer = await Offer.findByIdAndUpdate(
//     offerId,
//     { $pull: { applicable_products: productId } },
//     { new: true }
//   ).populate('applicable_products', 'name price images');
//   if (!offer) throw new ApiError(404, 'Offer not found');
//   return offer;
// };
const Offer = require('../../models/offer.model');
const Product = require('../../models/product.model'); // apna exact path/naam check kar lena
const ApiError = require('../../utils/ApiError');

exports.createOffer = async (data) => {
  const { product_names, ...offerData } = data;

  let applicable_products = [];

  if (product_names && product_names.length > 0) {
    // product_names ek array hoga: ["Shirt", "Jeans", "Shoes"]
    const products = await Product.find({
      name: { $in: product_names },
    }).select('_id name');

    if (products.length === 0) {
      throw new ApiError(404, 'No matching products found for given names');
    }

    applicable_products = products.map((p) => p._id);
  }

  const offer = await Offer.create({
    ...offerData,
    applicable_products,
  });

  return offer;
};

exports.getAllOffers = async () => {
  return await Offer.find()
    .populate('applicable_products', 'name price discounted_price images')
    .sort({ createdAt: -1 });
};

exports.getOfferById = async (id) => {
  const offer = await Offer.findById(id)
    .populate('applicable_products', 'name price discounted_price images');
  if (!offer) throw new ApiError(404, 'Offer not found');
  return offer;
};

exports.updateOffer = async (id, data) => {
  const { product_names, ...offerData } = data;

  if (product_names && product_names.length > 0) {
    const products = await Product.find({
      name: { $in: product_names },
    }).select('_id');
    offerData.applicable_products = products.map((p) => p._id);
  }

  const offer = await Offer.findByIdAndUpdate(id, offerData, { new: true })
    .populate('applicable_products', 'name price discounted_price images');
  if (!offer) throw new ApiError(404, 'Offer not found');
  return offer;
};

exports.deleteOffer = async (id) => {
  const offer = await Offer.findByIdAndDelete(id);
  if (!offer) throw new ApiError(404, 'Offer not found');
  return offer;
};

// Specific product ke saare active offers fetch karo
exports.getOffersByProduct = async (productId) => {
  const now = new Date();
  return await Offer.find({
    applicable_products: productId,
    is_active: true,
    $or: [
      { valid_till: null },
      { valid_till: { $gte: now } },
    ],
  });
};

// Offer me product add karo
exports.addProductToOffer = async (offerId, productId) => {
  const offer = await Offer.findByIdAndUpdate(
    offerId,
    { $addToSet: { applicable_products: productId } },
    { new: true }
  ).populate('applicable_products', 'name price images');
  if (!offer) throw new ApiError(404, 'Offer not found');
  return offer;
};

// Offer se product remove karo
exports.removeProductFromOffer = async (offerId, productId) => {
  const offer = await Offer.findByIdAndUpdate(
    offerId,
    { $pull: { applicable_products: productId } },
    { new: true }
  ).populate('applicable_products', 'name price images');
  if (!offer) throw new ApiError(404, 'Offer not found');
  return offer;
};