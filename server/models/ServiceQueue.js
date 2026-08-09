const mongoose = require('mongoose');

const serviceQueueSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    ownerBranch: {
      type: String,
      default: 'Bangalore',
    },
    vehicleModel: {
      type: String,
      default: '',
    },
    currentMileage: {
      type: Number,
      default: 0,
    },
    issue: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      default: 'Routine Maintenance',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Waiting', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Waiting',
    },
    estimatedCost: {
      type: Number,
      default: 0,
    },
    scheduledDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

serviceQueueSchema.index({ status: 1 });
serviceQueueSchema.index({ vehicleNumber: 1 });

module.exports = mongoose.models.ServiceQueue || mongoose.model('ServiceQueue', serviceQueueSchema);
