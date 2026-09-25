// const express = require('express');
// const router = express.Router();
// const {
//   getDriverDashboard,
//   createChecklist,
//   startTrip,
//   createIssueReport,
//   getNotifications,
//   getAssignments,
//   getServiceHistory,
// } = require('../controllers/driverController');

// router.get('/dashboard', getDriverDashboard);
// router.get('/notifications', getNotifications);
// router.get('/assignments', getAssignments);
// router.get('/service-history', getServiceHistory);
// router.post('/checklist', createChecklist);
// router.post('/trip/start', startTrip);
// router.post('/issues', createIssueReport);

// module.exports = router;
import express from "express";

import {
    getDriverDashboard,
    createChecklist,
    startTrip,
    createIssueReport,
    getNotifications,
    getAssignments,
    getServiceHistory
} from "../controllers/driverController";

const router = express.Router();

router.get("/dashboard", getDriverDashboard);

router.get("/notifications", getNotifications);

router.get("/assignments", getAssignments);

router.get("/service-history", getServiceHistory);

router.post("/checklist", createChecklist);

router.post("/trip/start", startTrip);

router.post("/issues", createIssueReport);

export default router;