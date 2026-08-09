const mongoose = require('mongoose');

const issueReportSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.Mixed, required: true },
    driverName: { type: String, default: '' },
    vehicleId: { type: mongoose.Schema.Types.Mixed, default: null },
    registrationNumber: { type: String, uppercase: true, trim: true, default: '' },
    issueType: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
    status: { type: String, default: 'Pending' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.IssueReport || mongoose.model('IssueReport', issueReportSchema);

