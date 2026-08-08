const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');
let helmet;
try {
  helmet = require('helmet');
} catch (e) {
  helmet = null;
}

const connectDB = require('./config/db');

// Environment variable setup
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

// Middlewares
const { verifyToken, requireRole, JWT_SECRET } = require('./middleware/auth');
const { getAuditLogs } = require('./controllers/auditLogController');

// Controllers & Routes
const {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  changePassword,
} = require('./controllers/userController');

const {
  getVehicles,
  getVehicle,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} = require('./controllers/vehicleController');

const {
  assignVehicle,
  unassignVehicle,
  getAssignments,
  getAssignmentsByDriverId,
} = require('./controllers/assignmentController');

const {
  getServiceDashboard,
  getServiceQueue,
  createServiceRequest,
  completeService,
  updateVehicleMileage,
} = require('./controllers/serviceController');

const {
  getServiceCosts,
  createServiceCost,
  getServiceHistory: getExtensionsHistory,
  createServiceHistory: createExtensionsHistory,
  getServiceSchedules,
  createServiceSchedule,
  getMaintenanceRisk,
  completeServiceExtension,
} = require('./controllers/serviceExtensionsController');

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} = require('./controllers/notificationController');

const driverRoutes = require('./routes/driverRoutes');
const adminRoutes = require('../src/modules/Admin/backend/src/routes/adminRoutes');
const fmComplianceRoutes = require('../src/modules/FleetManager/backend/routes/complianceRoutes');
const fmDashboardRoutes = require('../src/modules/FleetManager/backend/routes/dashboardRoutes');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Optional Auth Middleware
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers.cookie) {
      const match = req.headers.cookie.match(/token=([^;]+)/);
      if (match) token = match[1];
    }
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    }
  } catch (err) {
    // Continue as guest
  }
  next();
};

// Security & Parsing Middleware
if (helmet) {
  app.use(helmet({ contentSecurityPolicy: false }));
} else {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadsPath = path.join(__dirname, '../src/modules/FleetManager/backend/uploads');
app.use('/uploads', express.static(uploadsPath));

// API ROUTE MOUNTS

// 1. AUTHENTICATION & USER MANAGEMENT
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.get('/api/auth/me', verifyToken, getProfile);
app.put('/api/auth/profile', verifyToken, updateUserProfile);
app.post('/api/auth/change-password', verifyToken, changePassword);

app.get('/api/users', verifyToken, requireRole(['Admin']), getUsers);
app.post('/api/users', verifyToken, requireRole(['Admin']), createUser);
app.put('/api/users/:id', verifyToken, requireRole(['Admin']), updateUser);
app.delete('/api/users/:id', verifyToken, requireRole(['Admin']), deleteUser);
app.patch('/api/users/status/:id', verifyToken, requireRole(['Admin']), updateUserStatus);

// 2. VEHICLE MANAGEMENT
app.get('/api/vehicles', verifyToken, getVehicles);
app.get('/api/vehicles/:id', verifyToken, getVehicle);
app.post('/api/vehicles', verifyToken, requireRole(['Admin', 'Fleet Manager']), addVehicle);
app.put('/api/vehicles/:id', verifyToken, requireRole(['Admin', 'Fleet Manager']), updateVehicle);
app.delete('/api/vehicles/:id', verifyToken, requireRole(['Admin', 'Fleet Manager']), deleteVehicle);

// Fleet Manager API compatibility
app.use('/api/v1/fleet-manager/vehicles', verifyToken, getVehicles);

// 3. VEHICLE ASSIGNMENTS
app.get('/api/assignments', verifyToken, getAssignments);
app.get('/api/assignments/driver/:driverId', verifyToken, getAssignmentsByDriverId);
app.post('/api/assignments', verifyToken, requireRole(['Admin', 'Fleet Manager']), assignVehicle);
app.post('/api/assignments/assign', verifyToken, requireRole(['Admin', 'Fleet Manager']), assignVehicle);
app.put('/api/assignments', verifyToken, requireRole(['Admin', 'Fleet Manager']), assignVehicle);
app.post('/api/assignments/unassign', verifyToken, requireRole(['Admin', 'Fleet Manager']), unassignVehicle);
app.delete('/api/assignments', verifyToken, requireRole(['Admin', 'Fleet Manager']), unassignVehicle);
app.use('/api/v1/fleet-manager/assignments', verifyToken, getAssignments);

// 4. COMPLIANCE MANAGEMENT
app.use('/api/compliance', fmComplianceRoutes);
app.use('/api/v1/fleet-manager/compliance', fmComplianceRoutes);

// 5. DRIVER MODULE ROUTES
app.use('/api/driver', driverRoutes);

// 6. SERVICE CENTER MODULE ROUTES
app.get('/api/service-center/dashboard', getServiceDashboard);
app.get('/api/service-center/queue', getServiceQueue);
app.post('/api/service-center/requests', verifyToken, requireRole(['Admin', 'Fleet Manager', 'Service Center', 'Driver']), createServiceRequest);
app.post('/api/service-center/complete/:id', verifyToken, requireRole(['Admin', 'Service Center']), completeService);
app.post('/api/service-center/mileage', verifyToken, requireRole(['Admin', 'Service Center']), updateVehicleMileage);

// Service Center Extension APIs
app.get('/api/service-center/extensions/costs', getServiceCosts);
app.post('/api/service-center/extensions/costs', createServiceCost);
app.get('/api/service-center/extensions/history', getExtensionsHistory);
app.post('/api/service-center/extensions/history', createExtensionsHistory);
app.get('/api/service-center/extensions/historical', getServiceCosts);
app.get('/api/service-center/extensions/schedules', getServiceSchedules);
app.post('/api/service-center/extensions/schedules', createServiceSchedule);
app.get('/api/service-center/extensions/risk', getMaintenanceRisk);
app.post('/api/service-center/extensions/complete', completeServiceExtension);

// 7. ADMIN DASHBOARD & AUDIT LOGS
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', fmDashboardRoutes);
app.get('/api/audit-logs', getAuditLogs);

// 8. DATABASE-DRIVEN NOTIFICATION ENDPOINTS
app.get('/api/notifications', optionalAuth, getNotifications);
app.patch('/api/notifications/:id/read', optionalAuth, markAsRead);
app.post('/api/notifications/mark-all-read', optionalAuth, markAllAsRead);
app.delete('/api/notifications/clear', optionalAuth, clearNotifications);

// Health check endpoints
const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'FleetGuard Unified Backend Operational',
    modules: ['Admin', 'FleetManager', 'Driver', 'ServiceCenter'],
    timestamp: new Date(),
  });
};

app.get('/api/health', healthCheck);
app.get('/health', healthCheck);

// Global Centralized Error Handler (No stack trace exposure)
app.use((err, req, res, next) => {
  console.error('[FleetGuard Unified Backend Error]:', err.message || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`[FleetGuard Unified Server] Running on http://localhost:${PORT}`);
    console.log(`- Auth & Users:      /api/auth, /api/users`);
    console.log(`- Vehicles:          /api/vehicles`);
    console.log(`- Assignments:       /api/assignments`);
    console.log(`- Compliance:        /api/compliance`);
    console.log(`- Driver APIs:       /api/driver`);
    console.log(`- Service Center:    /api/service-center`);
    console.log(`- Admin APIs:        /api/admin`);
    console.log(`- Audit Logs:        /api/audit-logs`);
    console.log(`- Notifications:     /api/notifications`);
    console.log(`====================================================`);
  });
}

startServer();

module.exports = app;
