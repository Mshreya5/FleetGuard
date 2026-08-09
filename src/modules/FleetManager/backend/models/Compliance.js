const mongoose = require("mongoose");

const complianceSchema = new mongoose.Schema(
    {
        vehicleId: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        registrationNumber: {
            type: String,
            required: true
        },
        documentType: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        filePath: {
            type: String,
            required: true
        },
        fileData: {
            type: String,
            default: ""
        },
        mimeType: {
            type: String,
            default: ""
        },
        issueDate: {
            type: Date,
            required: true
        },
        expiryDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["Valid", "Expiring Soon", "Expired"],
            default: "Valid"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.models.Compliance || mongoose.model("Compliance", complianceSchema);
