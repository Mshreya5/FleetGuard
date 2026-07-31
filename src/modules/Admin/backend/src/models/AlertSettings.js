const mongoose = require('mongoose');

const alertSettingsSchema = new mongoose.Schema(
  {
    thirtyDays: { type: Boolean, default: true },
    fifteenDays: { type: Boolean, default: true },
    sevenDays: { type: Boolean, default: true },
    customDays: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AlertSettings', alertSettingsSchema);
