const mongoose = require('mongoose');

const serviceHistorySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    vehicle: {
      type: String,
      required: true,
      trim: true,
    },
    mechanic: {
      type: String,
      required: true,
      trim: true,
    },
    cost: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'In Progress'],
      default: 'Completed',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.ServiceHistory || mongoose.model('ServiceHistory', serviceHistorySchema);
