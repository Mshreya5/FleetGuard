const Assignment = require('../models/Assignment');
const Checklist = require('../models/Checklist');
const IssueReport = require('../models/IssueReport');
const Notification = require('../models/Notification');
const TripStatus = require('../models/TripStatus');
const ServiceHistory = require('../models/ServiceHistory');

const getDriverId = (req) => req?.user?.id || req?.user?._id || 'driver-001';
const getDriverName = (req) => req?.user?.name || 'Driver';

const getDriverQuery = (req) => {
  const driverId = getDriverId(req);
  const driverName = getDriverName(req);
  return { $or: [{ driverId }, { driverName }, { driverId: 'driver-001' }] };
};

const buildDriverPayload = async (req) => {
  const driverQuery = getDriverQuery(req);

  let assignment = await Assignment.findOne(driverQuery).sort({ assignedDate: -1 }).lean();
  let assignments = await Assignment.find(driverQuery).sort({ assignedDate: -1 }).lean();
  if (!assignments || assignments.length === 0) {
    assignments = await Assignment.find().sort({ assignedDate: -1 }).lean();
    if (!assignment && assignments.length > 0) {
      assignment = assignments[0];
    }
  }

  const checklist = await Checklist.findOne().sort({ submittedAt: -1 }).lean();
  const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5).lean();
  const serviceHistory = await ServiceHistory.find().sort({ performedDate: -1 }).lean();
  const tripStatus = await TripStatus.findOne().sort({ createdAt: -1 }).lean();

  return {
    assignment,
    checklist,
    notifications,
    serviceHistory,
    assignments,
    tripStatus,
    complianceStatus: assignment?.complianceStatus || 'Valid',
    pendingChecklistCount: checklist?.status === 'Completed' ? 0 : 6,
  };
};

exports.getDriverDashboard = async (req, res) => {
  try {
    const payload = await buildDriverPayload(req);
    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch driver dashboard data', error: error.message });
  }
};

exports.createChecklist = async (req, res) => {
  try {
    const { tyres, brakes, lights, fuel, mirrors, horn } = req.body;
    const driverId = getDriverId(req);

    if (typeof tyres !== 'boolean' || typeof brakes !== 'boolean' || typeof lights !== 'boolean' || typeof fuel !== 'boolean' || typeof mirrors !== 'boolean' || typeof horn !== 'boolean') {
      return res.status(400).json({ message: 'All checklist fields are required' });
    }

    const checklist = await Checklist.create({
      driverId,
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
      { driverId },
      { driverId, vehicleId: checklist.vehicleId, status: 'Not Started', checklistCompleted: true },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: 'Checklist submitted successfully', checklist });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit checklist', error: error.message });
  }
};

exports.startTrip = async (req, res) => {
  try {
    const driverId = getDriverId(req);
    const trip = await TripStatus.findOne({ driverId });

    if (!trip || !trip.checklistCompleted) {
      return res.status(400).json({ message: 'Checklist must be completed before starting trip' });
    }

    const updatedTrip = await TripStatus.findOneAndUpdate(
      { driverId },
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
  try {
    const { issueType, description, priority, date } = req.body;
    const driverId = getDriverId(req);

    if (!issueType || !description || !priority || !date) {
      return res.status(400).json({ message: 'All issue report fields are required' });
    }

    const issueReport = await IssueReport.create({
      driverId,
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
    const driverId = getDriverId(req);
    const notifications = await Notification.find().sort({ createdAt: -1 }).lean();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const driverQuery = getDriverQuery(req);
    let assignments = await Assignment.find(driverQuery).sort({ assignedDate: -1 }).lean();
    if (!assignments || assignments.length === 0) {
      assignments = await Assignment.find().sort({ assignedDate: -1 }).lean();
    }
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignment history', error: error.message });
  }
};

exports.getServiceHistory = async (req, res) => {
  try {
    const driverQuery = getDriverQuery(req);
    const serviceHistory = await ServiceHistory.find(driverQuery).sort({ performedDate: -1 }).lean();
    res.json(serviceHistory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch service history', error: error.message });
  }
};
