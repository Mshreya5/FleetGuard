const mongoose = require('mongoose');
const VehicleMileage = require('../models/VehicleMileage');
const ServiceCost = require('../models/ServiceCost');
const ServiceSchedule = require('../models/ServiceSchedule');
const ServiceHistory = require('../models/ServiceHistory');
const HistoricalRecord = require('../models/HistoricalRecord');

function calculateRisk(currentMileage) {
  if (currentMileage >= 80000) {
    return {
      level: 'High',
      explanation: 'Mileage is very high, so maintenance should be prioritized soon.',
      recommendation: 'Schedule an urgent inspection and service check.',
      color: 'danger',
    };
  }

  if (currentMileage >= 50000) {
    return {
      level: 'Medium',
      explanation: 'Mileage is elevated, so preventive maintenance is recommended.',
      recommendation: 'Plan a preventive maintenance visit in the next few weeks.',
      color: 'accent',
    };
  }

  return {
    level: 'Low',
    explanation: 'Mileage is still within a healthy range for routine service.',
    recommendation: 'Continue standard maintenance and monitor usage.',
    color: 'success',
  };
}

async function updateVehicleMileage(req, res) {
  try {
    const { vehicle, currentMileage, updatedMileage, notes } = req.body;

    if (!vehicle || currentMileage === undefined || updatedMileage === undefined) {
      return res.status(400).json({ message: 'Vehicle, current mileage, and updated mileage are required.' });
    }

    if (Number(updatedMileage) <= Number(currentMileage)) {
      return res.status(400).json({ message: 'Updated mileage must be greater than the current mileage.' });
    }

    const record = await VehicleMileage.create({ vehicle, currentMileage, updatedMileage, notes });
    return res.status(201).json({ message: 'Mileage updated successfully.', record });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update mileage.', error: error.message });
  }
}

async function saveServiceCost(req, res) {
  try {
    const { vehicle, labourCost, sparePartsCost, otherCharges, description } = req.body;

    if (!vehicle || !vehicle.trim()) {
      return res.status(400).json({ message: 'Vehicle is required.' });
    }

    if (labourCost === undefined || labourCost === '') {
      return res.status(400).json({ message: 'Labour cost is required.' });
    }

    const totalCost = Number(labourCost || 0) + Number(sparePartsCost || 0) + Number(otherCharges || 0);
    const record = await ServiceCost.create({ vehicle, labourCost, sparePartsCost, otherCharges, totalCost, description });
    return res.status(201).json({ message: 'Service cost saved.', record });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to save service cost.', error: error.message });
  }
}

async function getServiceCosts(req, res) {
  try {
    const records = await ServiceCost.find().sort({ createdAt: -1 });
    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve service costs.', error: error.message });
  }
}

async function updateServiceCost(req, res) {
  try {
    const { labourCost, sparePartsCost, otherCharges, description } = req.body;
    const totalCost = Number(labourCost || 0) + Number(sparePartsCost || 0) + Number(otherCharges || 0);

    const record = await ServiceCost.findByIdAndUpdate(
      req.params.id,
      { ...req.body, totalCost, description },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Service cost record not found.' });
    }

    return res.status(200).json({ message: 'Service cost updated.', record });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update service cost.', error: error.message });
  }
}

async function deleteServiceCost(req, res) {
  try {
    const record = await ServiceCost.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Service cost record not found.' });
    }

    return res.status(200).json({ message: 'Service cost deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete service cost.', error: error.message });
  }
}

async function saveServiceSchedule(req, res) {
  try {
    const { vehicle, currentMileage, serviceInterval, currentServiceDate, notes } = req.body;

    if (!vehicle || currentMileage === undefined || serviceInterval === undefined) {
      return res.status(400).json({ message: 'Vehicle, current mileage, and service interval are required.' });
    }

    if (Number(serviceInterval) <= 0) {
      return res.status(400).json({ message: 'Service interval must be greater than 0.' });
    }

    const nextServiceMileage = Number(currentMileage) + Number(serviceInterval);
    const baseDate = currentServiceDate ? new Date(currentServiceDate) : new Date();
    const nextServiceDate = new Date(baseDate.getTime() + Number(serviceInterval) * 24 * 60 * 60 * 1000);

    const record = await ServiceSchedule.create({ vehicle, currentMileage, serviceInterval, currentServiceDate: baseDate, nextServiceMileage, nextServiceDate, notes });
    return res.status(201).json({ message: 'Service schedule saved.', record });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to save service schedule.', error: error.message });
  }
}

async function getServiceSchedules(req, res) {
  try {
    const records = await ServiceSchedule.find().sort({ createdAt: -1 });
    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve service schedules.', error: error.message });
  }
}

