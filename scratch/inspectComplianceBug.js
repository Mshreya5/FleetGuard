const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://askdfleet_db_user:CB9iPFuU2gkT0p7A@cluster0.lcwickq.mongodb.net/fleetguard?retryWrites=true&w=majority';

const User = require('../server/models/User');
const Vehicle = require('../server/models/Vehicle');
const Assignment = require('../server/models/Assignment');
const Compliance = require('../server/models/Compliance');
const driverController = require('../server/controllers/driverController');

async function inspectBug() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('--- INSPECTING VEHICLES ---');
    const vehicles = await Vehicle.find({}).lean();
    console.log(`Found ${vehicles.length} vehicles:`);
    for (const v of vehicles) {
      console.log(`Vehicle: ${v.registrationNumber} | _id: ${v._id} | assignedDriver: ${v.assignedDriver} | driverAssigned: ${v.driverAssigned} | complianceStatus: ${v.complianceStatus} | complianceSummary:`, v.complianceSummary, '| insurance:', v.insurance);
    }

    console.log('\n--- INSPECTING ASSIGNMENTS ---');
    const assignments = await Assignment.find({}).lean();
    console.log(`Found ${assignments.length} assignments:`);
    for (const a of assignments) {
      console.log(`Assignment: reg=${a.registrationNumber} | driverId=${a.driverId} | driverName=${a.driverName} | status=${a.status} | complianceStatus=${a.complianceStatus}`);
    }

    console.log('\n--- INSPECTING COMPLIANCE DOCUMENTS ---');
    const docs = await Compliance.find({}).lean();
    console.log(`Found ${docs.length} compliance docs:`);
    for (const d of docs) {
      console.log(`ComplianceDoc: reg=${d.registrationNumber} | vehicleId=${d.vehicleId} | type=${d.documentType} | expiryDate=${d.expiryDate} | status=${d.status}`);
    }

    // Let's test a driver query if any driver exists
    const drivers = await User.find({ role: 'Driver' }).lean();
    console.log(`\nFound ${drivers.length} drivers:`);
    for (const dr of drivers) {
      console.log(`Driver: ${dr.name} | _id: ${dr._id} | email: ${dr.email} | assignedVehicle: ${dr.assignedVehicle}`);
      
      // Test payload built for driver
      const req = { user: { id: dr._id, _id: dr._id, name: dr.name, email: dr.email, role: 'Driver' } };
      let payload = null;
      try {
        const buildDriverPayload = driverController.buildDriverPayload || (async () => {});
        // Since buildDriverPayload is not exported directly, let's call getDriverDashboard mock
        let resCode = 200;
        const resMock = {
          json: (data) => { payload = data; },
          status: (code) => { resCode = code; return resMock; }
        };
        await driverController.getDriverDashboard(req, resMock);
        console.log(`  DriverDashboard Payload for ${dr.name}:`);
        console.log('    assignment:', payload?.assignment);
        console.log('    complianceStatus:', payload?.complianceStatus);
        console.log('    insuranceExpiry property check:');
        console.log('      payload?.assignment?.insuranceExpiry:', payload?.assignment?.insuranceExpiry);
      } catch (e) {
        console.error('  Error fetching driver payload:', e.message);
      }
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Inspection error:', err);
  }
}

inspectBug();
