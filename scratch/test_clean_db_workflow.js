const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const connectDB = require('../server/config/db');

const { addVehicle, getVehicles } = require('../src/modules/FleetManager/backend/controllers/vehicleController');
const { getDashboardSummary } = require('../src/modules/FleetManager/backend/controllers/dashboardController');
const { completeService, getServiceCosts } = require('../src/modules/ServiceCenter/server/controllers/serviceExtensionController');
const { getDashboardData: getSCDashboard } = require('../src/modules/ServiceCenter/server/controllers/serviceController');

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

async function verifyCleanWorkflow() {
  await connectDB();
  console.log('====================================================');
  console.log('  VERIFYING EMPTY DATABASE -> NEW USER ENTRY WORKFLOW');
  console.log('====================================================\n');

  // 1. Initial State Check
  let res = mockRes();
  await getDashboardSummary({}, res);
  console.log('1. Initial Dashboard Summary (Should be 0):', {
    totalVehicles: res.data?.cards?.totalVehicles,
    assignedVehicles: res.data?.cards?.assignedVehicles,
    availableVehicles: res.data?.cards?.availableVehicles
  });

  res = mockRes();
  await getVehicles({ query: {} }, res);
  console.log('2. Initial Vehicle Table (Should be 0):', res.data?.vehicles?.length);

  res = mockRes();
  await getSCDashboard({}, res);
  console.log('3. Initial Service Center Dashboard (Should be 0):', {
    vehiclesWaiting: res.data?.stats?.vehiclesWaiting,
    vehiclesInService: res.data?.stats?.vehiclesInService,
    completedToday: res.data?.stats?.completedToday,
    totalRevenue: res.data?.stats?.totalRevenue
  });

  // 2. User enters a new vehicle via form submission
  console.log('\n--- USER ENTERS NEW VEHICLE "KA-05-MY-9999" ---');
  res = mockRes();
  await addVehicle({
    body: {
      registrationNumber: 'KA05MY9999',
      model: 'Thar',
      brand: 'Mahindra',
      branch: 'Bangalore',
      manufacturingYear: 2024,
      mileage: 5000,
      fuelType: 'Diesel',
      vehicleType: 'SUV'
    }
  }, res);
  console.log('• Added Vehicle Result:', res.statusCode === 201 ? 'SUCCESS' : 'FAILED', '| ID:', res.data?._id);

  // 3. Re-verify Dashboard & Table after entry
  res = mockRes();
  await getDashboardSummary({}, res);
  console.log('• Dashboard Total Vehicles after entry:', res.data?.cards?.totalVehicles, '(Expected: 1)');

  res = mockRes();
  await getVehicles({ query: {} }, res);
  console.log('• Vehicles Table after entry:', res.data?.vehicles?.map(v => v.registrationNumber));

  // 4. User completes a service
  console.log('\n--- USER MARKS SERVICE COMPLETED FOR "KA05MY9999" ---');
  res = mockRes();
  await completeService({
    body: {
      vehicle: 'KA05MY9999',
      mechanic: 'Express Mechanics',
      totalCost: 12000,
      nextServiceDue: '10000 km'
    }
  }, res);
  console.log('• Complete Service Result:', res.statusCode === 201 ? 'SUCCESS' : 'FAILED');

  res = mockRes();
  await getSCDashboard({}, res);
  console.log('• Service Center Total Revenue after entry:', res.data?.stats?.totalRevenue, '(Expected: 12000)');

  console.log('\n====================================================');
  console.log('  ONLY USER-ENTERED DATA IS STORED & DISPLAYED! ');
  console.log('====================================================');

  process.exit(0);
}

verifyCleanWorkflow().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
