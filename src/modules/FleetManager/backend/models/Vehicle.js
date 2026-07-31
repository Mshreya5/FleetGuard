const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        registrationNumber: {
            type: String,
            required: [true, "Registration number is required"],
            unique: true,
            trim: true,
            uppercase: true
        },
        model: {
            type: String,
            required: [true, "Model is required"],
            trim: true
        },
        brand: {
            type: String,
            required: [true, "Brand is required"],
            trim: true
        },
        branch: {
            type: String,
            required: [true, "Branch is required"],
            trim: true
        },
        manufacturingYear: {
            type: Number,
            required: [true, "Manufacturing year is required"]
        },
        mileage: {
            type: Number,
            default: 0,
            min: [0, "Mileage cannot be negative"]
        },
        fuelType: {
            type: String,
            enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"],
            default: "Diesel"
        },
        vehicleType: {
            type: String,
            enum: ["Truck", "Van", "Sedan", "SUV", "Bus", "Trailer"],
            default: "Truck"
        },
        status: {
            type: String,
            enum: ["Available", "Assigned", "Maintenance"],
            default: "Available"
        },
        assignedDriver: {
            type: String,
            default: "Unassigned"
        },
        assignedDriverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            default: null
        },
        complianceSummary: {
            insuranceStatus: { type: String, default: "Missing" },
            insuranceExpiry: { type: Date, default: null },
            pollutionStatus: { type: String, default: "Missing" },
            pollutionExpiry: { type: Date, default: null },
            fitnessStatus: { type: String, default: "Missing" },
            fitnessExpiry: { type: Date, default: null },
            rcStatus: { type: String, default: "Missing" },
            rcExpiry: { type: Date, default: null },
            overallStatus: { type: String, default: "Expired" }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);