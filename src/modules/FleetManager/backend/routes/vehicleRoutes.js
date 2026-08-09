const express = require("express");
const router = express.Router();
const {
    getVehicles,
    getVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle
} = require("../controllers/vehicleController");

router.get("/", getVehicles);
router.get("/:id", getVehicle);
router.post("/", addVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;