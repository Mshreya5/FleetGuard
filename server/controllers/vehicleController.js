const Vehicle = require('../models/Vehicle');
const Compliance = require('../models/Compliance');
const Assignment = require('../models/Assignment');
const { validateVehicleData } = require('../middleware/validation');
const { logAudit } = require('../utils/auditLogger');
const mongoose = require('mongoose');

// Recalculate Compliance Summary for a Vehicle
const recalculateComplianceStatus = async (vehicleId) => {
  try {
    if (mongoose.connection.readyState !== 1) return;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return;

    const docs = await Compliance.find({
      $or: [
        { vehicleId: vehicle._id },
        { vehicleId: vehicle._id.toString() },
        { registrationNumber: vehicle.registrationNumber }
      ]
    });
    const now = new Date();

    let insuranceStatus = 'Missing', insuranceExpiry = null;
    let pollutionStatus = 'Missing', pollutionExpiry = null;
    let fitnessStatus = 'Missing', fitnessExpiry = null;
    let rcStatus = 'Missing', rcExpiry = null;

    docs.forEach((doc) => {
      const exp = new Date(doc.expiryDate);
      const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      let docStatus = 'Valid';
      if (daysLeft < 0) docStatus = 'Expired';
      else if (daysLeft <= 30) docStatus = 'Expiring Soon';

      doc.status = docStatus;
      doc.save().catch(() => {});

      const dt = (doc.documentType || '').toLowerCase();
      if (dt.includes('insurance')) {
        insuranceStatus = docStatus;
        insuranceExpiry = doc.expiryDate;
      } else if (dt.includes('pollution') || dt.includes('puc')) {
        pollutionStatus = docStatus;
        pollutionExpiry = doc.expiryDate;
      } else if (dt.includes('fitness') || dt.includes('inspection')) {
        fitnessStatus = docStatus;
        fitnessExpiry = doc.expiryDate;
      } else if (dt.includes('rc')) {
        rcStatus = docStatus;
        rcExpiry = doc.expiryDate;
      }
    });

    const activeStatuses = [insuranceStatus, pollutionStatus, fitnessStatus, rcStatus].filter(s => s !== 'Missing');
    let overallStatus = 'Valid';
    if (activeStatuses.includes('Expired')) {
      overallStatus = 'Expired';
    } else if (activeStatuses.includes('Expiring Soon')) {
      overallStatus = 'Expiring Soon';
    } else if (activeStatuses.length === 0) {
      overallStatus = 'Valid';
    }

    await Vehicle.findByIdAndUpdate(vehicle._id, {
      complianceStatus: overallStatus,
      insurance: { status: insuranceStatus === 'Missing' ? 'Valid' : insuranceStatus, expiryDate: insuranceExpiry },
      pollution: { status: pollutionStatus === 'Missing' ? 'Valid' : pollutionStatus, expiryDate: pollutionExpiry },
      fitness: { status: fitnessStatus === 'Missing' ? 'Valid' : fitnessStatus, expiryDate: fitnessExpiry },
      complianceSummary: {
        insuranceStatus, insuranceExpiry,
        pollutionStatus, pollutionExpiry,
        fitnessStatus, fitnessExpiry,
        rcStatus, rcExpiry,
        overallStatus,
      },
    });
  } catch (err) {
    // Silent catch in background recalculation
  }
};

// GET ALL VEHICLES
const getVehicles = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { registrationNumber: searchRegex },
        { model: searchRegex },
        { brand: searchRegex },
        { branch: searchRegex },
        { assignedDriver: searchRegex },
      ];
    }

    if (status && status !== 'All') {
      if (['Available', 'Assigned', 'Under Service', 'Maintenance', 'Active', 'Inactive'].includes(status)) {
        query.status = status;
      } else if (['Valid', 'Expiring Soon', 'Expired'].includes(status)) {
        query['complianceSummary.overallStatus'] = status;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      vehicles,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)) || 1,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE VEHICLE
const getVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    let vehicle = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      vehicle = await Vehicle.findById(id);
    }
    if (!vehicle) {
      vehicle = await Vehicle.findOne({ registrationNumber: id.toUpperCase().trim() });
    }

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    await recalculateComplianceStatus(vehicle._id);
    vehicle = await Vehicle.findById(vehicle._id);

    const complianceDocs = await Compliance.find({
      $or: [
        { vehicleId: vehicle._id },
        { vehicleId: vehicle._id.toString() },
        { registrationNumber: vehicle.registrationNumber }
      ]
    }).sort({ createdAt: -1 });

    const assignmentHistory = await Assignment.find({
      $or: [
        { vehicleId: vehicle._id },
        { vehicleId: vehicle._id.toString() },
        { registrationNumber: vehicle.registrationNumber }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      vehicle,
      complianceDocs,
      assignmentHistory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADD VEHICLE (Strict Validation & Audit Logging)
const addVehicle = async (req, res) => {
  try {
    const errors = validateVehicleData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join('. ') });
    }

    const { registrationNumber, model, brand, branch, manufacturingYear, mileage, vin, fuelType, vehicleType } = req.body;
    const formattedReg = registrationNumber.toUpperCase().trim();

    // Check duplicate Registration Number
    const existingReg = await Vehicle.findOne({ registrationNumber: formattedReg });
    if (existingReg) {
      return res.status(409).json({ success: false, message: `Vehicle with registration number '${formattedReg}' already exists` });
    }

    // Check duplicate VIN if provided
    if (vin) {
      const cleanVin = vin.trim().toUpperCase();
      const existingVin = await Vehicle.findOne({ vin: cleanVin });
      if (existingVin) {
        return res.status(409).json({ success: false, message: `Vehicle with VIN '${cleanVin}' already exists` });
      }
    }

    const vehicle = new Vehicle({
      registrationNumber: formattedReg,
      model: model.trim(),
      brand: brand ? brand.trim() : 'Mahindra',
      branch: branch ? branch.trim() : 'Bangalore',
      manufacturingYear: Number(manufacturingYear),
      mileage: Number(mileage) || 0,
      vin: vin ? vin.trim().toUpperCase() : undefined,
      fuelType: fuelType || 'Diesel',
      vehicleType: vehicleType || 'Truck',
      status: 'Available',
      assignedDriver: 'Unassigned',
      driverAssigned: 'Unassigned',
      insurance: { status: 'Valid', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      pollution: { status: 'Valid', expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      fitness: { status: 'Valid', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
    });

    const savedVehicle = await vehicle.save();

    await logAudit({
      user: req.user?.name || 'Fleet Manager',
      userEmail: req.user?.email || '',
      role: req.user?.role || 'Fleet Manager',
      action: 'Vehicle Registered',
      module: 'Vehicle Registry',
      status: 'Success',
      next: `${formattedReg} (${model}) added to fleet`,
      reason: 'New vehicle onboarding',
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully',
      vehicle: savedVehicle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE VEHICLE
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    let vehicle = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      vehicle = await Vehicle.findById(id);
    }
    if (!vehicle) {
      vehicle = await Vehicle.findOne({ registrationNumber: id.toUpperCase().trim() });
    }

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const errors = validateVehicleData(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join('. ') });
    }

    const prevVal = `${vehicle.registrationNumber} (${vehicle.model}, ${vehicle.status})`;

    if (req.body.registrationNumber && req.body.registrationNumber.toUpperCase().trim() !== vehicle.registrationNumber) {
      const formattedReg = req.body.registrationNumber.toUpperCase().trim();
      const existingReg = await Vehicle.findOne({ registrationNumber: formattedReg });
      if (existingReg) {
        return res.status(409).json({ success: false, message: `Registration number '${formattedReg}' already in use` });
      }
      vehicle.registrationNumber = formattedReg;
    }

    if (req.body.vin && req.body.vin.toUpperCase().trim() !== vehicle.vin) {
      const cleanVin = req.body.vin.toUpperCase().trim();
      const existingVin = await Vehicle.findOne({ vin: cleanVin });
      if (existingVin) {
        return res.status(409).json({ success: false, message: `VIN '${cleanVin}' already in use` });
      }
      vehicle.vin = cleanVin;
    }

    if (req.body.model) vehicle.model = req.body.model.trim();
    if (req.body.brand) vehicle.brand = req.body.brand.trim();
    if (req.body.branch) vehicle.branch = req.body.branch.trim();
    if (req.body.manufacturingYear) vehicle.manufacturingYear = Number(req.body.manufacturingYear);
    if (req.body.mileage !== undefined) vehicle.mileage = Number(req.body.mileage);
    if (req.body.fuelType) vehicle.fuelType = req.body.fuelType;
    if (req.body.vehicleType) vehicle.vehicleType = req.body.vehicleType;
    if (req.body.status) vehicle.status = req.body.status;
    if (req.body.maintenanceStatus) vehicle.maintenanceStatus = req.body.maintenanceStatus;

    const updatedVehicle = await vehicle.save();

    await logAudit({
      user: req.user?.name || 'Fleet Manager',
      userEmail: req.user?.email || '',
      role: req.user?.role || 'Fleet Manager',
      action: 'Vehicle Updated',
      module: 'Vehicle Registry',
      status: 'Success',
      prev: prevVal,
      next: `${updatedVehicle.registrationNumber} (${updatedVehicle.model}, ${updatedVehicle.status})`,
      reason: 'Vehicle specifications or status modified',
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle: updatedVehicle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE VEHICLE (CASCADING DELETION & SYNC)
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    let vehicle = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      vehicle = await Vehicle.findById(id);
    }
    if (!vehicle) {
      vehicle = await Vehicle.findOne({ registrationNumber: id.toUpperCase().trim() });
    }

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const regNum = vehicle.registrationNumber;

    // Cross-module cascades:
    // 1. Remove assignments
    await Assignment.deleteMany({ $or: [{ vehicleId: vehicle._id }, { registrationNumber: regNum }] });

    // 2. Remove compliance docs
    await Compliance.deleteMany({ $or: [{ vehicleId: vehicle._id }, { registrationNumber: regNum }] });

    // 3. Delete vehicle document
    await vehicle.deleteOne();

    await logAudit({
      user: req.user?.name || 'Fleet Manager',
      userEmail: req.user?.email || '',
      role: req.user?.role || 'Fleet Manager',
      action: 'Vehicle Deleted',
      module: 'Vehicle Registry',
      status: 'Success',
      prev: `Vehicle ${regNum}`,
      next: 'Removed from system',
      reason: 'Vehicle decommissioned/deleted',
    });

    res.status(200).json({
      success: true,
      message: `Vehicle ${regNum} and associated assignments/compliance records deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVehicles,
  getVehicle,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  recalculateComplianceStatus,
};
