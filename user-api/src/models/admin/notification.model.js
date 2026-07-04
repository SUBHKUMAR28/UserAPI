const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    user_name: { type: String, default: 'Unknown' },
    type: {
      type: String,
      enum: ['kyc', 'loan', 'product', 'general'],
      required: true,
    },
    message: { type: String, required: true },
    data: { type: Object, default: {} },
    is_read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);