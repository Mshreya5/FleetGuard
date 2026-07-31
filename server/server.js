const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../src/modules/FleetManager/backend/.env') });

const connectDB = require('./config/db');

// Import Stakeholder Routes
// 1. Fleet Manager Routes
const fmDashboardRoutes = require('../src/modules/FleetManager/backend/routes/dashboardRoutes');
const fmVehicleRoutes = require('../src/modules/FleetManager/backend/routes/vehicleRoutes');
const fmComplianceRoutes = require('../src/modules/FleetManager/backend/routes/complianceRoutes');
const fmAssignmentRoutes = require('../src/modules/FleetManager/backend/routes/assignmentRoutes');

// 2. Admin Routes
const adminRoutes = require('../src/modules/Admin/backend/src/routes/adminRoutes');
const adminUserRoutes = require('../src/modules/Admin/backend/src/routes/userRoutes');

// 3. Service Center Routes
const serviceCenterRoutes = require('../src/modules/ServiceCenter/server/routes/serviceRoutes');
const serviceCenterExtensionRoutes = require('../src/modules/ServiceCenter/server/routes/serviceExtensionRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadsPath = path.join(__dirname, '../src/modules/FleetManager/backend/uploads');
app.use('/uploads', express.static(uploadsPath));

// Stakeholder API Route Mounts

// Fleet Manager APIs
app.use('/api/dashboard', fmDashboardRoutes);
app.use('/api/vehicles', fmVehicleRoutes);
app.use('/api/compliance', fmComplianceRoutes);
app.use('/api/assignments', fmAssignmentRoutes);

// Fleet Manager API v1 prefix compatibility
app.use('/api/v1/fleet-manager/vehicles', fmVehicleRoutes);
app.use('/api/v1/fleet-manager/compliance', fmComplianceRoutes);
app.use('/api/v1/fleet-manager/assignments', fmAssignmentRoutes);
app.get('/api/v1/fleet-manager/drivers', (req, res) => {
  res.status(200).json({ success: true, drivers: [] });
});

// Admin & Authentication APIs
app.use('/api/admin', adminRoutes);
app.use('/api/users', adminUserRoutes);
app.use('/api/auth', adminUserRoutes);

// Service Center APIs
app.use('/api/service-center', serviceCenterRoutes);
app.use('/api/service-center/extensions', serviceCenterExtensionRoutes);

// Driver APIs (Unified Endpoint)
app.get('/api/driver/dashboard', (req, res) => {
  res.status(200).json({ status: 'ok', module: 'Driver', assignments: [], notifications: [] });
});

// Health check endpoints
const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'FleetGuard Unified Backend Operational',
    modules: ['FleetManager', 'Admin', 'ServiceCenter', 'Driver'],
    timestamp: new Date()
  });
};

app.get('/api/health', healthCheck);
app.get('/health', healthCheck);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[FleetGuard Unified Backend Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`[FleetGuard Unified Server] Running on http://localhost:${PORT}`);
    console.log(`- FleetManager APIs: /api/dashboard, /api/vehicles, /api/compliance, /api/assignments`);
    console.log(`- Admin APIs:        /api/admin, /api/users`);
    console.log(`- ServiceCenter APIs: /api/service-center, /api/service-center/extensions`);
    console.log(`- Health Check:      /api/health`);
    console.log(`====================================================`);
  });
}

startServer();

module.exports = app;
