const Assignment = require("../models/Assignment");
const Vehicle = require("../models/Vehicle");
const mongoose = require("mongoose");

const assignVehicle = async (req, res) => {
    try {
        const { vehicleId, driverName, driverId, notes, assignedDate } = req.body;

        if (!vehicleId || !driverName) {
            return res.status(400).json({ message: "Vehicle and driver name are required" });
        }

        const vehicle = await Vehicle.findById(vehicleId).catch(() => null);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        if (vehicle.status === "Assigned") {
            return res.status(400).json({ message: `Vehicle ${vehicle.registrationNumber} is already assigned to ${vehicle.assignedDriver}` });
        }

        const regNum = vehicle.registrationNumber || "UNKNOWN";
        const vehName = `${vehicle.brand || ""} ${vehicle.model || ""}`.trim() || regNum;

        const assignment = new Assignment({
            vehicleId: vehicle._id,
            registrationNumber: regNum,
            vehicleNumber: regNum,
            vehicleName: vehName,
            driverId: driverId || 'driver-001',
            driverName: driverName.trim(),
            assignedDate: assignedDate ? new Date(assignedDate) : new Date(),
            status: "Active",
            notes: notes || "",
            complianceStatus: "Valid",
            insuranceExpiry: vehicle.insurance?.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            serviceDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        await assignment.save();

        vehicle.status = "Assigned";
        vehicle.assignedDriver = driverName.trim();
        vehicle.driverAssigned = driverName.trim();
        vehicle.assignedDriverId = driverId || null;
        await vehicle.save();

        res.status(200).json({
            message: `Vehicle ${regNum} assigned to ${driverName} successfully`,
            assignment
        });
    } catch (error) {
        console.error("assignVehicle error:", error);
        res.status(500).json({ message: error.message || "Failed to assign vehicle" });
    }
};

const unassignVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.body;
        const vehicle = await Vehicle.findById(vehicleId).catch(() => null);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const activeAssignment = await Assignment.findOne({ vehicleId: vehicle._id, status: "Active" }).catch(() => null);
        if (activeAssignment) {
            activeAssignment.status = "Completed";
            activeAssignment.returnDate = new Date();
            await activeAssignment.save().catch(() => {});
        }

        vehicle.status = "Available";
        vehicle.assignedDriver = "Unassigned";
        vehicle.driverAssigned = "Unassigned";
        vehicle.assignedDriverId = null;
        await vehicle.save().catch(() => {});

        res.status(200).json({ message: `Vehicle ${vehicle.registrationNumber} is now available`, vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAssignments = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(200).json([]);
        }

        const assignments = await Assignment.find()
            .sort({ createdAt: -1 })
            .lean()
            .catch(() => []);

        res.status(200).json(assignments || []);
    } catch (error) {
        res.status(200).json([]);
    }
};

module.exports = {
    assignVehicle,
    unassignVehicle,
    getAssignments
};