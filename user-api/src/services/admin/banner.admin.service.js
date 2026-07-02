
const Banner = require('../../models/banner.model');
const cloudinary = require('../../config/cloudinary');
const ApiError = require('../../utils/ApiError');

// exports.createBanner = async (data, file) => {
//   return await Banner.create({
//     title: data.title,
//     image_url: file.path,        // cloudinary URL
//     redirect_url: data.redirect_url,
//     position: data.position,
//     is_active: data.is_active ?? true,
//   });
// };
// // banner.admin.service.js
// exports.createBanner = async (req) => {
//   if (!req.file) {
//     throw new Error('Image file is required');
//   }
//   const banner = await Banner.create({
//     title: req.body.title,
//     redirect_url: req.body.redirect_url || null,
//     position: req.body.position,
//     image: req.file.path,
//   });
//   return banner;
// };

// exports.getAllBanners = async () => {
//   return await Banner.find().sort({ position: 1 });
// };

// exports.updateBanner = async (id, data, file) => {
//   const banner = await Banner.findById(id);
//   if (!banner) throw new ApiError(404, 'Banner not found');

//   // Purani image Cloudinary se delete karo
//   if (file && banner.image_url) {
//     const publicId = banner.image_url.split('/').pop().split('.')[0];
//     await cloudinary.uploader.destroy(`banners/${publicId}`);
//   }

//   banner.title = data.title ?? banner.title;
//   banner.image_url = file ? file.path : banner.image_url;
//   banner.redirect_url = data.redirect_url ?? banner.redirect_url;
//   banner.position = data.position ?? banner.position;
//   banner.is_active = data.is_active ?? banner.is_active;
//   await banner.save();

//   return banner;
// };

// exports.deleteBanner = async (id) => {
//   const banner = await Banner.findById(id);
//   if (!banner) throw new ApiError(404, 'Banner not found');

//   // Cloudinary se image delete karo
//   if (banner.image_url) {
//     const publicId = banner.image_url.split('/').pop().split('.')[0];
//     await cloudinary.uploader.destroy(`banners/${publicId}`);
//   }

//   await banner.deleteOne();
//   return banner;
// };
exports.createBanner = async (data, file) => {
  if (!file) {
    throw new Error('Image file is required');
  }

  // Max 200KB size check
  const MAX_SIZE = 200 * 1024; // 200KB in bytes
  if (file.size > MAX_SIZE) {
    throw new Error('Image size must not exceed 200KB');
  }

  const banner = await Banner.create({
    title: data.title,
    redirect_url: data.redirect_url || null,
    position: data.position,
    image_url: file.path,
  });
  return banner;
};

exports.getAllBanners = async () => {
  return await Banner.find().sort({ position: 1 });
};

exports.updateBanner = async (id, data, file) => {
  const banner = await Banner.findById(id);
  if (!banner) throw new ApiError(404, 'Banner not found');

  if (file) {
    const MAX_SIZE = 200 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error('Image size must not exceed 200KB');
    }
  }

  // Purani image Cloudinary se delete karo
  if (file && banner.image_url) {
    const publicId = banner.image_url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`banners/${publicId}`);
  }

  banner.title = data.title ?? banner.title;
  banner.image_url = file ? file.path : banner.image_url;
  banner.redirect_url = data.redirect_url ?? banner.redirect_url;
  banner.position = data.position ?? banner.position;
  banner.is_active = data.is_active ?? banner.is_active;
  await banner.save();

  return banner;
};

exports.deleteBanner = async (id) => {
  const banner = await Banner.findById(id);
  if (!banner) throw new ApiError(404, 'Banner not found');

  // Cloudinary se image delete karo
  if (banner.image_url) {
    const publicId = banner.image_url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`banners/${publicId}`);
  }

  await banner.deleteOne();
  return banner;
};