async function updateServiceSchedule(req, res) {
  try {
    const { vehicle, currentMileage, serviceInterval, currentServiceDate, notes } = req.body;

    if (!vehicle || currentMileage === undefined || serviceInterval === undefined) {
      return res.status(400).json({ message: 'Vehicle, current mileage, and service interval are required.' });
    }

    const nextServiceMileage = Number(currentMileage) + Number(serviceInterval);
    const baseDate = currentServiceDate ? new Date(currentServiceDate) : new Date();
    const nextServiceDate = new Date(baseDate.getTime() + Number(serviceInterval) * 24 * 60 * 60 * 1000);

    const record = await ServiceSchedule.findByIdAndUpdate(
      req.params.id,
      { vehicle, currentMileage, serviceInterval, currentServiceDate: baseDate, nextServiceMileage, nextServiceDate, notes },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Service schedule not found.' });
    }

    return res.status(200).json({ message: 'Service schedule updated.', record });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update service schedule.', error: error.message });
  }
}

async function getServiceHistory(req, res) {
  try {
    const { search = '', status, page = 1, limit = 5 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { vehicle: { $regex: search, $options: 'i' } },
        { mechanic: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      ServiceHistory.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      ServiceHistory.countDocuments(query),
    ]);

    return res.status(200).json({ records, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve service history.', error: error.message });
  }
}

async function addHistoricalRecord(req, res) {
  try {
    const { vehicle, date, description, cost } = req.body;

    if (!vehicle || !vehicle.trim()) {
      return res.status(400).json({ message: 'Vehicle is required.' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description is required.' });
    }

    const record = await HistoricalRecord.create({ vehicle, date: date || new Date(), description, cost: Number(cost || 0) });
    return res.status(201).json({ message: 'Historical record added.', record });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to add historical record.', error: error.message });
  }
}

async function getHistoricalRecords(req, res) {
  try {
    const records = await HistoricalRecord.find().sort({ date: -1 });
    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve historical records.', error: error.message });
  }
}

async function updateHistoricalRecord(req, res) {
  try {
    const record = await HistoricalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) {
      return res.status(404).json({ message: 'Historical record not found.' });
    }

    return res.status(200).json({ message: 'Historical record updated.', record });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update historical record.', error: error.message });
  }
}

async function deleteHistoricalRecord(req, res) {
  try {
    const record = await HistoricalRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Historical record not found.' });
    }

    return res.status(200).json({ message: 'Historical record deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete historical record.', error: error.message });
  }
}

async function completeService(req, res) {
  try {
    const { vehicle, mechanic, totalCost, nextServiceDue } = req.body;

    if (!vehicle || !vehicle.trim()) {
      return res.status(400).json({ message: 'Vehicle is required.' });
    }

    if (!mechanic || !mechanic.trim()) {
      return res.status(400).json({ message: 'Mechanic is required.' });
    }

    if (totalCost === undefined || totalCost === '') {
      return res.status(400).json({ message: 'Total cost is required.' });
    }

    const regUpper = vehicle.trim().toUpperCase();

    const record = await ServiceHistory.create({
      vehicle: regUpper,
      vehicleId: regUpper,
      driverId: 'driver-001',
      mechanic: mechanic.trim(),
      cost: Number(totalCost),
      serviceType: 'Routine Maintenance',
      performedDate: new Date(),
      date: new Date(),
      status: 'Completed',
      description: nextServiceDue ? `Next service due: ${nextServiceDue}` : 'Completed service',
      notes: nextServiceDue ? `Next service due: ${nextServiceDue}` : 'Completed service',
    });

    // Sync matching vehicle maintenance status & queue item
    try {
      const Vehicle = require('../../../Admin/backend/src/models/Vehicle');
      const targetVehicle = await Vehicle.findOne({
        $or: [{ registrationNumber: regUpper }, { _id: mongoose.Types.ObjectId.isValid(vehicle) ? vehicle : null }]
      }).catch(() => null);

      if (targetVehicle) {
        targetVehicle.maintenanceStatus = 'Operational';
        if (targetVehicle.status === 'Under Service' || targetVehicle.status === 'Maintenance') {
          targetVehicle.status = (targetVehicle.assignedDriver && targetVehicle.assignedDriver !== 'Unassigned') ? 'Assigned' : 'Available';
        }
        await targetVehicle.save().catch(() => {});
      }

      const ServiceQueue = require('../models/ServiceQueue');
      await ServiceQueue.updateMany(
        { vehicleNumber: regUpper },
        { status: 'Completed' }
      ).catch(() => {});
    } catch (syncErr) {
      console.warn('Sync completed service with Vehicle/Queue warning:', syncErr.message);
    }

    return res.status(201).json({ message: 'Service marked completed successfully.', record });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to complete service.', error: error.message });
  }
}

async function getMaintenanceRisk(req, res) {
  try {
    const { mileage } = req.query;
    if (mileage === undefined) {
      return res.status(400).json({ message: 'Mileage is required.' });
    }

    return res.status(200).json(calculateRisk(Number(mileage)));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to calculate maintenance risk.', error: error.message });
  }
}

module.exports = {
  updateVehicleMileage,
  saveServiceCost,
  getServiceCosts,
  updateServiceCost,
  deleteServiceCost,
  saveServiceSchedule,
  getServiceSchedules,
  updateServiceSchedule,
  getServiceHistory,
  addHistoricalRecord,
  getHistoricalRecords,
  updateHistoricalRecord,
  deleteHistoricalRecord,
  completeService,
  getMaintenanceRisk,
};
