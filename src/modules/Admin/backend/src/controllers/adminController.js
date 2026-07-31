const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose');

const getDocumentStatus = (daysRemaining) => {
  if (daysRemaining < 7) return 'Expired';
  if (daysRemaining <= 15) return 'Expiring Soon';
  return 'Valid';
};

const getDaysRemaining = (expiryDate) => {
  if (!expiryDate) return 0;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const differenceInDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  return differenceInDays >= 0 ? differenceInDays : 0;
};

const buildComplianceData = (vehicles) => {
  const transformed = (vehicles || []).map((vehicle) => {
    const insuranceStatus = vehicle.insurance?.status || vehicle.complianceSummary?.insuranceStatus || 'Valid';
    const pollutionStatus = vehicle.pollution?.status || vehicle.complianceSummary?.pollutionStatus || 'Valid';
    const fitnessStatus = vehicle.fitness?.status || vehicle.complianceSummary?.fitnessStatus || 'Valid';
    
    const overallStatus = (insuranceStatus === 'Valid' || insuranceStatus === 'Compliant') &&
      (pollutionStatus === 'Valid' || pollutionStatus === 'Compliant') &&
      (fitnessStatus === 'Valid' || fitnessStatus === 'Compliant')
      ? 'Compliant'
      : 'Non-Compliant';

    return {
      registrationNumber: vehicle.registrationNumber || 'N/A',
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

  (vehicles || []).forEach((vehicle) => {
    const documents = [
      {
        documentType: 'Insurance',
        statusValue: vehicle.insurance?.status || vehicle.complianceSummary?.insuranceStatus,
        expiryDate: vehicle.insurance?.expiryDate || vehicle.complianceSummary?.insuranceExpiry,
      },
      {
        documentType: 'Pollution Certificate',
        statusValue: vehicle.pollution?.status || vehicle.complianceSummary?.pollutionStatus,
        expiryDate: vehicle.pollution?.expiryDate || vehicle.complianceSummary?.pollutionExpiry,
      },
      {
        documentType: 'Fitness Certificate',
        statusValue: vehicle.fitness?.status || vehicle.complianceSummary?.fitnessStatus,
        expiryDate: vehicle.fitness?.expiryDate || vehicle.complianceSummary?.fitnessExpiry,
      },
    ];

    documents.forEach((doc) => {
      if (doc.expiryDate || doc.statusValue) {
        const daysRemaining = getDaysRemaining(doc.expiryDate);
        const status = doc.statusValue === 'Expired' ? 'Expired' : getDocumentStatus(daysRemaining);
        expiryRecords.push({
          registrationNumber: vehicle.registrationNumber || 'N/A',
          documentType: doc.documentType,
          expiryDate: doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString('en-GB') : 'N/A',
          daysRemaining,
          status,
        });
      }
    });
  });

  return expiryRecords;
};

const getDashboardData = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).lean().catch(() => []);
    const complianceData = buildComplianceData(vehicles);
    
    const totalDrivers = vehicles.filter((vehicle) => 
      (vehicle.driverAssigned && vehicle.driverAssigned !== 'Unassigned') ||
      (vehicle.assignedDriver && vehicle.assignedDriver !== 'Unassigned')
    ).length;
    
    const fleetManagers = vehicles.filter((vehicle) => 
      vehicle.fleetManager && vehicle.fleetManager !== 'Unassigned'
    ).length;
    
    const vehiclesUnderMaintenance = vehicles.filter((vehicle) =>
      vehicle.maintenanceStatus === 'Under Maintenance' ||
      vehicle.status === 'Maintenance' ||
      vehicle.status === 'Under Service'
    ).length;
    
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
    return res.status(200).json({
      summary: {
        totalVehicles: 0,
        totalDrivers: 0,
        fleetManagers: 0,
        vehiclesUnderMaintenance: 0,
        compliantVehicles: 0,
        nonCompliantVehicles: 0,
        upcomingExpiries: 0,
      },
      notifications: ['System operating with initial settings.'],
    });
  }
};

const getComplianceData = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).lean().catch(() => []);
    const complianceData = buildComplianceData(vehicles);
    return res.status(200).json(complianceData);
  } catch (error) {
    return res.status(200).json(buildComplianceData([]));
  }
};

const getUpcomingExpiryData = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).lean().catch(() => []);
    const expiries = buildExpiryData(vehicles);
    return res.status(200).json({ expiries });
  } catch (error) {
    return res.status(200).json({ expiries: [] });
  }
};

module.exports = {
  getDashboardData,
  getComplianceData,
  getUpcomingExpiryData,
};
