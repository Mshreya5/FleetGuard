const mongoose = require('mongoose');

const overrideLogSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true, trim: true, uppercase: true },
    driver: { type: String, required: true, trim: true },
    fleetManager: { type: String, required: true, trim: true },
    overrideReason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Approved', 'Rejected', 'Pending'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.OverrideLog || mongoose.model('OverrideLog', overrideLogSchema);
