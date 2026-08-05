const Assignment = require('../models/Assignment');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const OverrideLog = require('../models/OverrideLog');
const { logAudit } = require('../utils/auditLogger');
const mongoose = require('mongoose');

// ASSIGN VEHICLE TO DRIVER
const assignVehicle = async (req, res) => {
  try {
    const { vehicleId, registrationNumber, driverId, driverName, notes, overrideReason } = req.body;

    if ((!vehicleId && !registrationNumber) || (!driverId && !driverName)) {
      return res.status(400).json({ success: false, message: 'Vehicle and Driver details are required' });
    }

    // Find target vehicle
    let vehicle = null;
    if (vehicleId && mongoose.Types.ObjectId.isValid(vehicleId)) {
      vehicle = await Vehicle.findById(vehicleId);
    }
    if (!vehicle && (registrationNumber || vehicleId)) {
      const reg = (registrationNumber || vehicleId).toUpperCase().trim();
      vehicle = await Vehicle.findOne({ registrationNumber: reg });
    }

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Find target driver
    let driver = null;
    if (driverId && mongoose.Types.ObjectId.isValid(driverId)) {
      driver = await User.findById(driverId);
    }
    if (!driver && driverName) {
      driver = await User.findOne({ name: driverName.trim(), role: 'Driver' });
    }

    const finalDriverName = driver ? driver.name : (driverName || 'Driver').trim();
    const finalDriverId = driver ? driver._id : (driverId || 'driver-001');

    // Business Rule Check: Non-compliant vehicle assignment
    const complianceStatus = vehicle.complianceSummary?.overallStatus || 'Valid';
    let isOverrideApplied = false;

    if (complianceStatus === 'Expired') {
      if (!overrideReason || typeof overrideReason !== 'string' || overrideReason.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: `Vehicle ${vehicle.registrationNumber} is Non-Compliant (Expired documents). Assignment rejected unless an Override Reason is provided.`,
          requiresOverride: true,
        });
      }

      isOverrideApplied = true;

      // Save to OverrideLogs collection
      const overrideLog = new OverrideLog({
        vehicleId: vehicle._id,
        vehicleNumber: vehicle.registrationNumber,
        registrationNumber: vehicle.registrationNumber,
        driverId: finalDriverId,
        driverName: finalDriverName,
        reason: overrideReason.trim(),
        overriddenBy: req.user?.name || 'Fleet Manager',
        role: req.user?.role || 'Fleet Manager',
        timestamp: new Date(),
      });
      await overrideLog.save();

      await logAudit({
        user: req.user?.name || 'Fleet Manager',
        userEmail: req.user?.email || '',
        role: req.user?.role || 'Fleet Manager',
        action: 'Override Created',
        module: 'Compliance Override',
        status: 'Warning',
        prev: 'Blocked (Non-Compliant)',
        next: 'Allowed via Override',
        reason: overrideReason.trim(),
        details: { vehicle: vehicle.registrationNumber, driver: finalDriverName },
      });
    }

    // Deactivate previous active assignment for this vehicle or driver
    await Assignment.updateMany(
      {
        $or: [{ vehicleId: vehicle._id }, { registrationNumber: vehicle.registrationNumber }, { driverName: finalDriverName }],
        status: 'Active',
      },
      { $set: { status: 'Completed', unassignedDate: new Date() } }
    );

    // Create new Assignment record
    const assignment = new Assignment({
      vehicleId: vehicle._id,
      registrationNumber: vehicle.registrationNumber,
      vehicleNumber: vehicle.registrationNumber,
      driverId: finalDriverId,
      driverName: finalDriverName,
      assignedDate: new Date(),
      status: 'Active',
      notes: notes || '',
      overrideReason: isOverrideApplied ? overrideReason.trim() : '',
      assignedBy: req.user?.name || 'Fleet Manager',
      complianceStatus,
    });
    await assignment.save();

    // Update Vehicle state
    vehicle.status = 'Assigned';
    vehicle.driverAssigned = finalDriverName;
    vehicle.assignedDriver = finalDriverName;
    vehicle.assignedDriverId = finalDriverId;
    await vehicle.save();

    // Update Driver state if User document exists
    if (driver) {
      driver.assignedVehicle = vehicle.registrationNumber;
      await driver.save();
    }

    await logAudit({
      user: req.user?.name || 'Fleet Manager',
      userEmail: req.user?.email || '',
      role: req.user?.role || 'Fleet Manager',
      action: 'Driver Assigned',
      module: 'Driver Assignment',
      status: 'Success',
      next: `Assigned ${vehicle.registrationNumber} to ${finalDriverName}`,
      reason: isOverrideApplied ? `Assigned with override: ${overrideReason}` : 'Standard vehicle assignment',
    });

    res.status(201).json({
      success: true,
      message: `Vehicle ${vehicle.registrationNumber} successfully assigned to ${finalDriverName}`,
      assignment,
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UNASSIGN VEHICLE FROM DRIVER
const unassignVehicle = async (req, res) => {
  try {
    const { vehicleId, registrationNumber, driverName } = req.body;

    let query = { status: 'Active' };
    if (vehicleId && mongoose.Types.ObjectId.isValid(vehicleId)) {
      query.vehicleId = vehicleId;
    } else if (registrationNumber) {
      query.registrationNumber = registrationNumber.toUpperCase().trim();
    } else if (driverName) {
      query.driverName = driverName.trim();
    }

    const activeAssignment = await Assignment.findOne(query);
    if (!activeAssignment) {
      return res.status(404).json({ success: false, message: 'No active assignment found for this vehicle or driver' });
    }

    activeAssignment.status = 'Completed';
    activeAssignment.unassignedDate = new Date();
    await activeAssignment.save();

    // Update Vehicle state
    await Vehicle.updateOne(
      { $or: [{ _id: activeAssignment.vehicleId }, { registrationNumber: activeAssignment.registrationNumber }] },
      { $set: { status: 'Available', driverAssigned: 'Unassigned', assignedDriver: 'Unassigned', assignedDriverId: null } }
    );

    // Update Driver state
    await User.updateOne(
      { name: activeAssignment.driverName, role: 'Driver' },
      { $set: { assignedVehicle: null } }
    );

    await logAudit({
      user: req.user?.name || 'Fleet Manager',
      userEmail: req.user?.email || '',
      role: req.user?.role || 'Fleet Manager',
      action: 'Vehicle Unassigned',
      module: 'Driver Assignment',
      status: 'Success',
      prev: `Assigned to ${activeAssignment.driverName}`,
      next: 'Unassigned (Available)',
      reason: 'Assignment unassigned/completed',
    });

    res.status(200).json({
      success: true,
      message: `Vehicle ${activeAssignment.registrationNumber} unassigned successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ASSIGNMENT HISTORY
const getAssignments = async (req, res) => {
  try {
    const { status, driverName, vehicleNumber } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (driverName) {
      query.driverName = new RegExp(driverName, 'i');
    }
    if (vehicleNumber) {
      query.registrationNumber = new RegExp(vehicleNumber, 'i');
    }

    const assignments = await Assignment.find(query).sort({ assignedDate: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
      history: assignments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ASSIGNMENTS BY DRIVER ID
const getAssignmentsByDriverId = async (req, res) => {
  try {
    const { driverId } = req.params;
    let query = {
      $or: [
        { driverId },
        { driverName: new RegExp(driverId, 'i') }
      ]
    };
    if (mongoose.Types.ObjectId.isValid(driverId)) {
      query.$or.push({ driverId: new mongoose.Types.ObjectId(driverId) });
    }
    let assignments = await Assignment.find(query).sort({ assignedDate: -1 });
    if (!assignments || assignments.length === 0) {
      assignments = await Assignment.find().sort({ assignedDate: -1 });
    }
    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
      history: assignments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  assignVehicle,
  unassignVehicle,
  getAssignments,
  getAssignmentsByDriverId,
};
