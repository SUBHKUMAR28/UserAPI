// const mongoose = require('mongoose');

// const categorySchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     icon: { type: String, default: null },
//     slug: { type: String, required: true, unique: true },
//     position: { type: Number, default: 0 },
//     is_active: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Category', categorySchema);
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: null },
    slug: { type: String, required: true, unique: true },
    position: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },

    spec_fields: [
      {
        key: { type: String, required: true },
        label: { type: String, required: true },
        placeholder: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);