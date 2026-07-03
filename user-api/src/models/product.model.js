
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    sku: { type: String, unique: true, sparse: true },

    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    brand: { type: String, default: null },

    images: [{ type: String }], // Cloudinary URLs

    // Pricing
    price: { type: Number, required: true }, // MRP
    discounted_price: { type: Number, default: null }, // Sale price
    gst_percent: { type: Number, default: 18 }, // GST %
    hsn_code: { type: String, default: null }, // Tax classification

    // Stock
    stock: { type: Number, default: 0 },
    sku_unit: { type: String, default: 'piece' }, // piece, kg, etc.
    low_stock_alert: { type: Number, default: 10 }, // alert when stock < this

    // Shipping
    weight: { type: Number, default: null }, // grams
    dimensions: {
      length: { type: Number, default: null }, // cm
      width: { type: Number, default: null },  // cm
      height: { type: Number, default: null }, // cm
    },
    is_fragile: { type: Boolean, default: false },

    // Variants
    variants: [
      {
        color: { type: String, default: null },
        size: { type: String, default: null },
        stock: { type: Number, default: 0 },
        price: { type: Number, default: null },
        sku: { type: String, default: null },
      },
    ],

    // Warranty
    warranty_period: { type: String, default: null }, // "6 months", "1 year"
    warranty_type: {
      type: String,
      enum: ['brand', 'seller', 'none'],
      default: 'none',
    },

    // Specifications
    specifications: { type: Map, of: String, default: {} },

    // Flags
    is_best_seller: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    is_featured: { type: Boolean, default: false },

    // SEO & Search
    tags: [{ type: String }],
    slug: { type: String, unique: true, sparse: true }, // URL friendly name

    // Ratings
    rating: { type: Number, default: 0, min: 0, max: 5 },
    review_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto slug generate from name (Mongoose v9 compatible - no 'next' param)
productSchema.pre('save', function () {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
});

module.exports = mongoose.model('Product', productSchema);