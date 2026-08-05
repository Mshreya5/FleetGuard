const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      default: () => 'EVT-' + Math.floor(1000 + Math.random() * 9000),
    },
    user: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      required: true,
      enum: ['Admin', 'Fleet Manager', 'Driver', 'Service Center', 'System'],
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    module: {
      type: String,
      default: 'General',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Success', 'Failed', 'Warning', 'Info'],
      default: 'Success',
    },
    ip: {
      type: String,
      default: '127.0.0.1',
    },
    browser: {
      type: String,
      default: 'System',
    },
    os: {
      type: String,
      default: 'System',
    },
    prev: {
      type: String,
      default: 'N/A',
    },
    next: {
      type: String,
      default: 'N/A',
    },
    reason: {
      type: String,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ role: 1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
