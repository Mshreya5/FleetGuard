const path = require('path');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const connectDB = require('../server/config/db');

// Models
const Vehicle = require('../src/modules/Admin/backend/src/models/Vehicle');
const User = require('../src/modules/Admin/backend/src/models/User');
const Maintenance = require('../src/modules/Admin/backend/src/models/Maintenance');
const Notification = require('../src/modules/Admin/backend/src/models/Notification');
const OverrideLog = require('../src/modules/Admin/backend/src/models/OverrideLog');
const Compliance = require('../src/modules/FleetManager/backend/models/Compliance');
const Assignment = require('../src/modules/FleetManager/backend/models/Assignment');

const ServiceQueue = require('../src/modules/ServiceCenter/server/models/ServiceQueue');
const ServiceHistory = require('../src/modules/ServiceCenter/server/models/ServiceHistory');
const ServiceCost = require('../src/modules/ServiceCenter/server/models/ServiceCost');
const HistoricalRecord = require('../src/modules/ServiceCenter/server/models/HistoricalRecord');
const ServiceLog = require('../src/modules/ServiceCenter/server/models/ServiceLog');
const VehicleMileage = require('../src/modules/ServiceCenter/server/models/VehicleMileage');
const ServiceSchedule = require('../src/modules/ServiceCenter/server/models/ServiceSchedule');

const Checklist = require('../server/models/Checklist');
const IssueReport = require('../server/models/IssueReport');
const TripStatus = require('../server/models/TripStatus');

async function wipeDatabase() {
  try {
    await connectDB();
    console.log('====================================================');
    console.log('  WIPING ALL SAMPLE / DUMMY DATA FROM MONGODB...');
    console.log('====================================================\n');

    await Promise.all([
      Vehicle.deleteMany({}),
      User.deleteMany({}),
      Maintenance.deleteMany({}),
      Notification.deleteMany({}),
      OverrideLog.deleteMany({}),
      Compliance.deleteMany({}),
      Assignment.deleteMany({}),
      ServiceQueue.deleteMany({}),
      ServiceHistory.deleteMany({}),
      ServiceCost.deleteMany({}),
      HistoricalRecord.deleteMany({}),
      ServiceLog.deleteMany({}),
      VehicleMileage.deleteMany({}),
      ServiceSchedule.deleteMany({}),
      Checklist.deleteMany({}),
      IssueReport.deleteMany({}),
      TripStatus.deleteMany({})
    ]);

    console.log('✅ All collections successfully cleared.');

    // Seed standard login accounts so users can log in to test forms
    const hashedPassword = await bcrypt.hash('Fleet@1234', 10);
    const standardUsers = [
      { name: 'Admin User', email: 'admin@fleetguard.com', password: hashedPassword, role: 'Admin', branch: 'Head Office', phone: '9000000001', status: 'Active' },
      { name: 'Anita Rao', email: 'anita@fleetguard.com', password: hashedPassword, role: 'Fleet Manager', branch: 'Bangalore', phone: '9000000002', status: 'Active' },
      { name: 'Ravi Kumar', email: 'ravi@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Bangalore', phone: '9000000005', status: 'Active' },
      { name: 'SpeedFix Center', email: 'speedfix@fleetguard.com', password: hashedPassword, role: 'Service Center', branch: 'Bangalore', phone: '9000000017', status: 'Active' }
    ];

    await User.insertMany(standardUsers);
    console.log('✅ Created 4 standard authentication login accounts (Admin, Fleet Manager, Driver, Service Center).\n');
    console.log('====================================================');
    console.log('  DATABASE WIPE COMPLETE - 0 DUMMY DATA REMAINING! ');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Wipe failed:', error);
    process.exit(1);
  }
}

wipeDatabase();
