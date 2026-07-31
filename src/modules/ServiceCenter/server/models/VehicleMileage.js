const mongoose = require('mongoose');

const vehicleMileageSchema = new mongoose.Schema(
  {
    vehicle: {
      type: String,
      required: true,
      trim: true,
    },
    currentMileage: {
      type: Number,
      required: true,
    },
    updatedMileage: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.VehicleMileage || mongoose.model('VehicleMileage', vehicleMileageSchema);
