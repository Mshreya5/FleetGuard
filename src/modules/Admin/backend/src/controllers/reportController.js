const Vehicle = require('../models/Vehicle');
const Maintenance = require('../models/Maintenance');
const User = require('../models/User');

const getFleetReport = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).lean();
    const maintenance = await Maintenance.find({}).lean();
    const users = await User.find({}).select('-password').lean();

    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter((v) => v.status === 'Active').length;
    const inactiveVehicles = vehicles.filter((v) => v.status !== 'Active').length;

    const assignments = vehicles.map((v) => ({
      registrationNumber: v.registrationNumber,
      driver: v.driverAssigned || 'Unassigned',
      fleetManager: v.fleetManager || 'Unassigned',
      branch: v.branch,
      status: v.status,
    }));

    const compliantVehicles = vehicles.filter(
      (v) =>
        v.insurance?.status === 'Valid' &&
        v.pollution?.status === 'Valid' &&
        v.fitness?.status === 'Valid'
    ).length;

    const complianceSummary = {
      compliant: compliantVehicles,
      nonCompliant: totalVehicles - compliantVehicles,
      complianceRate: totalVehicles ? Math.round((compliantVehicles / totalVehicles) * 100) : 0,
    };

    const totalServiceCost = maintenance.reduce((sum, r) => sum + r.cost, 0);
    const serviceCosts = { total: totalServiceCost, records: maintenance.length };

    return res.status(200).json({
      report: {
        totalVehicles,
        activeVehicles,
        inactiveVehicles,
        assignments,
        complianceSummary,
        maintenanceHistory: maintenance,
        serviceCosts,
        users: users.length,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to generate fleet report', error: error.message });
  }
};

module.exports = { getFleetReport };
