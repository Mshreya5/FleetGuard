const ServiceQueue = require('../models/ServiceQueue');
const ServiceHistory = require('../models/ServiceHistory');
const Vehicle = require('../models/Vehicle');
const { logAudit } = require('../utils/auditLogger');
const { recalculateComplianceStatus } = require('./vehicleController');

// GET SERVICE CENTER DASHBOARD DATA
const getServiceDashboard = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const vehiclesWaiting = await ServiceQueue.countDocuments({ status: 'Waiting' });
    const vehiclesInService = await ServiceQueue.countDocuments({ status: 'In Progress' });
    const completedToday = await ServiceQueue.countDocuments({
      status: 'Completed',
      updatedAt: { $gte: todayStart },
    });

    const completedServices = await ServiceHistory.find({ status: 'Completed' }).lean();
    const totalRevenue = completedServices.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);

    const upcomingServices = await ServiceQueue.find({ status: { $ne: 'Completed' } })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const recentActivities = await ServiceHistory.find({})
      .sort({ performedDate: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      stats: {
        vehiclesWaiting,
        vehiclesInService,
        completedToday,
        totalRevenue,
      },
      upcomingServices: upcomingServices.map((s) => ({
        id: s._id,
        vehicleNumber: s.vehicleNumber,
        ownerBranch: s.ownerBranch,
        vehicleModel: s.vehicleModel || 'Fleet Vehicle',
        currentMileage: s.currentMileage,
        issue: s.issue,
        serviceType: s.serviceType,
        priority: s.priority,
        status: s.status,
      })),
      recentActivities: recentActivities.map((a) => ({
        id: a._id,
        vehicle: a.vehicle || a.vehicleNumber,
        mechanic: a.mechanic || a.technician,
        cost: `$${(a.cost || 0).toLocaleString()}`,
        status: a.status,
        description: a.description || a.notes,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET QUEUE ITEMS
const getServiceQueue = async (req, res) => {
  try {
    const queue = await ServiceQueue.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: queue.length, queue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADD SERVICE REQUEST / QUEUE ITEM
const createServiceRequest = async (req, res) => {
  try {
    const { vehicleNumber, issue, serviceType, priority, estimatedCost, ownerBranch } = req.body;

    if (!vehicleNumber || !issue) {
      return res.status(400).json({ success: false, message: 'Vehicle number and issue description are required' });
    }

    const reg = vehicleNumber.toUpperCase().trim();
    const vehicle = await Vehicle.findOne({ registrationNumber: reg });

    const newRequest = new ServiceQueue({
      vehicleId: vehicle ? vehicle._id : null,
      vehicleNumber: reg,
      ownerBranch: ownerBranch || (vehicle ? vehicle.branch : 'Bangalore'),
      vehicleModel: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Fleet Vehicle',
      currentMileage: vehicle ? vehicle.mileage : 0,
      issue: issue.trim(),
      serviceType: serviceType || 'Routine Maintenance',
      priority: priority || 'Medium',
      status: 'Waiting',
      estimatedCost: Number(estimatedCost) || 0,
    });

    await newRequest.save();

    // Update vehicle maintenance status
    if (vehicle) {
      vehicle.maintenanceStatus = 'Under Maintenance';
      vehicle.status = 'Under Service';
      await vehicle.save();
    }

    await logAudit({
      user: req.user?.name || 'Service Center',
      userEmail: req.user?.email || '',
      role: req.user?.role || 'Service Center',
      action: 'Service Request Created',
      module: 'Maintenance',
      status: 'Success',
      next: `Service logged for ${reg}`,
      reason: issue.trim(),
    });

    res.status(201).json({ success: true, message: 'Service request created successfully', service: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// COMPLETE SERVICE (Cross-Module Sync: Updates Vehicle History, Mileage & Operational Status)
const completeService = async (req, res) => {
  try {
    const { id } = req.params;
    const { cost, notes, technician, updatedMileage } = req.body;

    const queueItem = await ServiceQueue.findById(id);
    if (!queueItem) {
      return res.status(404).json({ success: false, message: 'Service item not found' });
    }

    const reg = queueItem.vehicleNumber;
    const finalCost = Number(cost) || queueItem.estimatedCost || 0;
    const finalTech = technician || 'SpeedFix Mechanics';

    // 1. Update queue status
    queueItem.status = 'Completed';
    await queueItem.save();

    // 2. Create ServiceHistory record
    const history = new ServiceHistory({
      vehicleId: queueItem.vehicleId,
      vehicle: reg,
      vehicleNumber: reg,
      serviceType: queueItem.serviceType,
      performedDate: new Date(),
      cost: finalCost,
      mileageAtService: updatedMileage ? Number(updatedMileage) : queueItem.currentMileage,
      mechanic: finalTech,
      technician: finalTech,
      status: 'Completed',
      description: notes || queueItem.issue,
      notes: notes || '',
    });
    await history.save();

    // 3. Update Vehicle state back to Operational & Available
    const vehicle = await Vehicle.findOne({ registrationNumber: reg });
    if (vehicle) {
      vehicle.maintenanceStatus = 'Operational';
      vehicle.status = vehicle.driverAssigned !== 'Unassigned' ? 'Assigned' : 'Available';
      vehicle.lastServiceDate = new Date();
      if (updatedMileage && Number(updatedMileage) > vehicle.mileage) {
        vehicle.mileage = Number(updatedMileage);
      }
      // Recalculate next service due threshold
      vehicle.serviceDueMileage = vehicle.mileage + 10000;
      await vehicle.save();

      // Recalculate compliance status
      await recalculateComplianceStatus(vehicle._id);
    }

    await logAudit({
      user: req.user?.name || 'Service Center',
      userEmail: req.user?.email || '',
      role: req.user?.role || 'Service Center',
      action: 'Service Completed',
      module: 'Maintenance',
      status: 'Success',
      prev: 'Under Maintenance',
      next: 'Operational',
      reason: `Service completed for ${reg}. Cost: $${finalCost}`,
    });

    res.status(200).json({
      success: true,
      message: `Service completed for vehicle ${reg}. Vehicle set back to Operational.`,
      history,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE VEHICLE MILEAGE
const updateVehicleMileage = async (req, res) => {
  try {
    const { vehicleNumber, currentMileage } = req.body;

    if (!vehicleNumber || currentMileage === undefined) {
      return res.status(400).json({ success: false, message: 'Vehicle number and current mileage are required' });
    }

    const newMileage = Number(currentMileage);
    if (isNaN(newMileage) || newMileage < 0) {
      return res.status(400).json({ success: false, message: 'Mileage must be a positive number' });
    }

    const reg = vehicleNumber.toUpperCase().trim();
    const vehicle = await Vehicle.findOne({ registrationNumber: reg });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const prevMileage = vehicle.mileage;
    vehicle.mileage = newMileage;

    // Predictive Maintenance recalculation
    if (newMileage >= (vehicle.serviceDueMileage || 10000)) {
      vehicle.maintenanceStatus = 'Service Due';
    }

    await vehicle.save();

    await logAudit({
      user: req.user?.name || 'Service Center',
      userEmail: req.user?.email || '',
      role: req.user?.role || 'Service Center',
      action: 'Vehicle Mileage Updated',
      module: 'Maintenance',
      status: 'Success',
      prev: `${prevMileage} km`,
      next: `${newMileage} km`,
      reason: `Mileage updated for ${reg}`,
    });

    res.status(200).json({
      success: true,
      message: `Mileage updated for ${reg} from ${prevMileage} km to ${newMileage} km`,
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getServiceDashboard,
  getServiceQueue,
  createServiceRequest,
  completeService,
  updateVehicleMileage,
};
