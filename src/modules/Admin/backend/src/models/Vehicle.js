const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    manufacturingYear: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
      min: 1900,
    },
    mileage: {
      type: Number,
      required: true,
      min: [1, 'Mileage must be a positive number'],
    },
    driverAssigned: {
      type: String,
      trim: true,
      default: 'Unassigned',
    },
    fleetManager: {
      type: String,
      trim: true,
      default: 'Unassigned',
    },
    maintenanceStatus: {
      type: String,
      enum: ['Operational', 'Under Maintenance', 'Service Due', 'Out of Service'],
      default: 'Operational',
    },
    insurance: {
      status: {
        type: String,
        enum: ['Valid', 'Expired', 'Expiring Soon'],
        default: 'Valid',
      },
      expiryDate: {
        type: Date,
        required: true,
      },
    },
    pollution: {
      status: {
        type: String,
        enum: ['Valid', 'Expired', 'Expiring Soon'],
        default: 'Valid',
      },
      expiryDate: {
        type: Date,
        required: true,
      },
    },
    fitness: {
      status: {
        type: String,
        enum: ['Valid', 'Expired', 'Expiring Soon'],
        default: 'Valid',
      },
      expiryDate: {
        type: Date,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['Available', 'Assigned', 'Under Service', 'Maintenance', 'Active', 'Inactive', 'Retired'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
