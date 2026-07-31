const Compliance = require("../models/Compliance");
const Vehicle = require("../models/Vehicle");
const { recalculateComplianceStatus } = require("./vehicleController");

// UPLOAD / REPLACE DOCUMENT (FG-FM-07)
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a document file" });
        }

        const { vehicleId, documentType, issueDate, expiryDate } = req.body;

        if (!vehicleId || !documentType || !issueDate || !expiryDate) {
            return res.status(400).json({ message: "Vehicle, document type, issue date, and expiry date are required" });
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const expDate = new Date(expiryDate);
        const now = new Date();
        const daysLeft = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));

        let status = "Valid";
        if (daysLeft < 0) {
            status = "Expired";
        } else if (daysLeft <= 30) {
            status = "Expiring Soon";
        }

        // Replace existing document of same type if present
        let doc = await Compliance.findOne({ vehicleId, documentType });
        if (doc) {
            doc.filename = req.file.filename;
            doc.originalName = req.file.originalname;
            doc.filePath = `/uploads/${req.file.filename}`;
            doc.issueDate = issueDate;
            doc.expiryDate = expiryDate;
            doc.status = status;
            await doc.save();
        } else {
            doc = new Compliance({
                vehicleId,
                registrationNumber: vehicle.registrationNumber,
                documentType,
                filename: req.file.filename,
                originalName: req.file.originalname,
                filePath: `/uploads/${req.file.filename}`,
                issueDate,
                expiryDate,
                status
            });
            await doc.save();
        }

        // Update vehicle overall compliance summary
        await recalculateComplianceStatus(vehicle._id);

        res.status(200).json({
            message: `${documentType} uploaded successfully`,
            document: doc
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SYSTEM COMPLIANCE STATUS OVERVIEW (FG-FM-08)
const getComplianceStatus = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        const docs = await Compliance.find().populate("vehicleId", "registrationNumber model brand branch");

        let validCount = 0;
        let expiringCount = 0;
        let expiredCount = 0;

        const now = new Date();

        const updatedDocs = docs.map(d => {
            const exp = new Date(d.expiryDate);
            const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
            let currentStatus = "Valid";
            if (daysLeft < 0) {
                currentStatus = "Expired";
                expiredCount++;
            } else if (daysLeft <= 30) {
                currentStatus = "Expiring Soon";
                expiringCount++;
            } else {
                validCount++;
            }
            return {
                ...d._doc,
                daysLeft,
                status: currentStatus
            };
        });

        res.status(200).json({
            summary: {
                totalDocuments: docs.length,
                valid: validCount,
                expiringSoon: expiringCount,
                expired: expiredCount
            },
            documents: updatedDocs,
            vehiclesCount: vehicles.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET UPCOMING EXPIRIES (FG-FM-10)
const getUpcomingExpiries = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const targetDays = parseInt(days);

        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + targetDays);

        const docs = await Compliance.find()
            .populate("vehicleId", "registrationNumber model brand branch status")
            .sort({ expiryDate: 1 });

        const expiringDocs = docs.filter(doc => {
            const exp = new Date(doc.expiryDate);
            const daysRemaining = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
            return daysRemaining <= targetDays; // includes expired & expiring within specified days
        }).map(doc => {
            const exp = new Date(doc.expiryDate);
            const daysRemaining = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
            let badgeStatus = "Valid";
            if (daysRemaining < 0) badgeStatus = "Expired";
            else if (daysRemaining <= 30) badgeStatus = "Expiring Soon";

            return {
                _id: doc._id,
                vehicleId: doc.vehicleId?._id || doc.vehicleId,
                registrationNumber: doc.registrationNumber || doc.vehicleId?.registrationNumber || "N/A",
                model: doc.vehicleId?.model || "N/A",
                brand: doc.vehicleId?.brand || "N/A",
                branch: doc.vehicleId?.branch || "N/A",
                documentType: doc.documentType,
                filename: doc.filename,
                originalName: doc.originalName,
                filePath: doc.filePath,
                expiryDate: doc.expiryDate,
                daysRemaining,
                status: badgeStatus
            };
        });

        expiringDocs.sort((a, b) => a.daysRemaining - b.daysRemaining);

        res.status(200).json({
            filterDays: targetDays,
            totalCount: expiringDocs.length,
            expirations: expiringDocs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadDocument,
    getComplianceStatus,
    getUpcomingExpiries
};