const mongoose = require('mongoose');

const historicalRecordSchema = new mongoose.Schema(
  {
    vehicle: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    cost: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.HistoricalRecord || mongoose.model('HistoricalRecord', historicalRecordSchema);
