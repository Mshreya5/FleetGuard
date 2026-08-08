const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Vehicle ID is required'],
    },
    registrationNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      uppercase: true,
      trim: true,
    },
    driverId: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Driver ID is required'],
    },
    driverName: {
      type: String,
      required: true,
      trim: true,
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
    unassignedDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Cancelled', 'Unassigned'],
      default: 'Active',
    },
    notes: {
      type: String,
      default: '',
    },
    overrideReason: {
      type: String,
      default: '',
    },
    assignedBy: {
      type: String,
      default: 'System',
    },
    complianceStatus: {
      type: String,
      default: 'Valid',
    },
  },
  { timestamps: true }
);

assignmentSchema.index({ vehicleId: 1 });
assignmentSchema.index({ driverId: 1 });
assignmentSchema.index({ status: 1 });

module.exports = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);
