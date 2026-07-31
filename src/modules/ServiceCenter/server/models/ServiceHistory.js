const mongoose = require('mongoose');

const serviceHistorySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    performedDate: { type: Date, default: Date.now },
    vehicle: { type: String, default: 'KA01AB1234' },
    vehicleId: { type: String, default: 'VH-102' },
    driverId: { type: String, default: 'driver-001' },
    mechanic: { type: String, default: 'SpeedFix Mechanics' },
    cost: { type: Number, default: 0 },
    serviceType: { type: String, default: 'Routine Maintenance' },
    status: { type: String, enum: ['Pending', 'Completed', 'In Progress'], default: 'Completed' },
    description: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.ServiceHistory || mongoose.model('ServiceHistory', serviceHistorySchema);
