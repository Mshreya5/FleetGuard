const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../src/modules/FleetManager/backend/.env') });

const connectDB = require('./config/db');

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

async function seedDatabase() {
  try {
    await connectDB();
    console.log('[FleetGuard Seed] Starting database seeding...');

    // Clear existing data
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
      ServiceLog.deleteMany({})
    ]);

    // 1. Seed Vehicles
    const vehiclesData = [
      {
        registrationNumber: 'KA01AB1234',
        model: 'XUV700',
        brand: 'Mahindra',
        branch: 'Bangalore',
        manufacturingYear: 2022,
        mileage: 14200,
        driverAssigned: 'Ravi Kumar',
        assignedDriver: 'Ravi Kumar',
        fleetManager: 'Anita Rao',
        maintenanceStatus: 'Operational',
        status: 'Assigned',
        fuelType: 'Diesel',
        vehicleType: 'Truck',
        insurance: { status: 'Valid', expiryDate: new Date('2026-10-10') },
        pollution: { status: 'Valid', expiryDate: new Date('2026-09-05') },
        fitness: { status: 'Valid', expiryDate: new Date('2026-11-20') },
        complianceSummary: {
          insuranceStatus: 'Valid', insuranceExpiry: new Date('2026-10-10'),
          pollutionStatus: 'Valid', pollutionExpiry: new Date('2026-09-05'),
          fitnessStatus: 'Valid', fitnessExpiry: new Date('2026-11-20'),
          overallStatus: 'Valid'
        }
      },
      {
        registrationNumber: 'TN09CD7788',
        model: 'Ecosport',
        brand: 'Ford',
        branch: 'Chennai',
        manufacturingYear: 2020,
        mileage: 28500,
        driverAssigned: 'Suresh B',
        assignedDriver: 'Suresh B',
        fleetManager: 'Madhavan',
        maintenanceStatus: 'Service Due',
        status: 'Available',
        fuelType: 'Petrol',
        vehicleType: 'Van',
        insurance: { status: 'Expired', expiryDate: new Date('2025-06-01') },
        pollution: { status: 'Valid', expiryDate: new Date('2026-08-12') },
        fitness: { status: 'Valid', expiryDate: new Date('2026-07-30') },
        complianceSummary: {
          insuranceStatus: 'Expired', insuranceExpiry: new Date('2025-06-01'),
          pollutionStatus: 'Valid', pollutionExpiry: new Date('2026-08-12'),
          fitnessStatus: 'Valid', fitnessExpiry: new Date('2026-07-30'),
          overallStatus: 'Expired'
        }
      },
      {
        registrationNumber: 'MH12XY4567',
        model: 'City',
        brand: 'Honda',
        branch: 'Mumbai',
        manufacturingYear: 2021,
        mileage: 36400,
        driverAssigned: 'Pooja N',
        assignedDriver: 'Pooja N',
        fleetManager: 'Kiran Shah',
        maintenanceStatus: 'Under Maintenance',
        status: 'Under Service',
        fuelType: 'Diesel',
        vehicleType: 'Sedan',
        insurance: { status: 'Valid', expiryDate: new Date('2026-12-01') },
        pollution: { status: 'Expiring Soon', expiryDate: new Date('2026-08-10') },
        fitness: { status: 'Valid', expiryDate: new Date('2026-10-15') },
        complianceSummary: {
          insuranceStatus: 'Valid', insuranceExpiry: new Date('2026-12-01'),
          pollutionStatus: 'Expiring Soon', pollutionExpiry: new Date('2026-08-10'),
          fitnessStatus: 'Valid', fitnessExpiry: new Date('2026-10-15'),
          overallStatus: 'Expiring Soon'
        }
      },
      {
        registrationNumber: 'KL07EF2345',
        model: 'Swift',
        brand: 'Maruti',
        branch: 'Kochi',
        manufacturingYear: 2019,
        mileage: 43900,
        driverAssigned: 'Arun Das',
        assignedDriver: 'Arun Das',
        fleetManager: 'Nisha Menon',
        maintenanceStatus: 'Operational',
        status: 'Assigned',
        fuelType: 'Petrol',
        vehicleType: 'Sedan',
        insurance: { status: 'Valid', expiryDate: new Date('2026-08-20') },
        pollution: { status: 'Valid', expiryDate: new Date('2026-09-18') },
        fitness: { status: 'Expired', expiryDate: new Date('2025-07-01') },
        complianceSummary: {
          insuranceStatus: 'Valid', insuranceExpiry: new Date('2026-08-20'),
          pollutionStatus: 'Valid', pollutionExpiry: new Date('2026-09-18'),
          fitnessStatus: 'Expired', fitnessExpiry: new Date('2025-07-01'),
          overallStatus: 'Expired'
        }
      },
      {
        registrationNumber: 'AP05GH9988',
        model: 'S-Cross',
        brand: 'Maruti',
        branch: 'Hyderabad',
        manufacturingYear: 2023,
        mileage: 15400,
        driverAssigned: 'Neeraj',
        assignedDriver: 'Neeraj',
        fleetManager: 'Sajid Khan',
        maintenanceStatus: 'Operational',
        status: 'Available',
        fuelType: 'Diesel',
        vehicleType: 'SUV',
        insurance: { status: 'Expiring Soon', expiryDate: new Date('2026-08-15') },
        pollution: { status: 'Valid', expiryDate: new Date('2026-12-09') },
        fitness: { status: 'Valid', expiryDate: new Date('2027-01-10') },
        complianceSummary: {
          insuranceStatus: 'Expiring Soon', insuranceExpiry: new Date('2026-08-15'),
          pollutionStatus: 'Valid', pollutionExpiry: new Date('2026-12-09'),
          fitnessStatus: 'Valid', fitnessExpiry: new Date('2027-01-10'),
          overallStatus: 'Expiring Soon'
        }
      }
    ];

    const insertedVehicles = await Vehicle.insertMany(vehiclesData);
    console.log(`[FleetGuard Seed] Created ${insertedVehicles.length} vehicles.`);

    // 2. Seed Users
    const hashedPassword = await bcrypt.hash('Fleet@1234', 10);
    const usersData = [
      { name: 'Admin User', email: 'admin@fleetguard.com', password: hashedPassword, role: 'Admin', branch: 'Head Office', phone: '9000000001', status: 'Active' },
      { name: 'Anita Rao', email: 'anita@fleetguard.com', password: hashedPassword, role: 'Fleet Manager', branch: 'Bangalore', phone: '9000000002', status: 'Active' },
      { name: 'Ravi Kumar', email: 'ravi@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Bangalore', phone: '9000000005', status: 'Active' },
      { name: 'SpeedFix Center', email: 'speedfix@fleetguard.com', password: hashedPassword, role: 'Service Center', branch: 'Bangalore', phone: '9000000017', status: 'Active' }
    ];
    await User.insertMany(usersData);
    console.log('[FleetGuard Seed] Created initial users.');

    // 3. Seed Compliances & Assignments
    const compliancesData = [
      {
        vehicleId: insertedVehicles[0]._id,
        registrationNumber: insertedVehicles[0].registrationNumber,
        documentType: 'Insurance',
        filename: 'insurance_ka01ab1234.pdf',
        originalName: 'Insurance_Policy.pdf',
        filePath: '/uploads/insurance_ka01ab1234.pdf',
        issueDate: new Date('2025-10-10'),
        expiryDate: new Date('2026-10-10'),
        status: 'Valid'
      },
      {
        vehicleId: insertedVehicles[1]._id,
        registrationNumber: insertedVehicles[1].registrationNumber,
        documentType: 'Insurance',
        filename: 'insurance_tn09cd7788.pdf',
        originalName: 'Insurance_Policy_Expired.pdf',
        filePath: '/uploads/insurance_tn09cd7788.pdf',
        issueDate: new Date('2024-06-01'),
        expiryDate: new Date('2025-06-01'),
        status: 'Expired'
      }
    ];
    await Compliance.insertMany(compliancesData);

    const assignmentsData = [
      {
        vehicleId: insertedVehicles[0]._id,
        registrationNumber: insertedVehicles[0].registrationNumber,
        driverName: 'Ravi Kumar',
        assignedDate: new Date('2025-01-15'),
        status: 'Active',
        notes: 'Assigned to North Logistics Route'
      }
    ];
    await Assignment.insertMany(assignmentsData);

    // 4. Seed Service Center Operations
    const serviceQueueData = [
      {
        vehicleNumber: 'MH12XY4567',
        ownerBranch: 'Mumbai',
        vehicleModel: 'Honda City',
        currentMileage: 36400,
        issue: 'Engine Oil Flush and Brake Pad Inspection',
        serviceType: 'Routine Maintenance',
        priority: 'High',
        status: 'In Progress',
        estimatedCost: 8500
      },
      {
        vehicleNumber: 'TN09CD7788',
        ownerBranch: 'Chennai',
        vehicleModel: 'Ford Ecosport',
        currentMileage: 28500,
        issue: 'Suspension Noise & Air Filter Change',
        serviceType: 'Inspection & Repair',
        priority: 'Medium',
        status: 'Waiting',
        estimatedCost: 4500
      }
    ];
    await ServiceQueue.insertMany(serviceQueueData);

    const serviceHistoryData = [
      {
        vehicle: 'KA01AB1234',
        mechanic: 'SpeedFix Mechanics',
        cost: 3500,
        status: 'Completed',
        description: 'Replaced engine oil filter and topped up fluids'
      }
    ];
    await ServiceHistory.insertMany(serviceHistoryData);

    console.log('[FleetGuard Seed] ✅ Database successfully seeded with rich initial data!');
    process.exit(0);
  } catch (error) {
    console.error('[FleetGuard Seed Error]:', error);
    process.exit(1);
  }
}

seedDatabase();
