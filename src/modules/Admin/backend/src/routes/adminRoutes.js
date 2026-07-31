const express = require('express');
const { getDashboardData, getComplianceData, getUpcomingExpiryData } = require('../controllers/adminController');
const { getOverdueCompliance } = require('../controllers/overdueController');
const { getServiceCostSummary, getAllMaintenance } = require('../controllers/maintenanceController');
const { getOverrideLogs, createOverrideLog } = require('../controllers/overrideController');
const { getAlertSettings, updateAlertSettings } = require('../controllers/alertController');
const { getNotifications, markAsRead, deleteNotification } = require('../controllers/notificationController');
const { getFleetReport } = require('../controllers/reportController');

const router = express.Router();

// Existing
router.get('/dashboard', getDashboardData);
router.get('/compliance', getComplianceData);
router.get('/upcoming-expiry', getUpcomingExpiryData);

// FG-AD-04
router.get('/overdue', getOverdueCompliance);

// FG-AD-05
router.get('/service-cost', getServiceCostSummary);
router.get('/maintenance', getAllMaintenance);

// FG-AD-07
router.get('/override-logs', getOverrideLogs);
router.post('/override-logs', createOverrideLog);

// FG-AD-08
router.get('/alert-settings', getAlertSettings);
router.put('/alert-settings', updateAlertSettings);

// FG-AD-09
router.get('/notifications', getNotifications);
router.patch('/notifications/read/:id', markAsRead);
router.delete('/notifications/:id', deleteNotification);

// FG-AD-10
router.get('/report', getFleetReport);

module.exports = router;
