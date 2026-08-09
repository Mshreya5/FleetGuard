const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://askdfleet_db_user:CB9iPFuU2gkT0p7A@cluster0.lcwickq.mongodb.net/fleetguard?retryWrites=true&w=majority';

// Load models
const User = require('../server/models/User');
const Vehicle = require('../server/models/Vehicle');
const Assignment = require('../server/models/Assignment');
const Compliance = require('../server/models/Compliance');
const IssueReport = require('../server/models/IssueReport');
const ServiceQueue = require('../server/models/ServiceQueue');
const ServiceHistory = require('../server/models/ServiceHistory');
const Notification = require('../server/models/Notification');
const AuditLog = require('../server/models/AuditLog');

async function testWorkflow() {
  console.log('====================================================');
  console.log('STARTING REAL END-TO-END FLEETGUARD WORKFLOW TEST');
  console.log('====================================================');

  try {
    await mongoose.connect(MONGO_URI);
    console.log('1. MongoDB Connected Successfully.');

    // Step 1: Create / Verify Real Test User (Driver)
    const testDriverEmail = `driver_e2e_${Date.now()}@fleetguard.com`;
    const driverUser = new User({
      name: 'John E2E Driver',
      email: testDriverEmail,
      password: 'Password123!',
      role: 'Driver',
      status: 'Active',
    });
    await driverUser.save();
    console.log(`2. Driver User Created in MongoDB: ${driverUser.name} (${driverUser.email})`);

    // Step 2: Create / Verify Real Test Vehicle (Fleet Manager)
    const testReg = `KA19E2E${Math.floor(1000 + Math.random() * 9000)}`;
    const testVehicle = new Vehicle({
      registrationNumber: testReg,
      model: 'Bolero Maxi',
      brand: 'Mahindra',
      branch: 'Bangalore East',
      manufacturingYear: 2023,
      mileage: 45000,
      fuelType: 'Diesel',
      vehicleType: 'Truck',
      status: 'Available',
      assignedDriver: 'Unassigned',
      insurance: { status: 'Valid', expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      pollution: { status: 'Valid', expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      fitness: { status: 'Valid', expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
    });
    await testVehicle.save();
    console.log(`3. Vehicle Registered in MongoDB: ${testVehicle.registrationNumber}`);

    // Step 3: Assign Vehicle to Driver
    const assignment = new Assignment({
      vehicleId: testVehicle._id,
      registrationNumber: testVehicle.registrationNumber,
      driverId: driverUser._id,
      driverName: driverUser.name,
      assignedDate: new Date(),
      status: 'Active',
      assignedBy: 'Fleet Manager E2E',
    });
    await assignment.save();

    testVehicle.status = 'Assigned';
    testVehicle.driverAssigned = driverUser.name;
    testVehicle.assignedDriver = driverUser.name;
    testVehicle.assignedDriverId = driverUser._id;
    await testVehicle.save();
    console.log(`4. Vehicle ${testVehicle.registrationNumber} Assigned to Driver ${driverUser.name}`);

    // Step 4: Driver Reports Vehicle Issue
    const mockDriverReq = {
      user: { id: driverUser._id, name: driverUser.name, email: driverUser.email, role: 'Driver' },
      body: {
        issueType: 'Engine Warning Light',
        description: 'Engine temperature gauge spikes under acceleration.',
        priority: 'High',
        date: new Date().toISOString().slice(0, 10),
      }
    };

    const driverController = require('../server/controllers/driverController');
    let issueResponseData = null;
    let issueResponseStatus = null;

    const mockRes = {
      status: (code) => {
        issueResponseStatus = code;
        return {
          json: (data) => {
            issueResponseData = data;
          }
        };
      },
      json: (data) => {
        issueResponseData = data;
      }
    };

    await driverController.createIssueReport(mockDriverReq, mockRes);
    console.log(`5. Driver Issue Report API Executed. HTTP Code: ${issueResponseStatus}`);
    console.log('   API Response:', JSON.stringify(issueResponseData));

    // Step 5: Verify ServiceQueue document in MongoDB
    const queueItem = await ServiceQueue.findOne({ vehicleNumber: testReg, status: 'Waiting' });
    if (!queueItem) {
      throw new Error('FAIL: ServiceQueue item was NOT found in MongoDB!');
    }
    console.log(`6. SUCCESS: ServiceQueue Document Found in MongoDB! ID: ${queueItem._id}`);
    console.log(`   Issue: ${queueItem.issue} | Status: ${queueItem.status} | Priority: ${queueItem.priority}`);

    // Verify Vehicle status in MongoDB
    const updatedVehicle = await Vehicle.findById(testVehicle._id);
    console.log(`7. Vehicle Maintenance Status in MongoDB: ${updatedVehicle.maintenanceStatus} | Operational Status: ${updatedVehicle.status}`);
    if (updatedVehicle.maintenanceStatus !== 'Under Maintenance') {
      throw new Error('FAIL: Vehicle maintenanceStatus was not updated to Under Maintenance!');
    }

    // Step 6: Service Center Processes Queue & Completes Service
    const serviceController = require('../server/controllers/serviceController');
    let completeResponseData = null;
    let completeResponseStatus = null;

    const mockCompleteReq = {
      params: { id: queueItem._id },
      body: {
        cost: 2500,
        notes: 'Replaced radiator coolant hose and refilled synthetic coolant.',
        technician: 'SpeedFix Master Mechanic',
        updatedMileage: 45200,
      },
      user: { name: 'Service Center Specialist', role: 'Service Center' }
    };

    const mockCompleteRes = {
      status: (code) => {
        completeResponseStatus = code;
        return {
          json: (data) => { completeResponseData = data; }
        };
      },
      json: (data) => { completeResponseData = data; }
    };

    await serviceController.completeService(mockCompleteReq, mockCompleteRes);
    console.log(`8. Service Completion API Executed. HTTP Code: ${completeResponseStatus}`);
    console.log('   Completion Response:', JSON.stringify(completeResponseData));

    // Step 7: Verify ServiceHistory in MongoDB
    const historyDoc = await ServiceHistory.findOne({ vehicle: testReg }).sort({ performedDate: -1 });
    if (!historyDoc) {
      throw new Error('FAIL: ServiceHistory document was NOT created in MongoDB!');
    }
    console.log(`9. SUCCESS: ServiceHistory Document Found in MongoDB! Cost: $${historyDoc.cost} | Mileage: ${historyDoc.mileageAtService} km`);

    // Verify Vehicle status returned to Operational
    const finalVehicle = await Vehicle.findById(testVehicle._id);
    console.log(`10. Final Vehicle Status in MongoDB: Maintenance=${finalVehicle.maintenanceStatus} | Status=${finalVehicle.status} | Mileage=${finalVehicle.mileage}`);
    if (finalVehicle.maintenanceStatus !== 'Operational') {
      throw new Error('FAIL: Vehicle maintenanceStatus was not reset to Operational!');
    }

    console.log('====================================================');
    console.log('🎉 REAL END-TO-END WORKFLOW VERIFICATION PASSED 100%');
    console.log('====================================================');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ E2E VERIFICATION ERROR:', err);
    process.exit(1);
  }
}

testWorkflow();
