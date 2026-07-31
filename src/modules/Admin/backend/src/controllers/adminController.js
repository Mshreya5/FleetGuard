const Vehicle = require('../models/Vehicle');

const getDocumentStatus = (daysRemaining) => {
  if (daysRemaining < 7) return 'Expired';
  if (daysRemaining <= 15) return 'Expiring Soon';
  return 'Valid';
};

const getDaysRemaining = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const differenceInDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  return differenceInDays >= 0 ? differenceInDays : 0;
};

const buildComplianceData = (vehicles) => {
  const transformed = vehicles.map((vehicle) => {
    const insuranceStatus = vehicle.insurance?.status || 'Valid';
    const pollutionStatus = vehicle.pollution?.status || 'Valid';
    const fitnessStatus = vehicle.fitness?.status || 'Valid';
    const overallStatus = insuranceStatus === 'Valid' && pollutionStatus === 'Valid' && fitnessStatus === 'Valid'
      ? 'Compliant'
      : 'Non-Compliant';

    return {
      registrationNumber: vehicle.registrationNumber,
      insurance: insuranceStatus,
      pollution: pollutionStatus,
      fitness: fitnessStatus,
      overall: overallStatus,
    };
  });

  const compliantCount = transformed.filter((vehicle) => vehicle.overall === 'Compliant').length;
  const expiredInsurance = transformed.filter((vehicle) => vehicle.insurance === 'Expired').length;
  const expiredPollution = transformed.filter((vehicle) => vehicle.pollution === 'Expired').length;
  const expiredFitness = transformed.filter((vehicle) => vehicle.fitness === 'Expired').length;
  const compliancePercentage = transformed.length ? Math.round((compliantCount / transformed.length) * 100) : 0;

  return {
    vehicles: transformed,
    summary: {
      compliantVehicles: compliantCount,
      expiredInsurance,
      expiredPollution,
      expiredFitness,
      compliancePercentage,
    },
  };
};

const buildExpiryData = (vehicles) => {
  const expiryRecords = [];

  vehicles.forEach((vehicle) => {
    const documents = [
      {
        documentType: 'Insurance',
        statusValue: vehicle.insurance?.status,
        expiryDate: vehicle.insurance?.expiryDate,
      },
      {
        documentType: 'Pollution Certificate',
        statusValue: vehicle.pollution?.status,
        expiryDate: vehicle.pollution?.expiryDate,
      },
      {
        documentType: 'Fitness Certificate',
        statusValue: vehicle.fitness?.status,
        expiryDate: vehicle.fitness?.expiryDate,
      },
    ];

    documents.forEach((doc) => {
      const daysRemaining = getDaysRemaining(doc.expiryDate);
      const status = doc.statusValue === 'Expired' ? 'Expired' : getDocumentStatus(daysRemaining);
      expiryRecords.push({
        registrationNumber: vehicle.registrationNumber,
        documentType: doc.documentType,
        expiryDate: new Date(doc.expiryDate).toLocaleDateString('en-GB'),
        daysRemaining,
        status,
      });
    });
  });

  return expiryRecords;
};

const getDashboardData = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).lean();
    const complianceData = buildComplianceData(vehicles);
    const totalDrivers = vehicles.filter((vehicle) => vehicle.driverAssigned && vehicle.driverAssigned !== 'Unassigned').length;
    const fleetManagers = vehicles.filter((vehicle) => vehicle.fleetManager && vehicle.fleetManager !== 'Unassigned').length;
    const vehiclesUnderMaintenance = vehicles.filter((vehicle) => vehicle.maintenanceStatus === 'Under Maintenance').length;
    const upcomingExpiries = buildExpiryData(vehicles).filter((item) => item.daysRemaining <= 15).length;
    const notifications = [
      ...vehicles.slice(0, 3).map((vehicle) => `${vehicle.registrationNumber} requires attention for compliance review.`),
      `Fleet maintenance has ${vehiclesUnderMaintenance} active vehicles pending review.`,
    ];

    return res.status(200).json({
      summary: {
        totalVehicles: vehicles.length,
        totalDrivers,
        fleetManagers,
        vehiclesUnderMaintenance,
        compliantVehicles: complianceData.summary.compliantVehicles,
        nonCompliantVehicles: vehicles.length - complianceData.summary.compliantVehicles,
        upcomingExpiries,
      },
      notifications,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load dashboard data', error: error.message });
  }
};

const getComplianceData = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).lean();
    const complianceData = buildComplianceData(vehicles);
    return res.status(200).json(complianceData);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load compliance data', error: error.message });
  }
};

const getUpcomingExpiryData = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).lean();
    const expiries = buildExpiryData(vehicles);
    return res.status(200).json({ expiries });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load expiry data', error: error.message });
  }
};

module.exports = {
  getDashboardData,
  getComplianceData,
  getUpcomingExpiryData,
};
