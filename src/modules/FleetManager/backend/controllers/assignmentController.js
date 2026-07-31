const Assignment = require("../models/Assignment");
const Vehicle = require("../models/Vehicle");

const assignVehicle = async (req, res) => {
    try {
        const { vehicleId, driverName, driverId, notes, assignedDate } = req.body;

        if (!vehicleId || !driverName) {
            return res.status(400).json({ message: "Vehicle and driver name are required" });
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        if (vehicle.status === "Assigned") {
            return res.status(400).json({ message: `Vehicle ${vehicle.registrationNumber} is already assigned to ${vehicle.assignedDriver}` });
        }

        const assignment = new Assignment({
            vehicleId: vehicle._id,
            registrationNumber: vehicle.registrationNumber,
            driverId: driverId || null,
            driverName: driverName.trim(),
            assignedDate: assignedDate ? new Date(assignedDate) : new Date(),
            status: "Active",
            notes: notes || ""
        });

        await assignment.save();

        vehicle.status = "Assigned";
        vehicle.assignedDriver = driverName.trim();
        vehicle.assignedDriverId = null;
        await vehicle.save();

        res.status(200).json({
            message: `Vehicle ${vehicle.registrationNumber} assigned to ${driverName} successfully`,
            assignment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const unassignVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.body;
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const activeAssignment = await Assignment.findOne({ vehicleId: vehicle._id, status: "Active" });
        if (activeAssignment) {
            activeAssignment.status = "Completed";
            activeAssignment.returnDate = new Date();
            await activeAssignment.save();
        }

        vehicle.status = "Available";
        vehicle.assignedDriver = "Unassigned";
        vehicle.assignedDriverId = null;
        await vehicle.save();

        res.status(200).json({ message: `Vehicle ${vehicle.registrationNumber} is now available`, vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate("vehicleId", "registrationNumber model brand")
            .sort({ createdAt: -1 });

        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    assignVehicle,
    unassignVehicle,
    getAssignments
};