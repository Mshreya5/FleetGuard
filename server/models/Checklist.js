const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema(
  {
    driverId: { type: String, required: true, trim: true },
    vehicleId: { type: String, required: true, trim: true },
    tyres: { type: Boolean, default: false },
    brakes: { type: Boolean, default: false },
    lights: { type: Boolean, default: false },
    fuel: { type: Boolean, default: false },
    mirrors: { type: Boolean, default: false },
    horn: { type: Boolean, default: false },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Checklist', checklistSchema);
