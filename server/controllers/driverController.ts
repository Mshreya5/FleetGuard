const Assignment = require('../models/Assignment');
const Checklist = require('../models/Checklist');
const IssueReport = require('../models/IssueReport');
const Notification = require('../models/Notification');
const TripStatus = require('../models/TripStatus');
const ServiceHistory = require('../models/ServiceHistory');
const ServiceQueue = require('../models/ServiceQueue');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { recalculateComplianceStatus } = require('./vehicleController');
const { logAudit } = require('../utils/auditLogger');
const mongoose = require('mongoose');

const getDriverId = (req: any) => req?.user?.id || req?.user?._id;
const getDriverName = (req: any) => req?.user?.name;

const getDriverQuery = async (req: any) => {
  const driverId = getDriverId(req);
  const driverName = getDriverName(req);

  const orConditions = [];
  if (driverId) {
    orConditions.push({ driverId });
    orConditions.push({ driverId: String(driverId) });
  }
  if (driverName) {
    orConditions.push({ driverName: new RegExp(`^${driverName.trim()}$`, 'i') });
  }

  if (orConditions.length === 0) {
    return { driverId: 'none' };
  }

  return { $or: orConditions };
};

const getActiveAssignmentForDriver = async (req: any) => {
  const query = await getDriverQuery(req);
  let assignment = await Assignment.findOne({ ...query, status: 'Active' }).sort({ assignedDate: -1 }).lean();

  if (!assignment) {
    assignment = await Assignment.findOne(query).sort({ assignedDate: -1 }).lean();
  }

  let vehicle = null;
  if (assignment) {
    if (assignment.vehicleId && mongoose.Types.ObjectId.isValid(assignment.vehicleId)) {
      vehicle = await Vehicle.findById(assignment.vehicleId);
    }
    if (!vehicle && assignment.registrationNumber) {
      vehicle = await Vehicle.findOne({ registrationNumber: assignment.registrationNumber });
    }
  }

  if (!vehicle && req.user?.name) {
    vehicle = await Vehicle.findOne({
      $or: [
        { assignedDriver: req.user.name },
        { driverAssigned: req.user.name },
        { assignedDriverId: req.user.id }
      ]
    });

    if (vehicle && !assignment) {
      assignment = {
        _id: vehicle._id,
        vehicleId: vehicle._id,
        registrationNumber: vehicle.registrationNumber,
        vehicleNumber: vehicle.registrationNumber,
        driverId: req.user.id,
        driverName: req.user.name,
        brand: vehicle.brand,
        model: vehicle.model,
        status: 'Active',
      };
    }
  }

  if (vehicle) {
    await recalculateComplianceStatus(vehicle._id);
    const updatedVehicle = await Vehicle.findById(vehicle._id).lean();

    if (updatedVehicle) {
      const realComplianceStatus = updatedVehicle.complianceStatus || updatedVehicle.complianceSummary?.overallStatus || 'Valid';
      const insuranceExpiry = updatedVehicle.complianceSummary?.insuranceExpiry || updatedVehicle.insurance?.expiryDate || null;
      const pollutionExpiry = updatedVehicle.complianceSummary?.pollutionExpiry || updatedVehicle.pollution?.expiryDate || null;
      const fitnessExpiry = updatedVehicle.complianceSummary?.fitnessExpiry || updatedVehicle.fitness?.expiryDate || null;

      assignment = {
        ...assignment,
        vehicleId: updatedVehicle._id,
        registrationNumber: updatedVehicle.registrationNumber,
        vehicleNumber: updatedVehicle.registrationNumber,
        vehicleName: `${updatedVehicle.brand || ''} ${updatedVehicle.model || ''}`.trim() || updatedVehicle.registrationNumber,
        brand: updatedVehicle.brand,
        model: updatedVehicle.model,
        complianceStatus: realComplianceStatus,
        insuranceExpiry: insuranceExpiry,
        pollutionExpiry: pollutionExpiry,
        fitnessExpiry: fitnessExpiry,
        complianceSummary: updatedVehicle.complianceSummary || {
          insuranceStatus: updatedVehicle.insurance?.status || 'Valid',
          insuranceExpiry: insuranceExpiry,
          overallStatus: realComplianceStatus
        }
      };
    }
  }

  return assignment;
};

