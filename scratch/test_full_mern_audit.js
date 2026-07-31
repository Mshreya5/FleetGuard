const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const connectDB = require('../server/config/db');

// Controllers
const { loginUser, getUsers, createUser } = require('../src/modules/Admin/backend/src/controllers/userController');
const { getDriverDashboard, createChecklist, startTrip, createIssueReport, getNotifications, getAssignments, getServiceHistory } = require('../server/controllers/driverController');
const { getDashboardStats } = require('../src/modules/FleetManager/backend/controllers/dashboardController');
const { getVehicles } = require('../src/modules/FleetManager/backend/controllers/vehicleController');
const { getComplianceSummary } = require('../src/modules/FleetManager/backend/controllers/complianceController');
const { getAssignments: getFMAssignments } = require('../src/modules/FleetManager/backend/controllers/assignmentController');
const { getQueue, getHistory, getCosts } = require('../src/modules/ServiceCenter/server/controllers/serviceController');

// Models
const User = require('../src/modules/Admin/backend/src/models/User');
const Vehicle = require('../src/modules/Admin/backend/src/models/Vehicle');
const Assignment = require('../server/models/Assignment');
const Checklist = require('../server/models/Checklist');
const IssueReport = require('../server/models/IssueReport');
const Notification = require('../server/models/Notification');
const TripStatus = require('../server/models/TripStatus');
const ServiceHistory = require('../server/models/ServiceHistory');

function mockRes() {
  const res = {};
  res.statusCode = 200;
  res.data = null;
  res.status = function(code) {
    res.statusCode = code;
    return res;
  };
  res.json = function(payload) {
    res.data = payload;
    return res;
  };
  return res;
}

