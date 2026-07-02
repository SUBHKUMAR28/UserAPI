const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');
const Emi = require('../models/emi.model');
const Banner = require('../models/banner.model');
const Category = require('../models/category.model');
const Offer = require('../models/offer.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');

exports.getDashboard = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  // Saare data parallel me fetch karo - speed ke liye
  const [wallet, activeEmiCount, banners, categories, offers, bestSellers] = await Promise.all([
    Wallet.findOne({ user: userId }),
    Emi.countDocuments({ user: userId, status: 'active' }),
    Banner.find({ is_active: true }).sort({ position: 1 }).limit(10),
    Category.find({ is_active: true }).sort({ position: 1 }),
    Offer.find({ is_active: true, valid_till: { $gte: new Date() } }).limit(10),
    Product.find({ is_active: true, is_best_seller: true }).limit(10),
  ]);

  return {
    user_details: {
      user_id: user._id,
      full_name: user.full_name,
      email: user.email,
      mobile: user.mobile,
      profile_image: user.profile_image,
      member_id: user.member_id,
      account_status: user.account_status,
    },
    wallet_balance: wallet ? wallet.balance : 0,
    credit_limit: wallet ? wallet.credit_limit : 0,
    reward_points: wallet ? wallet.reward_points : 0,
    active_emi_count: activeEmiCount,
    banners: banners.map((b) => ({
      id: b._id,
      title: b.title,
      image_url: b.image_url,
      redirect_url: b.redirect_url,
    })),
    categories: categories.map((c) => ({
      id: c._id,
      name: c.name,
      icon: c.icon,
      slug: c.slug,
    })),
    quick_actions: [
      { name: 'Add Money', icon: 'wallet', action: 'add_money' },
      { name: 'Pay EMI', icon: 'emi', action: 'pay_emi' },
      { name: 'Recharge', icon: 'recharge', action: 'recharge' },
      { name: 'Loan', icon: 'loan', action: 'loan' },
    ],
    offers: offers.map((o) => ({
      id: o._id,
      title: o.title,
      description: o.description,
      image_url: o.image_url,
      discount_percent: o.discount_percent,
    })),
    best_seller_products: bestSellers.map((p) => ({
      id: p._id,
      name: p.name,
      image_url: p.image_url,
      price: p.price,
      discounted_price: p.discounted_price,
    })),
  };
};