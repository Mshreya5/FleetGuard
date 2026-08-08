const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      default: () => 'NTF-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900),
    },
    userId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    driverId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: 'All', // 'Admin', 'Fleet Manager', 'Driver', 'Service Center', 'All'
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'error', 'success'],
      default: 'info',
    },
    category: {
      type: String,
      enum: ['Compliance', 'Maintenance', 'Driver', 'Security', 'System', 'Fleet', 'General'],
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    referenceId: {
      type: String,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      default: 'System',
    },
  },
  { timestamps: true }
);

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ role: 1 });
notificationSchema.index({ userId: 1 });

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
