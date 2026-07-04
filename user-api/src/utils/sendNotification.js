const { getIO } = require('../config/socket');
const Notification = require('../models/notification.model');

const sendAdminNotification = async ({ userId, userName, type, message, data }) => {
  try {
    // DB me save karo
    const notification = await Notification.create({
      user: userId,
      user_name: userName,
      type,
      message,
      data,
    });

    // Real-time bhejo
    const io = getIO();
    io.to('admin_room').emit('new_notification', {
      _id: notification._id,
      user_name: userName,
      type,
      message,
      data,
      createdAt: notification.createdAt,
    });

    return notification;
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

module.exports = sendAdminNotification;