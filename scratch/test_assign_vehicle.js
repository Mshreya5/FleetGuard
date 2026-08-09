const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const connectDB = require('../server/config/db');
const { assignVehicle, getAssignments } = require('../src/modules/FleetManager/backend/controllers/assignmentController');
const Vehicle = require('../src/modules/Admin/backend/src/models/Vehicle');

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

async function testAssignment() {
  await connectDB();
  console.log('Connected to DB');

  // Find an available vehicle
  let vehicle = await Vehicle.findOne({ status: 'Available' });
  if (!vehicle) {
    vehicle = await Vehicle.create({
      registrationNumber: 'KA-01-TEST-' + Math.floor(Math.random() * 1000),
      model: 'Thar',
      brand: 'Mahindra',
      branch: 'Bangalore',
      manufacturingYear: 2023,
      status: 'Available'
    });
  }

  console.log('Using vehicle:', vehicle.registrationNumber, '| ID:', vehicle._id);

  // Assign vehicle
  const reqAssign = {
    body: {
      vehicleId: vehicle._id.toString(),
      driverName: 'Ravi Kumar',
      notes: 'Assigned test route'
    }
  };
  const resAssign = mockRes();
  await assignVehicle(reqAssign, resAssign);
  console.log('assignVehicle response status:', resAssign.statusCode);
  console.log('assignVehicle response body:', JSON.stringify(resAssign.data, null, 2));

  // Get assignments
  const resGet = mockRes();
  await getAssignments({}, resGet);
  console.log('\ngetAssignments response count:', resGet.data?.length);
  console.log('First Assignment:', JSON.stringify(resGet.data?.[0], null, 2));

  process.exit(0);
}

testAssignment().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
