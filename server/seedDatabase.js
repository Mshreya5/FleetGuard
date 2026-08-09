const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../src/modules/FleetManager/backend/.env') });

const connectDB = require('./config/db');

// Unified Models
const Vehicle = require('./models/Vehicle');
const User = require('./models/User');
const Compliance = require('./models/Compliance');
const Assignment = require('./models/Assignment');
const ServiceQueue = require('./models/ServiceQueue');
const ServiceHistory = require('./models/ServiceHistory');
const Notification = require('./models/Notification');
const OverrideLog = require('./models/OverrideLog');
const AuditLog = require('./models/AuditLog');

async function seedDatabase() {
  try {
    await connectDB();
    console.log('[FleetGuard Seed] Starting database seeding...');

    // Clear existing data across collections
    await Promise.all([
      Vehicle.deleteMany({}),
      User.deleteMany({}),
      Compliance.deleteMany({}),
      Assignment.deleteMany({}),
      ServiceQueue.deleteMany({}),
      ServiceHistory.deleteMany({}),
      Notification.deleteMany({}),
      OverrideLog.deleteMany({}),
      AuditLog.deleteMany({}),
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
        vin: 'MAH12345678901234',
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
        vin: 'FOR98765432109876',
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
        vin: 'HON45678901234567',
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
        vin: 'MAR23456789012345',
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
        vin: 'MAR99887766554433',
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
      { name: 'Ravi Kumar', email: 'ravi@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Bangalore', phone: '9000000005', licenseNumber: 'KA0120220001111', status: 'Active', assignedVehicle: 'KA01AB1234' },
      { name: 'SpeedFix Center', email: 'speedfix@fleetguard.com', password: hashedPassword, role: 'Service Center', branch: 'Bangalore', phone: '9000000017', status: 'Active' }
    ];
    const insertedUsers = await User.insertMany(usersData);
    console.log(`[FleetGuard Seed] Created ${insertedUsers.length} users.`);

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
        driverId: insertedUsers[2]._id,
        driverName: 'Ravi Kumar',
        assignedDate: new Date('2025-01-15'),
        status: 'Active',
        notes: 'Assigned to North Logistics Route'
      }
    ];
    await Assignment.insertMany(assignmentsData);

    // 4. Seed Service Operations
    const serviceQueueData = [
      {
        vehicleId: insertedVehicles[2]._id,
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
        vehicleId: insertedVehicles[1]._id,
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
        vehicleId: insertedVehicles[0]._id,
        vehicle: 'KA01AB1234',
        vehicleNumber: 'KA01AB1234',
        mechanic: 'SpeedFix Mechanics',
        technician: 'SpeedFix Mechanics',
        cost: 3500,
        status: 'Completed',
        description: 'Replaced engine oil filter and topped up fluids',
        performedDate: new Date('2026-07-20')
      }
    ];
    await ServiceHistory.insertMany(serviceHistoryData);

    // 5. Seed Audit Logs
    const auditLogsData = [
      { id: 'EVT-001', ts: new Date(), user: 'Anita Rao', userEmail: 'anita@fleetguard.com', role: 'Fleet Manager', action: 'Vehicle Registered', module: 'Vehicle Registry', status: 'Success', ip: '192.168.1.20', browser: 'Chrome 126', os: 'Windows 11', prev: 'N/A', next: 'KA01AB1234 added', reason: 'New vehicle onboarding' },
      { id: 'EVT-002', ts: new Date(), user: 'Admin User', userEmail: 'admin@fleetguard.com', role: 'Admin', action: 'User Login', module: 'Authentication', status: 'Success', ip: '192.168.1.10', browser: 'Firefox 127', os: 'Ubuntu 22.04', prev: 'Logged out', next: 'Session started', reason: 'Routine login' },
      { id: 'EVT-003', ts: new Date(), user: 'Ravi Kumar', userEmail: 'ravi@fleetguard.com', role: 'Driver', action: 'Assignment Override Attempt', module: 'Driver Assignment', status: 'Failed', ip: '192.168.1.55', browser: 'Safari 17', os: 'iOS 17', prev: 'Route A', next: 'Route B (blocked)', reason: 'Unauthorized override' },
      { id: 'EVT-004', ts: new Date(), user: 'Anita Rao', userEmail: 'anita@fleetguard.com', role: 'Fleet Manager', action: 'Compliance Updated', module: 'Compliance', status: 'Success', ip: '192.168.1.20', browser: 'Chrome 126', os: 'Windows 11', prev: 'Expired', next: 'Valid till Oct 2026', reason: 'Annual renewal' },
      { id: 'EVT-005', ts: new Date(), user: 'SpeedFix Center', userEmail: 'speedfix@fleetguard.com', role: 'Service Center', action: 'Service Logged', module: 'Maintenance', status: 'Success', ip: '192.168.1.88', browser: 'Edge 126', os: 'Windows 10', prev: 'Pending', next: 'Completed', reason: 'Scheduled service' }
    ];
    await AuditLog.insertMany(auditLogsData);

    console.log('[FleetGuard Seed] ✅ Database successfully seeded with rich initial data!');
    process.exit(0);
  } catch (error) {
    console.error('[FleetGuard Seed Error]:', error);
    process.exit(1);
  }
}

seedDatabase();
