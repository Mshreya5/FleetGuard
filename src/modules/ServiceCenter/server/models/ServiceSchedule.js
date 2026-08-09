const mongoose = require('mongoose');

const serviceScheduleSchema = new mongoose.Schema(
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
    serviceInterval: {
      type: Number,
      required: true,
    },
    currentServiceDate: {
      type: Date,
      default: Date.now,
    },
    nextServiceMileage: {
      type: Number,
      required: true,
    },
    nextServiceDate: {
      type: Date,
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

module.exports = mongoose.models.ServiceSchedule || mongoose.model('ServiceSchedule', serviceScheduleSchema);
