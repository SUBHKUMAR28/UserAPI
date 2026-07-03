const UserBanner = require('../models/banner.model'); // apna sahi path daalo (jahan yeh schema file hai)

exports.getActiveBanners = async () => {
  return await UserBanner.find({ is_active: true })
    .sort({ position: 1 })
    .select('title image_url redirect_url position'); // sirf jitna user side chahiye, _id apne aap aayega
};