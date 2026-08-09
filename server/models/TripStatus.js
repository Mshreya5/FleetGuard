const mongoose = require('mongoose');

const tripStatusSchema = new mongoose.Schema(
  {
    driverId: { type: String, required: true, trim: true },
    vehicleId: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
    startedAt: { type: Date },
    completedAt: { type: Date },
    checklistCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TripStatus', tripStatusSchema);
