const mongoose = require('mongoose');

const overrideLogSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      uppercase: true,
      trim: true,
    },
    driverId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    driverName: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: [true, 'Override reason is required'],
      trim: true,
      minlength: 3,
    },
    overriddenBy: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'Fleet Manager',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

overrideLogSchema.index({ timestamp: -1 });

module.exports = mongoose.models.OverrideLog || mongoose.model('OverrideLog', overrideLogSchema);
