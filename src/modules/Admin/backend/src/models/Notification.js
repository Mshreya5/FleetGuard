const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Insurance Expiry', 'Maintenance Due', 'Vehicle Assignment', 'Vehicle Registration', 'Compliance Expired'],
      required: true,
    },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
