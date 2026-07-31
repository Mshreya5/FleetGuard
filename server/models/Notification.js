const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    driverId: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Vehicle Assigned', 'Compliance Alert', 'Checklist Reminder', 'Service Reminder'], required: true },
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
