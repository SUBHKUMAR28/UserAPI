const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    image_url: { type: String, default: null },

    // Flat discount
    discount_amount: { type: Number, default: 0 },
    min_order_amount: { type: Number, default: 0 },

    // Linked products
    applicable_products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    valid_from: { type: Date, default: Date.now },
    valid_till: { type: Date, default: null },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', offerSchema);