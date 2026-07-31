const mongoose = require("mongoose");

const complianceSchema = new mongoose.Schema(
    {
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true
        },
        registrationNumber: {
            type: String,
            required: true
        },
        documentType: {
            type: String,
            enum: ["Insurance", "Pollution Certificate", "Fitness Certificate", "RC"],
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

module.exports = mongoose.model("Compliance", complianceSchema);