const buildDriverPayload = async (req: any) => {
  const driverQuery = await getDriverQuery(req);
  const assignment = await getActiveAssignmentForDriver(req);
  const assignments = await Assignment.find(driverQuery).sort({ assignedDate: -1 }).lean();

  const driverId = getDriverId(req) || 'driver-001';
  const checklist = await Checklist.findOne({ driverId }).sort({ createdAt: -1 }).lean()
    || await Checklist.findOne().sort({ createdAt: -1 }).lean();

  const notifications = await Notification.find({
    $or: [{ role: 'Driver' }, { vehicleId: assignment?.vehicleId }]
  }).sort({ createdAt: -1 }).limit(5).lean();

  let serviceHistory = [];
  if (assignment?.registrationNumber) {
    serviceHistory = await ServiceHistory.find({
      $or: [
        { vehicle: assignment.registrationNumber },
        { vehicleNumber: assignment.registrationNumber },
        { vehicleId: assignment.vehicleId }
      ]
    }).sort({ performedDate: -1 }).lean();
  }

  const tripStatus = await TripStatus.findOne({ driverId }).sort({ createdAt: -1 }).lean();

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

exports.getDriverDashboard = async (req: any, res: any) => {
  try {
    const payload = await buildDriverPayload(req);
    res.json(payload);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch driver dashboard data', error: error.message });
  }
};

exports.createChecklist = async (req: any, res: any) => {
  try {
    const { tyres, brakes, lights, fuel, mirrors, horn } = req.body;
    const driverId = getDriverId(req) || 'driver-001';
    const assignment = await getActiveAssignmentForDriver(req);

    if (typeof tyres !== 'boolean' || typeof brakes !== 'boolean' || typeof lights !== 'boolean' || typeof fuel !== 'boolean' || typeof mirrors !== 'boolean' || typeof horn !== 'boolean') {
      return res.status(400).json({ message: 'All checklist fields are required' });
    }

    const checklist = await Checklist.create({
      driverId,
      vehicleId: req.body.vehicleId || assignment?.registrationNumber || 'VH-102',
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
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to submit checklist', error: error.message });
  }
};

exports.startTrip = async (req: any, res: any) => {
  try {
    const driverId = getDriverId(req) || 'driver-001';
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
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to start trip', error: error.message });
  }
};

exports.createIssueReport = async (req: any, res: any) => {
  try {
    const { issueType, description, priority, date } = req.body;
    const driverId = getDriverId(req);
    const driverName = getDriverName(req) || 'Driver';

    if (!issueType || !description || !priority || !date) {
      return res.status(400).json({ message: 'All issue report fields (Issue Type, Description, Priority, Date) are required' });
    }

    // 1. Identify active assigned vehicle
    const assignment = await getActiveAssignmentForDriver(req);
    let vehicle = null;

    if (assignment) {
      if (assignment.vehicleId && mongoose.Types.ObjectId.isValid(assignment.vehicleId)) {
        vehicle = await Vehicle.findById(assignment.vehicleId);
      }
      if (!vehicle && assignment.registrationNumber) {
        vehicle = await Vehicle.findOne({ registrationNumber: assignment.registrationNumber });
      }
    }

    if (!vehicle) {
      // Search if user has any assigned vehicle in Vehicle collection directly
      vehicle = await Vehicle.findOne({
        $or: [
          { assignedDriver: driverName },
          { driverAssigned: driverName },
          { assignedDriverId: driverId }
        ]
      });
    }

    if (!vehicle) {
      return res.status(400).json({
        success: false,
        message: 'No active vehicle assignment found for this driver. Please contact your Fleet Manager to assign a vehicle before reporting an issue.'
      });
    }

    // 2. Persist IssueReport
    const issueReport = await IssueReport.create({
      driverId: driverId || 'driver-001',
      driverName,
      vehicleId: vehicle._id,
      registrationNumber: vehicle.registrationNumber,
      issueType: issueType.trim(),
      description: description.trim(),
      priority: priority || 'Medium',
      status: 'Pending',
      date: date ? new Date(date) : new Date(),
    });

    // 3. Create Service Queue record for Service Center
    const reg = vehicle.registrationNumber;
    const queueItem = new ServiceQueue({
      vehicleId: vehicle._id,
      vehicleNumber: reg,
      ownerBranch: vehicle.branch || 'Head Office',
      vehicleModel: `${vehicle.brand || ''} ${vehicle.model || ''}`.trim() || 'Fleet Vehicle',
      currentMileage: vehicle.mileage || 0,
      issue: `${issueType.trim()}: ${description.trim()}`,
      serviceType: issueType.trim() || 'Corrective Maintenance',
      priority: priority || 'Medium',
      status: 'Waiting',
      estimatedCost: 0,
      scheduledDate: new Date(),
    });
    await queueItem.save();

    // 4. Update Vehicle status in MongoDB
    vehicle.maintenanceStatus = 'Under Maintenance';
    vehicle.status = 'Under Service';
    await vehicle.save();

    // 5. Create Notification
    await Notification.create({
      title: 'New Vehicle Issue Reported',
      message: `Driver ${driverName} reported an issue (${issueType}) for vehicle ${reg}. Request added to Service Queue.`,
      type: 'warning',
      category: 'Maintenance',
      vehicleId: vehicle._id,
      role: 'Service Center',
    });

    // 6. Log Audit Trail
    await logAudit({
      user: driverName,
      userEmail: req.user?.email || '',
      role: 'Driver',
      action: 'Vehicle Issue Reported',
      module: 'Driver Portal',
      status: 'Success',
      next: `Issue reported for ${reg}. Added to Service Center queue.`,
      reason: description.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle issue report submitted successfully.',
      issueReport,
      serviceQueueItem: queueItem,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to save issue report' });
  }
};

exports.getNotifications = async (req: any, res: any) => {
  try {
    const assignment = await getActiveAssignmentForDriver(req);
    const notifications = await Notification.find({
      $or: [{ role: 'Driver' }, { vehicleId: assignment?.vehicleId }]
    }).sort({ createdAt: -1 }).lean();
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

exports.getAssignments = async (req: any, res: any) => {
  try {
    const driverQuery = await getDriverQuery(req);
    const assignments = await Assignment.find(driverQuery).sort({ assignedDate: -1 }).lean();
    res.json(assignments);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch assignment history', error: error.message });
  }
};

exports.getServiceHistory = async (req: any, res: any) => {
  try {
    const assignment = await getActiveAssignmentForDriver(req);
    let serviceHistory = [];
    if (assignment?.registrationNumber) {
      serviceHistory = await ServiceHistory.find({
        $or: [
          { vehicle: assignment.registrationNumber },
          { vehicleNumber: assignment.registrationNumber },
          { vehicleId: assignment.vehicleId }
        ]
      }).sort({ performedDate: -1 }).lean();
    }
    res.json(serviceHistory);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch service history', error: error.message });
  }
};

export {};
