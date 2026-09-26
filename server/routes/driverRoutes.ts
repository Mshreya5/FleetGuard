const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getDriverDashboard,
  createChecklist,
  startTrip,
  createIssueReport,
  getNotifications,
  getAssignments,
  getServiceHistory,
} = require('../controllers/driverController');

router.use(verifyToken);

router.get('/dashboard', getDriverDashboard);
router.get('/notifications', getNotifications);
router.get('/assignments', getAssignments);
router.get('/service-history', getServiceHistory);
router.post('/checklist', createChecklist);
router.post('/trip/start', startTrip);
router.post('/issues', createIssueReport);

module.exports = router;

export {};
