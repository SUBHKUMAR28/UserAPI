// const mongoose = require('mongoose');

// const offerSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, default: null },
//     image_url: { type: String, default: null },
//     discount_percent: { type: Number, default: 0 },
//     valid_till: { type: Date, default: null },
//     is_active: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Offer', offerSchema);
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: null },
    image_url: { type: String, default: null },
    discount_percent: { type: Number, default: 0 },
    valid_till: { type: Date, default: null },
    is_active: { type: Boolean, default: true },
    applicable_products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', offerSchema);