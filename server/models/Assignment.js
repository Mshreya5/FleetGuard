const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    driverId: { type: String, required: true, trim: true },
    vehicleId: { type: String, required: true, trim: true },
    vehicleNumber: { type: String, required: true, trim: true },
    vehicleName: { type: String, required: true, trim: true },
    assignedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Active', 'Completed', 'Pending'], default: 'Active' },
    complianceStatus: { type: String, enum: ['Valid', 'Expired', 'Pending'], default: 'Valid' },
    insuranceExpiry: { type: Date, required: true },
    serviceDueDate: { type: Date, required: true },
    tracker: { type: String, default: 'GPS Ready' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
