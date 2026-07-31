const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
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
        driverId: {
            type: String,
            default: null
        },
        driverName: {
            type: String,
            required: [true, "Driver name is required"],
            trim: true
        },
        assignedDate: {
            type: Date,
            default: Date.now
        },
        returnDate: {
            type: Date,
            default: null
        },
        status: {
            type: String,
            enum: ["Active", "Completed", "Cancelled"],
            default: "Active"
        },
        notes: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);