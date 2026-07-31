const Vehicle = require("../models/Vehicle");
const Compliance = require("../models/Compliance");
const mongoose = require("mongoose");

// GET DASHBOARD SUMMARY (FG-FM-01)
const getDashboardSummary = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(200).json({
                cards: {
                    totalVehicles: 0,
                    assignedVehicles: 0,
                    availableVehicles: 0,
                    complianceSummary: { valid: 0, expiringSoon: 0, expired: 0 },
                    expiringDocuments: 0
                },
                recentlyAddedVehicles: []
            });
        }

        const totalVehicles = await Vehicle.countDocuments().catch(() => 0);
        const assignedVehicles = await Vehicle.countDocuments({ status: "Assigned" }).catch(() => 0);
        const availableVehicles = await Vehicle.countDocuments({ status: "Available" }).catch(() => 0);

        const now = new Date();
        const allDocs = await Compliance.find().catch(() => []);

        let expiringDocumentsCount = 0;
        let validDocs = 0;
        let expiringSoonDocs = 0;
        let expiredDocs = 0;

        allDocs.forEach(doc => {
            const exp = new Date(doc.expiryDate);
            const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
            if (daysLeft < 0) {
                expiredDocs++;
                expiringDocumentsCount++;
            } else if (daysLeft <= 30) {
                expiringSoonDocs++;
                expiringDocumentsCount++;
            } else {
                validDocs++;
            }
        });

        const recentlyAddedVehicles = await Vehicle.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("registrationNumber model brand branch status createdAt")
            .catch(() => []);

        res.status(200).json({
            cards: {
                totalVehicles,
                assignedVehicles,
                availableVehicles,
                complianceSummary: {
                    valid: validDocs,
                    expiringSoon: expiringSoonDocs,
                    expired: expiredDocs
                },
                expiringDocuments: expiringDocumentsCount
            },
            recentlyAddedVehicles
        });
    } catch (error) {
        res.status(200).json({
            cards: {
                totalVehicles: 0,
                assignedVehicles: 0,
                availableVehicles: 0,
                complianceSummary: { valid: 0, expiringSoon: 0, expired: 0 },
                expiringDocuments: 0
            },
            recentlyAddedVehicles: []
        });
    }
};

module.exports = {
    getDashboardSummary
};