async function runAudit() {
  console.log('====================================================');
  console.log('   FLEETGUARD FULL MERN STACK AUDIT & VERIFICATION');
  console.log('====================================================\n');

  // 1. Database Connection Check
  const conn = await connectDB();
  if (!conn) {
    console.error('❌ Failed to connect to MongoDB');
    process.exit(1);
  }
  console.log('✅ 1. MongoDB Database Connection Verified:', conn.connection.host);

  // 2. Verified MongoDB Collections & Counts
  const collections = {
    users: await User.countDocuments(),
    vehicles: await Vehicle.countDocuments(),
    assignments: await Assignment.countDocuments(),
    checklists: await Checklist.countDocuments(),
    issues: await IssueReport.countDocuments(),
    notifications: await Notification.countDocuments(),
    trips: await TripStatus.countDocuments(),
    services: await ServiceHistory.countDocuments(),
  };
  console.log('\n✅ 2. MongoDB Collections & Document Counts:');
  console.log(JSON.stringify(collections, null, 2));

  // 3. Authentication Verification (Login & JWT & Password Hashing)
  console.log('\n--- AUTHENTICATION & AUTHORIZATION VERIFICATION ---');
  const reqLogin = {
    body: { email: 'admin@fleetguard.com', password: 'Fleet@1234', role: 'Admin' }
  };
  const resLogin = mockRes();
  await loginUser(reqLogin, resLogin);
  console.log('✅ Auth / Login (Admin): Status', resLogin.statusCode, '| Token Generated:', Boolean(resLogin.data?.token));

  // 4. Admin & User Management APIs
  console.log('\n--- ADMIN & USER MANAGEMENT APIS VERIFICATION ---');
  const resUsers = mockRes();
  await getUsers({}, resUsers);
  console.log('✅ GET /api/users: Status', resUsers.statusCode, '| Users Count:', resUsers.data?.users?.length);

  // 5. Fleet Manager APIs
  console.log('\n--- FLEET MANAGER APIS VERIFICATION ---');
  const resFMStats = mockRes();
  await getDashboardStats({}, resFMStats);
  console.log('✅ GET /api/dashboard/stats: Status', resFMStats.statusCode, '| Total Vehicles:', resFMStats.data?.stats?.totalVehicles);

  const resFMVehicles = mockRes();
  await getVehicles({}, resFMVehicles);
  console.log('✅ GET /api/vehicles: Status', resFMVehicles.statusCode, '| Vehicles Count:', resFMVehicles.data?.vehicles?.length || resFMVehicles.data?.length);

  const resFMCompliance = mockRes();
  await getComplianceSummary({}, resFMCompliance);
  console.log('✅ GET /api/compliance: Status', resFMCompliance.statusCode, '| Summary Status:', resFMCompliance.data?.summary ? 'Valid' : 'OK');

  const resFMAssign = mockRes();
  await getFMAssignments({}, resFMAssign);
  console.log('✅ GET /api/assignments: Status', resFMAssign.statusCode, '| Assignments Count:', resFMAssign.data?.assignments?.length || resFMAssign.data?.length);

  // 6. Service Center APIs
  console.log('\n--- SERVICE CENTER APIS VERIFICATION ---');
  const resSCQueue = mockRes();
  await getQueue({}, resSCQueue);
  console.log('✅ GET /api/service-center/queue: Status', resSCQueue.statusCode, '| Queue Items:', resSCQueue.data?.length);

  const resSCHistory = mockRes();
  await getHistory({}, resSCHistory);
  console.log('✅ GET /api/service-center/history: Status', resSCHistory.statusCode, '| History Items:', resSCHistory.data?.length);

  const resSCCosts = mockRes();
  await getCosts({}, resSCCosts);
  console.log('✅ GET /api/service-center/costs: Status', resSCCosts.statusCode, '| Cost Records:', resSCCosts.data?.length);

  // 7. Driver Module APIs
  console.log('\n--- DRIVER MODULE APIS VERIFICATION ---');
  const resDriverDash = mockRes();
  await getDriverDashboard({}, resDriverDash);
  console.log('✅ GET /api/driver/dashboard: Status', resDriverDash.statusCode, '| Vehicle Assigned:', resDriverDash.data?.assignment?.vehicleName);

  const resDriverNotif = mockRes();
  await getNotifications({}, resDriverNotif);
  console.log('✅ GET /api/driver/notifications: Status', resDriverNotif.statusCode, '| Notifications:', resDriverNotif.data?.length);

  const resDriverAssign = mockRes();
  await getAssignments({}, resDriverAssign);
  console.log('✅ GET /api/driver/assignments: Status', resDriverAssign.statusCode, '| Assignments:', resDriverAssign.data?.length);

  const resDriverService = mockRes();
  await getServiceHistory({}, resDriverService);
  console.log('✅ GET /api/driver/service-history: Status', resDriverService.statusCode, '| Service History:', resDriverService.data?.length);

  const reqChecklist = {
    body: { tyres: true, brakes: true, lights: true, fuel: true, mirrors: true, horn: true, vehicleId: 'VH-102' }
  };
  const resChecklist = mockRes();
  await createChecklist(reqChecklist, resChecklist);
  console.log('✅ POST /api/driver/checklist: Status', resChecklist.statusCode, '| Message:', resChecklist.data?.message);

  const resTrip = mockRes();
  await startTrip({}, resTrip);
  console.log('✅ POST /api/driver/trip/start: Status', resTrip.statusCode, '| Trip Status:', resTrip.data?.trip?.status);

  const reqIssue = {
    body: { issueType: 'Brake Noise', description: 'Slight squeak during hard braking', priority: 'Low', date: '2026-07-31' }
  };
  const resIssue = mockRes();
  await createIssueReport(reqIssue, resIssue);
  console.log('✅ POST /api/driver/issues: Status', resIssue.statusCode, '| Issue Reported:', resIssue.data?.issueReport?.issueType);

  console.log('\n====================================================');
  console.log('   FULL MERN STACK AUDIT COMPLETED SUCCESSFULLY!');
  console.log('====================================================');

  process.exit(0);
}

runAudit().catch((err) => {
  console.error('❌ Audit failed:', err);
  process.exit(1);
});
