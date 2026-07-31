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
      required: [true, 'Model is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      trim: true,
    },
    manufacturingYear: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
    },
    mileage: {
      type: Number,
      default: 0,
      min: [0, 'Mileage cannot be negative'],
    },
    fuelType: {
      type: String,
      default: 'Diesel',
    },
    vehicleType: {
      type: String,
      default: 'Truck',
    },
    status: {
      type: String,
      enum: ['Available', 'Assigned', 'Under Service', 'Maintenance', 'Active', 'Inactive', 'Retired'],
      default: 'Available',
    },
    driverAssigned: {
      type: String,
      trim: true,
      default: 'Unassigned',
    },
    assignedDriver: {
      type: String,
      trim: true,
      default: 'Unassigned',
    },
    assignedDriverId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
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
      status: { type: String, default: 'Valid' },
      expiryDate: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
    },
    pollution: {
      status: { type: String, default: 'Valid' },
      expiryDate: { type: Date, default: () => new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
    },
    fitness: {
      status: { type: String, default: 'Valid' },
      expiryDate: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
    },
    complianceSummary: {
      insuranceStatus: { type: String, default: 'Valid' },
      insuranceExpiry: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      pollutionStatus: { type: String, default: 'Valid' },
      pollutionExpiry: { type: Date, default: () => new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      fitnessStatus: { type: String, default: 'Valid' },
      fitnessExpiry: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      rcStatus: { type: String, default: 'Valid' },
      rcExpiry: { type: Date, default: null },
      overallStatus: { type: String, default: 'Valid' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);