const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image_url: { type: String, required: true },
    redirect_url: { type: String, default: null },
    position: { type: Number, default: 0 }, // order me dikhane ke liye
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);