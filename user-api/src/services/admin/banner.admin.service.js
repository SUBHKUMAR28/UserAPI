// const Banner = require('../../models/banner.model');
// const ApiError = require('../../utils/ApiError');

// exports.createBanner = async (data) => {
//   return await Banner.create(data);
// };

// exports.getAllBanners = async () => {
//   return await Banner.find().sort({ position: 1 });
// };

// exports.updateBanner = async (id, data) => {
//   const banner = await Banner.findByIdAndUpdate(id, data, { new: true });
//   if (!banner) throw new ApiError(404, 'Banner not found');
//   return banner;
// };

// exports.deleteBanner = async (id) => {
//   const banner = await Banner.findByIdAndDelete(id);
//   if (!banner) throw new ApiError(404, 'Banner not found');
//   return banner;
// };
const Banner = require('../../models/banner.model');
const cloudinary = require('../../config/cloudinary');
const ApiError = require('../../utils/ApiError');

exports.createBanner = async (data, file) => {
  return await Banner.create({
    title: data.title,
    image_url: file.path,        // cloudinary URL
    redirect_url: data.redirect_url,
    position: data.position,
    is_active: data.is_active ?? true,
  });
};

exports.getAllBanners = async () => {
  return await Banner.find().sort({ position: 1 });
};

exports.updateBanner = async (id, data, file) => {
  const banner = await Banner.findById(id);
  if (!banner) throw new ApiError(404, 'Banner not found');

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