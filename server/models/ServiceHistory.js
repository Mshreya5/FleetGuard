const mongoose = require('mongoose');

const serviceHistorySchema = new mongoose.Schema(
  {
    driverId: { type: String, required: true, trim: true },
    vehicleId: { type: String, required: true, trim: true },
    serviceType: { type: String, required: true, trim: true },
    performedDate: { type: Date, required: true },
    status: { type: String, enum: ['Completed', 'Pending'], default: 'Completed' },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceHistory', serviceHistorySchema);
