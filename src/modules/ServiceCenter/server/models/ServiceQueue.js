const mongoose = require('mongoose');

const serviceQueueSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
    },
    ownerBranch: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleModel: {
      type: String,
      required: true,
      trim: true,
    },
    currentMileage: {
      type: Number,
      required: true,
    },
    issue: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Waiting', 'In Progress', 'Completed'],
      default: 'Waiting',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ServiceQueue', serviceQueueSchema);
