const express = require("express");
const router = express.Router();
const {
    assignVehicle,
    unassignVehicle,
    getAssignments
} = require("../controllers/assignmentController");

router.post("/assign", assignVehicle);
router.post("/unassign", unassignVehicle);
router.get("/", getAssignments);

module.exports = router;