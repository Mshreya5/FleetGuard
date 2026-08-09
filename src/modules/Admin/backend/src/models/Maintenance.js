const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: String,
      required: [true, 'Vehicle registration number is required'],
      trim: true,
      uppercase: true,
    },
    serviceDate: { type: Date, required: [true, 'Service date is required'] },
    cost: { type: Number, required: [true, 'Cost is required'], min: [0, 'Cost cannot be negative'] },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    serviceCenter: { type: String, required: [true, 'Service center is required'], trim: true },
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Pending', 'Cancelled'],
      default: 'Completed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Maintenance || mongoose.model('Maintenance', maintenanceSchema);
