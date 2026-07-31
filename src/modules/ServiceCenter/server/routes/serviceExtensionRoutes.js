const express = require('express');
const {
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
} = require('../controllers/serviceExtensionController');

const router = express.Router();

router.post('/mileage', updateVehicleMileage);
router.post('/costs', saveServiceCost);
router.get('/costs', getServiceCosts);
router.put('/costs/:id', updateServiceCost);
router.delete('/costs/:id', deleteServiceCost);
router.post('/schedules', saveServiceSchedule);
router.get('/schedules', getServiceSchedules);
router.put('/schedules/:id', updateServiceSchedule);
router.get('/history', getServiceHistory);
router.post('/history', addHistoricalRecord);
router.get('/historical', getHistoricalRecords);
router.put('/historical/:id', updateHistoricalRecord);
router.delete('/historical/:id', deleteHistoricalRecord);
router.post('/complete', completeService);
router.get('/risk', getMaintenanceRisk);

module.exports = router;
