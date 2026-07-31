const express = require('express');
const {
  getDashboardData,
  getQueue,
  createQueueItem,
  updateQueueItem,
  deleteQueueItem,
  getServiceLogs,
  createServiceLog,
  getServiceLogById,
  updateServiceLog,
  deleteServiceLog,
} = require('../controllers/serviceController');

const router = express.Router();

router.get('/dashboard', getDashboardData);
router.get('/queue', getQueue);
router.post('/queue', createQueueItem);
router.put('/queue/:id', updateQueueItem);
router.delete('/queue/:id', deleteQueueItem);
router.get('/logs', getServiceLogs);
router.post('/logs', createServiceLog);
router.get('/logs/:id', getServiceLogById);
router.put('/logs/:id', updateServiceLog);
router.delete('/logs/:id', deleteServiceLog);

module.exports = router;
