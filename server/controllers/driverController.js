const Assignment = require('../models/Assignment');
const Checklist = require('../models/Checklist');
const IssueReport = require('../models/IssueReport');
const Notification = require('../models/Notification');
const TripStatus = require('../models/TripStatus');
const ServiceHistory = require('../models/ServiceHistory');

const DRIVER_ID = 'driver-001';

const buildDriverPayload = async () => {
  const assignment = await Assignment.findOne({ driverId: DRIVER_ID }).sort({ assignedDate: -1 }).lean();
  const checklist = await Checklist.findOne({ driverId: DRIVER_ID }).sort({ submittedAt: -1 }).lean();
  const notifications = await Notification.find({ driverId: DRIVER_ID }).sort({ createdAt: -1 }).limit(5).lean();
  const serviceHistory = await ServiceHistory.find({ driverId: DRIVER_ID }).sort({ performedDate: -1 }).limit(5).lean();
  const assignments = await Assignment.find({ driverId: DRIVER_ID }).sort({ assignedDate: -1 }).lean();
  const tripStatus = await TripStatus.findOne({ driverId: DRIVER_ID }).sort({ createdAt: -1 }).lean();

  return {
    assignment,
    checklist,
    notifications,
    serviceHistory,
    assignments,
    tripStatus,
    complianceStatus: assignment?.complianceStatus || 'Pending',
    pendingChecklistCount: checklist?.status === 'Completed' ? 0 : 6,
  };
};

exports.getDriverDashboard = async (req, res) => {
  try {
    const payload = await buildDriverPayload();
    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch driver dashboard data', error: error.message });
  }
};

exports.createChecklist = async (req, res) => {
  try {
    const { tyres, brakes, lights, fuel, mirrors, horn } = req.body;

    if (typeof tyres !== 'boolean' || typeof brakes !== 'boolean' || typeof lights !== 'boolean' || typeof fuel !== 'boolean' || typeof mirrors !== 'boolean' || typeof horn !== 'boolean') {
      return res.status(400).json({ message: 'All checklist fields are required' });
    }

    const checklist = await Checklist.create({
      driverId: DRIVER_ID,
      vehicleId: req.body.vehicleId || 'VH-102',
      tyres,
      brakes,
      lights,
      fuel,
      mirrors,
      horn,
      status: 'Completed',
    });

    await TripStatus.findOneAndUpdate(
      { driverId: DRIVER_ID },
      { driverId: DRIVER_ID, vehicleId: checklist.vehicleId, status: 'Not Started', checklistCompleted: true },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: 'Checklist submitted successfully', checklist });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit checklist', error: error.message });
  }
};

exports.startTrip = async (req, res) => {
  try {
    const trip = await TripStatus.findOne({ driverId: DRIVER_ID });

    if (!trip || !trip.checklistCompleted) {
      return res.status(400).json({ message: 'Checklist must be completed before starting trip' });
    }

    const updatedTrip = await TripStatus.findOneAndUpdate(
      { driverId: DRIVER_ID },
      {
        status: 'In Progress',
        startedAt: new Date(),
        checklistCompleted: true,
      },
      { new: true }
    );

    res.json({ message: 'Trip started successfully', trip: updatedTrip });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start trip', error: error.message });
  }
};

exports.createIssueReport = async (req, res) => {
  console.log("===== ISSUE API HIT =====");
console.log(req.body);
  try {
    const { issueType, description, priority, date } = req.body;

    if (!issueType || !description || !priority || !date) {
      return res.status(400).json({ message: 'All issue report fields are required' });
    }

    const issueReport = await IssueReport.create({
      driverId: DRIVER_ID,
      issueType,
      description,
      priority,
      date,
    });

    res.status(201).json({ message: 'Issue report saved successfully', issueReport });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save issue report', error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ driverId: DRIVER_ID }).sort({ createdAt: -1 }).lean();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ driverId: DRIVER_ID }).sort({ assignedDate: -1 }).lean();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignment history', error: error.message });
  }
};

exports.getServiceHistory = async (req, res) => {
  try {
    const serviceHistory = await ServiceHistory.find({ driverId: DRIVER_ID }).sort({ performedDate: -1 }).lean();
    res.json(serviceHistory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch service history', error: error.message });
  }
};
