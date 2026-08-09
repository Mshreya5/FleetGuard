const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/compliance", require("./routes/complianceRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", module: "FleetManager", timestamp: new Date() });
});

// Custom Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[FleetGuard FleetManager] Backend server running on http://localhost:${PORT}`);
});