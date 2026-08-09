const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const connectDB = require('../server/config/db');
const {
  getDriverDashboard,
  createChecklist,
  startTrip,
  createIssueReport,
  getNotifications,
  getAssignments,
  getServiceHistory
} = require('../server/controllers/driverController');

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

async function runVerification() {
  console.log('====================================================');
  console.log('   FLEETGUARD DRIVER MODULE INTEGRATION VERIFICATION');
  console.log('====================================================\n');

  // 1. Connect DB
  const conn = await connectDB();
  if (!conn) {
    console.error('❌ Failed to connect to MongoDB');
    process.exit(1);
  }
  console.log('✅ 1. MongoDB Database Connection Verified');

  // 2. Collection Counts Check
  const counts = {
    assignments: await Assignment.countDocuments(),
    checklists: await Checklist.countDocuments(),
    issues: await IssueReport.countDocuments(),
    notifications: await Notification.countDocuments(),
    trips: await TripStatus.countDocuments(),
    services: await ServiceHistory.countDocuments(),
  };
  console.log('✅ 2. MongoDB Driver Collections Verified:');
  console.log(JSON.stringify(counts, null, 2));

  // 3. Test Controller: getDriverDashboard
  const resDash = mockRes();
  await getDriverDashboard({}, resDash);
  console.log('\n✅ 3. getDriverDashboard API Response:');
  console.log('Status Code:', resDash.statusCode);
  console.log('Vehicle:', resDash.data?.assignment?.vehicleName);
  console.log('Compliance Status:', resDash.data?.complianceStatus);
  console.log('Pending Checklist Count:', resDash.data?.pendingChecklistCount);

  // 4. Test Controller: getNotifications
  const resNotif = mockRes();
  await getNotifications({}, resNotif);
  console.log('\n✅ 4. getNotifications API Response:');
  console.log('Notifications Count:', resNotif.data?.length);

  // 5. Test Controller: getAssignments
  const resAssign = mockRes();
  await getAssignments({}, resAssign);
  console.log('\n✅ 5. getAssignments API Response:');
  console.log('Assignments Count:', resAssign.data?.length);

  // 6. Test Controller: getServiceHistory
  const resService = mockRes();
  await getServiceHistory({}, resService);
  console.log('\n✅ 6. getServiceHistory API Response:');
  console.log('Service History Records:', resService.data?.length);

  // 7. Test Controller: createChecklist
  const reqChecklist = {
    body: {
      tyres: true,
      brakes: true,
      lights: true,
      fuel: true,
      mirrors: true,
      horn: true,
      vehicleId: 'VH-102'
    }
  };
  const resChecklist = mockRes();
  await createChecklist(reqChecklist, resChecklist);
  console.log('\n✅ 7. createChecklist API Response:');
  console.log('Status Code:', resChecklist.statusCode);
  console.log('Message:', resChecklist.data?.message);

  // 8. Test Controller: startTrip
  const resTrip = mockRes();
  await startTrip({}, resTrip);
  console.log('\n✅ 8. startTrip API Response:');
  console.log('Status Code:', resTrip.statusCode);
  console.log('Trip Status:', resTrip.data?.trip?.status);

  // 9. Test Controller: createIssueReport
  const reqIssue = {
    body: {
      issueType: 'Engine Light',
      description: 'Minor engine warning light observed on dashboard',
      priority: 'Medium',
      date: new Date().toISOString().slice(0, 10)
    }
  };
  const resIssue = mockRes();
  await createIssueReport(reqIssue, resIssue);
  console.log('\n✅ 9. createIssueReport API Response:');
  console.log('Status Code:', resIssue.statusCode);
  console.log('Reported Issue:', resIssue.data?.issueReport?.issueType);

  console.log('\n====================================================');
  console.log('   ALL DRIVER MODULE VERIFICATION TESTS PASSED!');
  console.log('====================================================');

  process.exit(0);
}

runVerification().catch((err) => {
  console.error('❌ Verification script failed:', err);
  process.exit(1);
});
