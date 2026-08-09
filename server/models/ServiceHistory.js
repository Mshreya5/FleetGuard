const mongoose = require('mongoose');

const serviceHistorySchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    vehicle: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      uppercase: true,
      trim: true,
    },
    driverId: {
      type: String,
      default: 'driver-001',
    },
    serviceType: {
      type: String,
      default: 'Routine Maintenance',
    },
    performedDate: {
      type: Date,
      default: Date.now,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    mileageAtService: {
      type: Number,
      default: 0,
    },
    mechanic: {
      type: String,
      default: 'Service Center',
    },
    technician: {
      type: String,
      default: 'Service Center Tech',
    },
    status: {
      type: String,
      enum: ['Completed', 'Scheduled', 'In Progress', 'Pending'],
      default: 'Completed',
    },
    description: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

serviceHistorySchema.index({ vehicleNumber: 1 });
serviceHistorySchema.index({ performedDate: -1 });

module.exports = mongoose.models.ServiceHistory || mongoose.model('ServiceHistory', serviceHistorySchema);
