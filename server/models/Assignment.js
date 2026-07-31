const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    vehicleId: { type: mongoose.Schema.Types.Mixed, required: true },
    registrationNumber: { type: String, default: '' },
    vehicleNumber: { type: String, default: '' },
    vehicleName: { type: String, default: '' },
    driverId: { type: String, default: 'driver-001' },
    driverName: { type: String, default: 'Assigned Driver' },
    assignedDate: { type: Date, default: Date.now },
    returnDate: { type: Date, default: null },
    status: { type: String, enum: ['Active', 'Completed', 'Pending', 'Cancelled'], default: 'Active' },
    complianceStatus: { type: String, default: 'Valid' },
    insuranceExpiry: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
    serviceDueDate: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    tracker: { type: String, default: 'GPS Ready' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);
