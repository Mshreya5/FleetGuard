const Compliance = require("../models/Compliance");
const Vehicle = require("../models/Vehicle");
const { recalculateComplianceStatus } = require("./vehicleController");
const mongoose = require("mongoose");

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

        let vehicle = null;
        if (mongoose.Types.ObjectId.isValid(vehicleId)) {
            vehicle = await Vehicle.findById(vehicleId).catch(() => null);
        }
        if (!vehicle) {
            vehicle = await Vehicle.findOne({ registrationNumber: String(vehicleId).toUpperCase().trim() }).catch(() => null);
        }

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

        const fs = require('fs');
        let base64Data = '';
        if (req.file.buffer) {
            base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        } else if (req.file.path && fs.existsSync(req.file.path)) {
            try {
                const fileBuffer = fs.readFileSync(req.file.path);
                base64Data = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;
            } catch (e) {
                // Fallback
            }
        }

        const filename = req.file.filename || req.file.originalname || `document-${Date.now()}`;
        const finalFilePath = base64Data || `/uploads/${filename}`;

        // Replace existing document of same type if present
        let doc = await Compliance.findOne({
            $or: [
                { vehicleId: vehicle._id, documentType },
                { registrationNumber: vehicle.registrationNumber, documentType }
            ]
        }).catch(() => null);

        if (doc) {
            doc.vehicleId = vehicle._id;
            doc.registrationNumber = vehicle.registrationNumber;
            doc.filename = filename;
            doc.originalName = req.file.originalname;
            doc.filePath = finalFilePath;
            doc.fileData = base64Data;
            doc.mimeType = req.file.mimetype;
            doc.issueDate = issueDate;
            doc.expiryDate = expiryDate;
            doc.status = status;
            await doc.save();
        } else {
            doc = new Compliance({
                vehicleId: vehicle._id,
                registrationNumber: vehicle.registrationNumber,
                documentType,
                filename: filename,
                originalName: req.file.originalname,
                filePath: finalFilePath,
                fileData: base64Data,
                mimeType: req.file.mimetype,
                issueDate,
                expiryDate,
                status
            });
            await doc.save();
        }

        // Update vehicle overall compliance summary
        await recalculateComplianceStatus(vehicle._id);

        try {
            const Notification = require("../models/Notification");
            const AuditLog = require("../../../../server/models/AuditLog");
            await Notification.create({
                title: "Compliance Document Uploaded",
                message: `${documentType} uploaded for vehicle ${vehicle.registrationNumber}`,
                type: "Compliance",
                vehicleId: vehicle._id,
                role: "Fleet Manager"
            });
            await AuditLog.create({
                action: "COMPLIANCE_UPLOAD",
                entity: "Compliance",
                entityId: doc._id,
                description: `Uploaded ${documentType} for vehicle ${vehicle.registrationNumber} (Expiry: ${expiryDate})`,
                performedBy: req.user?.name || "Fleet Manager"
            });
        } catch (e) {
            // Non-blocking notification/audit logging
        }

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
        if (mongoose.connection.readyState !== 1) {
            return res.status(200).json({
                summary: { totalDocuments: 0, valid: 0, expiringSoon: 0, expired: 0 },
                documents: [],
                vehiclesCount: 0
            });
        }

        const vehicles = await Vehicle.find().catch(() => []);
        const docs = await Compliance.find().populate("vehicleId", "registrationNumber model brand branch").catch(() => []);

        let validCount = 0;
        let expiringCount = 0;
        let expiredCount = 0;

        const now = new Date();

        const updatedDocs = (docs || []).map(d => {
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
                ...(d._doc || d),
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
        res.status(200).json({
            summary: { totalDocuments: 0, valid: 0, expiringSoon: 0, expired: 0 },
            documents: [],
            vehiclesCount: 0
        });
    }
};

// GET UPCOMING EXPIRIES (FG-FM-10)
const getUpcomingExpiries = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(200).json({ filterDays: 30, totalCount: 0, expirations: [] });
        }

        const { days = 30 } = req.query;
        const targetDays = parseInt(days);

        const now = new Date();
        const docs = await Compliance.find()
            .populate("vehicleId", "registrationNumber model brand branch status")
            .sort({ expiryDate: 1 })
            .catch(() => []);

        const expiringDocs = (docs || []).filter(doc => {
            const exp = new Date(doc.expiryDate);
            const daysRemaining = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
            return daysRemaining <= targetDays;
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
        res.status(200).json({ filterDays: 30, totalCount: 0, expirations: [] });
    }
};

module.exports = {
    uploadDocument,
    getComplianceStatus,
    getUpcomingExpiries
};