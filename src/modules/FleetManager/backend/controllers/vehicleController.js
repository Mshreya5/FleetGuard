const Vehicle = require("../models/Vehicle");
const Compliance = require("../models/Compliance");
const Assignment = require("../models/Assignment");
const mongoose = require("mongoose");

// Helper to recalculate overall compliance status
const recalculateComplianceStatus = async (vehicleId) => {
    try {
        if (mongoose.connection.readyState !== 1) return;
        const docs = await Compliance.find({ vehicleId });
        const now = new Date();

        let insuranceStatus = "Missing", insuranceExpiry = null;
        let pollutionStatus = "Missing", pollutionExpiry = null;
        let fitnessStatus = "Missing", fitnessExpiry = null;
        let rcStatus = "Missing", rcExpiry = null;

        docs.forEach(doc => {
            const exp = new Date(doc.expiryDate);
            const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
            let docStatus = "Valid";
            if (daysLeft < 0) docStatus = "Expired";
            else if (daysLeft <= 30) docStatus = "Expiring Soon";

            doc.status = docStatus;
            doc.save().catch(() => {});

            if (doc.documentType === "Insurance") {
                insuranceStatus = docStatus;
                insuranceExpiry = doc.expiryDate;
            } else if (doc.documentType === "Pollution Certificate") {
                pollutionStatus = docStatus;
                pollutionExpiry = doc.expiryDate;
            } else if (doc.documentType === "Fitness Certificate") {
                fitnessStatus = docStatus;
                fitnessExpiry = doc.expiryDate;
            } else if (doc.documentType === "RC") {
                rcStatus = docStatus;
                rcExpiry = doc.expiryDate;
            }
        });

        const statuses = [insuranceStatus, pollutionStatus, fitnessStatus, rcStatus];
        let overallStatus = "Valid";
        if (statuses.includes("Expired") || statuses.includes("Missing")) {
            overallStatus = "Expired";
        } else if (statuses.includes("Expiring Soon")) {
            overallStatus = "Expiring Soon";
        }

        await Vehicle.findByIdAndUpdate(vehicleId, {
            complianceSummary: {
                insuranceStatus, insuranceExpiry,
                pollutionStatus, pollutionExpiry,
                fitnessStatus, fitnessExpiry,
                rcStatus, rcExpiry,
                overallStatus
            }
        });
    } catch (err) {
        console.warn("recalculateComplianceStatus warning:", err.message);
    }
};

// GET ALL VEHICLES (with search, filter, pagination)
const getVehicles = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(200).json({ vehicles: [], total: 0, page: 1, pages: 1 });
        }

        const { search, status, page = 1, limit = 10 } = req.query;
        let query = {};

        if (search) {
            const searchRegex = new RegExp(search, "i");
            query.$or = [
                { registrationNumber: searchRegex },
                { model: searchRegex },
                { brand: searchRegex },
                { branch: searchRegex }
            ];
        }

        if (status && status !== "All") {
            if (["Available", "Assigned", "Maintenance"].includes(status)) {
                query.status = status;
            } else if (["Valid", "Expiring Soon", "Expired"].includes(status)) {
                query["complianceSummary.overallStatus"] = status;
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Vehicle.countDocuments(query).catch(() => 0);
        const vehicles = await Vehicle.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .catch(() => []);

        res.status(200).json({
            vehicles,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)) || 1
        });
    } catch (error) {
        res.status(200).json({ vehicles: [], total: 0, page: 1, pages: 1 });
    }
};

// GET SINGLE VEHICLE
const getVehicle = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const vehicle = await Vehicle.findById(req.params.id).catch(() => null);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const complianceDocs = await Compliance.find({ vehicleId: vehicle._id }).sort({ createdAt: -1 }).catch(() => []);
        const assignmentHistory = await Assignment.find({ vehicleId: vehicle._id }).sort({ createdAt: -1 }).catch(() => []);

        res.status(200).json({
            vehicle,
            complianceDocs,
            assignmentHistory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADD VEHICLE (FG-FM-02)
const addVehicle = async (req, res) => {
    try {
        const { registrationNumber, model, brand, branch, manufacturingYear, mileage, fuelType, vehicleType } = req.body;

        if (!registrationNumber || !model || !brand || !branch || !manufacturingYear) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: "Database connection is not ready. Please try again in a moment." });
        }

        const formattedReg = registrationNumber.toUpperCase().trim();
        const existingVehicle = await Vehicle.findOne({
            registrationNumber: formattedReg
        }).catch(() => null);

        if (existingVehicle) {
            return res.status(400).json({ message: "Vehicle with this registration number already exists" });
        }

        const vehicle = new Vehicle({
            registrationNumber: formattedReg,
            model: model.trim(),
            brand: brand.trim(),
            branch: branch.trim(),
            manufacturingYear: Number(manufacturingYear),
            mileage: Number(mileage) || 0,
            fuelType: fuelType || "Diesel",
            vehicleType: vehicleType || "Truck",
            status: "Available",
            assignedDriver: "Unassigned",
            driverAssigned: "Unassigned",
            insurance: { status: "Valid", expiryDate: new Date(Date.now() + 365*24*60*60*1000) },
            pollution: { status: "Valid", expiryDate: new Date(Date.now() + 180*24*60*60*1000) },
            fitness: { status: "Valid", expiryDate: new Date(Date.now() + 365*24*60*60*1000) }
        });

        const savedVehicle = await vehicle.save();
        res.status(201).json(savedVehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE VEHICLE (FG-FM-05)
const updateVehicle = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: "Database connection is not ready." });
        }

        const vehicle = await Vehicle.findById(req.params.id).catch(() => null);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        if (req.body.registrationNumber && req.body.registrationNumber.toUpperCase().trim() !== vehicle.registrationNumber) {
            const dup = await Vehicle.findOne({ registrationNumber: req.body.registrationNumber.toUpperCase().trim() }).catch(() => null);
            if (dup) {
                return res.status(400).json({ message: "Registration number already used by another vehicle" });
            }
        }

        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedVehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE VEHICLE (FG-FM-06)
const deleteVehicle = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: "Database connection is not ready." });
        }

        const vehicle = await Vehicle.findById(req.params.id).catch(() => null);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        await Compliance.deleteMany({ vehicleId: vehicle._id }).catch(() => {});
        await Assignment.deleteMany({ vehicleId: vehicle._id }).catch(() => {});
        await vehicle.deleteOne();

        res.status(200).json({ message: "Vehicle and related data deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVehicles,
    getVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    recalculateComplianceStatus
};