const mongoose = require('mongoose');

const serviceCostSchema = new mongoose.Schema(
  {
    vehicle: {
      type: String,
      required: true,
      trim: true,
    },
    labourCost: {
      type: Number,
      required: true,
      default: 0,
    },
    sparePartsCost: {
      type: Number,
      required: true,
      default: 0,
    },
    otherCharges: {
      type: Number,
      required: true,
      default: 0,
    },
    totalCost: {
      type: Number,
      required: true,
      default: 0,
    },
    serviceDate: {
      type: Date,
      default: Date.now,
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

module.exports = mongoose.models.ServiceCost || mongoose.model('ServiceCost', serviceCostSchema);
