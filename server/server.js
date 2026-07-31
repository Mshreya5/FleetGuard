const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const driverRoutes = require('./routes/driverRoutes');
const Assignment = require('./models/Assignment');
const Checklist = require('./models/Checklist');
const IssueReport = require('./models/IssueReport');
const Notification = require('./models/Notification');
const TripStatus = require('./models/TripStatus');
const ServiceHistory = require('./models/ServiceHistory');

const path = require('path');

dotenv.config({
  path: path.join(__dirname, '../.env'),
});



const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FleetGuard Driver API' });
});

app.get('/api/health/db', async (req, res) => {
  const readyState = mongoose.connection.readyState;
  const connectionStatus = readyState === 1 ? 'connected' : 'disconnected';

  let counts = {};

  if (readyState === 1) {
    counts = {
      assignments: await Assignment.countDocuments(),
      checklists: await Checklist.countDocuments(),
      issues: await IssueReport.countDocuments(),
      notifications: await Notification.countDocuments(),
      trips: await TripStatus.countDocuments(),
      services: await ServiceHistory.countDocuments(),
    };
  }

  res.json({
    connection: connectionStatus,
    readyState,
    counts,
  });
});

app.use('/api/driver', driverRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
