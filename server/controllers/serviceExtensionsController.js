const ServiceQueue = require('../models/ServiceQueue');
const ServiceHistory = require('../models/ServiceHistory');
const Vehicle = require('../models/Vehicle');
const { logAudit } = require('../utils/auditLogger');

// 1. GET & POST SERVICE COSTS
const getServiceCosts = async (req, res) => {
  try {
    const history = await ServiceHistory.find({}).sort({ createdAt: -1 }).lean();
    const costs = history.map((h) => ({
      _id: h._id,
      vehicle: h.vehicleNumber || h.vehicle || 'Fleet Vehicle',
      labourCost: Number(h.cost) * 0.4 || 100,
      sparePartsCost: Number(h.cost) * 0.6 || 150,
      totalCost: Number(h.cost) || 250,
      description: h.description || h.notes || 'Service cost entry',
    }));
    res.status(200).json(costs);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createServiceCost = async (req, res) => {
  try {
    const { vehicle, labourCost, sparePartsCost, otherCharges, description } = req.body;
    const total = (Number(labourCost) || 0) + (Number(sparePartsCost) || 0) + (Number(otherCharges) || 0);

    const history = new ServiceHistory({
      vehicle: vehicle ? vehicle.toUpperCase().trim() : 'Fleet Vehicle',
      vehicleNumber: vehicle ? vehicle.toUpperCase().trim() : 'Fleet Vehicle',
      serviceType: 'Routine Maintenance',
      performedDate: new Date(),
      cost: total,
      mechanic: 'Service Center Staff',
      technician: 'Service Center Staff',
      status: 'Completed',
      description: description || `Labour: $${labourCost}, Parts: $${sparePartsCost}`,
    });
    await history.save();

    await logAudit({
      user: req.user?.name || 'Service Center',
      role: 'Service Center',
      action: 'Service Cost Recorded',
      module: 'Maintenance',
      next: `Cost $${total} recorded for ${vehicle}`,
    });

    res.status(201).json({ success: true, record: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. GET & POST SERVICE HISTORY
const getServiceHistory = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    let query = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ vehicle: regex }, { vehicleNumber: regex }, { mechanic: regex }, { description: regex }];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const total = await ServiceHistory.countDocuments(query);
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const logs = await ServiceHistory.find(query).sort({ performedDate: -1 }).skip(skip).limit(parseInt(limit)).lean();

    const records = logs.map((l) => ({
      _id: l._id,
      date: l.performedDate || l.createdAt,
      vehicle: l.vehicleNumber || l.vehicle || 'Fleet Vehicle',
      mechanic: l.mechanic || l.technician || 'Service Center Staff',
      cost: Number(l.cost) || 0,
      status: l.status || 'Completed',
      description: l.description || l.notes || '',
    }));

    res.status(200).json({ success: true, total, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createServiceHistory = async (req, res) => {
  try {
    const { vehicle, date, description, cost, mechanic } = req.body;

    const history = new ServiceHistory({
      vehicle: vehicle ? vehicle.toUpperCase().trim() : 'Fleet Vehicle',
      vehicleNumber: vehicle ? vehicle.toUpperCase().trim() : 'Fleet Vehicle',
      serviceType: 'Maintenance Work',
      performedDate: date ? new Date(date) : new Date(),
      cost: Number(cost) || 0,
      mechanic: mechanic || 'Service Center',
      technician: mechanic || 'Service Center',
      status: 'Completed',
      description: description || 'Historical record added',
    });
    await history.save();

    await logAudit({
      user: req.user?.name || 'Service Center',
      role: 'Service Center',
      action: 'Historical Service Added',
      module: 'Maintenance',
      next: `History record added for ${vehicle}`,
    });

    res.status(201).json({ success: true, record: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. GET & POST SERVICE SCHEDULES
const getServiceSchedules = async (req, res) => {
  try {
    const queue = await ServiceQueue.find({}).sort({ createdAt: -1 }).lean();
    const schedules = queue.map((q) => ({
      _id: q._id,
      vehicle: q.vehicleNumber,
      currentMileage: q.currentMileage,
      nextServiceMileage: q.currentMileage + 10000,
      status: q.status,
      notes: q.issue,
    }));
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createServiceSchedule = async (req, res) => {
  try {
    const { vehicle, currentMileage, serviceInterval, notes } = req.body;
    const reg = vehicle ? vehicle.toUpperCase().trim() : 'FLEET-VEHICLE';

    const queueItem = new ServiceQueue({
      vehicleNumber: reg,
      ownerBranch: 'Bangalore',
      vehicleModel: 'Fleet Vehicle',
      currentMileage: Number(currentMileage) || 0,
      issue: notes || `Scheduled inspection after ${serviceInterval} days`,
      serviceType: 'Scheduled Inspection',
      priority: 'Medium',
      status: 'Waiting',
    });
    await queueItem.save();

    res.status(201).json({ success: true, schedule: queueItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. MAINTENANCE RISK LEVEL
const getMaintenanceRisk = async (req, res) => {
  try {
    const { mileage } = req.query;
    const numMileage = Number(mileage) || 0;

    let level = 'Low';
    let color = 'priorityLow';
    let explanation = 'Vehicle mileage is within safe operational limits.';
    let recommendation = 'Standard routine checks recommended every 10,000 km.';

    if (numMileage > 80000) {
      level = 'High';
      color = 'priorityHigh';
      explanation = 'High mileage vehicle requiring immediate engine, brake, and suspension inspection.';
      recommendation = 'Schedule comprehensive overhaul service immediately.';
    } else if (numMileage > 40000) {
      level = 'Medium';
      color = 'priorityMedium';
      explanation = 'Moderate wear and tear detected based on vehicle mileage.';
      recommendation = 'Schedule routine oil change, tyre rotation, and brake check.';
    }

    res.status(200).json({ level, color, explanation, recommendation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. EXTENSIONS COMPLETE SERVICE
const completeServiceExtension = async (req, res) => {
  try {
    const { vehicle, mechanic, totalCost, nextServiceDue } = req.body;
    const reg = vehicle ? vehicle.toUpperCase().trim() : 'FLEET-VEHICLE';

    const history = new ServiceHistory({
      vehicle: reg,
      vehicleNumber: reg,
      serviceType: 'Full Service Overhaul',
      performedDate: new Date(),
      cost: Number(totalCost) || 0,
      mechanic: mechanic || 'SpeedFix Mechanic',
      technician: mechanic || 'SpeedFix Mechanic',
      status: 'Completed',
      description: `Service completed. Next due: ${nextServiceDue || '10,000 km'}`,
    });
    await history.save();

    // Update vehicle status back to Operational in MongoDB
    const vehicleDoc = await Vehicle.findOne({ registrationNumber: reg });
    if (vehicleDoc) {
      vehicleDoc.maintenanceStatus = 'Operational';
      vehicleDoc.status = vehicleDoc.driverAssigned !== 'Unassigned' ? 'Assigned' : 'Available';
      vehicleDoc.lastServiceDate = new Date();
      await vehicleDoc.save();
    }

    await logAudit({
      user: req.user?.name || mechanic || 'Service Center',
      role: 'Service Center',
      action: 'Service Completed',
      module: 'Maintenance',
      next: `Service completed for ${reg}. Cost: $${totalCost}`,
    });

    res.status(200).json({ success: true, message: `Service marked as completed for ${reg}.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getServiceCosts,
  createServiceCost,
  getServiceHistory,
  createServiceHistory,
  getServiceSchedules,
  createServiceSchedule,
  getMaintenanceRisk,
  completeServiceExtension,
};
