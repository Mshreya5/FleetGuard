const mongoose = require('mongoose');

const issueReportSchema = new mongoose.Schema(
  {
    driverId: { type: String, required: true, trim: true },
    issueType: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('IssueReport', issueReportSchema);
