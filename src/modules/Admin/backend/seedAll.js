const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

dotenv.config();

const Vehicle = require('./src/models/Vehicle');
const User = require('./src/models/User');
const Maintenance = require('./src/models/Maintenance');
const Notification = require('./src/models/Notification');
const OverrideLog = require('./src/models/OverrideLog');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    await Promise.all([
      Vehicle.deleteMany({}),
      User.deleteMany({}),
      Maintenance.deleteMany({}),
      Notification.deleteMany({}),
      OverrideLog.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // --- Vehicles (15) ---
    await Vehicle.insertMany([
      { registrationNumber: 'KA01AB1234', model: 'XUV700', brand: 'Mahindra', branch: 'Bangalore', manufacturingYear: 2022, mileage: 14.2, driverAssigned: 'Ravi Kumar', fleetManager: 'Anita Rao', maintenanceStatus: 'Operational', insurance: { status: 'Valid', expiryDate: '2026-10-10' }, pollution: { status: 'Valid', expiryDate: '2026-09-05' }, fitness: { status: 'Valid', expiryDate: '2026-11-20' }, status: 'Active' },
      { registrationNumber: 'TN09CD7788', model: 'Ecosport', brand: 'Ford', branch: 'Chennai', manufacturingYear: 2020, mileage: 12.8, driverAssigned: 'Suresh B', fleetManager: 'Madhavan', maintenanceStatus: 'Service Due', insurance: { status: 'Expired', expiryDate: '2024-06-01' }, pollution: { status: 'Valid', expiryDate: '2026-08-12' }, fitness: { status: 'Valid', expiryDate: '2026-07-30' }, status: 'Active' },
      { registrationNumber: 'MH12XY4567', model: 'City', brand: 'Honda', branch: 'Mumbai', manufacturingYear: 2021, mileage: 16.4, driverAssigned: 'Pooja N', fleetManager: 'Kiran Shah', maintenanceStatus: 'Under Maintenance', insurance: { status: 'Valid', expiryDate: '2026-12-01' }, pollution: { status: 'Expiring Soon', expiryDate: '2025-08-10' }, fitness: { status: 'Valid', expiryDate: '2026-10-15' }, status: 'Active' },
      { registrationNumber: 'KL07EF2345', model: 'Swift', brand: 'Maruti', branch: 'Kochi', manufacturingYear: 2019, mileage: 13.9, driverAssigned: 'Arun Das', fleetManager: 'Nisha Menon', maintenanceStatus: 'Operational', insurance: { status: 'Valid', expiryDate: '2026-08-20' }, pollution: { status: 'Valid', expiryDate: '2026-09-18' }, fitness: { status: 'Expired', expiryDate: '2024-07-01' }, status: 'Active' },
      { registrationNumber: 'AP05GH9988', model: 'S-Cross', brand: 'Maruti', branch: 'Hyderabad', manufacturingYear: 2023, mileage: 15.4, driverAssigned: 'Neeraj', fleetManager: 'Sajid Khan', maintenanceStatus: 'Operational', insurance: { status: 'Expiring Soon', expiryDate: '2025-08-02' }, pollution: { status: 'Valid', expiryDate: '2026-12-09' }, fitness: { status: 'Valid', expiryDate: '2027-01-10' }, status: 'Active' },
      { registrationNumber: 'GJ03JK4455', model: 'Verna', brand: 'Hyundai', branch: 'Ahmedabad', manufacturingYear: 2021, mileage: 17.0, driverAssigned: 'Meera S', fleetManager: 'Prakash', maintenanceStatus: 'Operational', insurance: { status: 'Valid', expiryDate: '2026-09-25' }, pollution: { status: 'Valid', expiryDate: '2026-10-05' }, fitness: { status: 'Valid', expiryDate: '2026-11-05' }, status: 'Active' },
      { registrationNumber: 'PB11LM6677', model: 'Tigor', brand: 'Tata', branch: 'Ludhiana', manufacturingYear: 2018, mileage: 11.6, driverAssigned: 'Harpreet', fleetManager: 'Vikram', maintenanceStatus: 'Out of Service', insurance: { status: 'Expired', expiryDate: '2024-01-20' }, pollution: { status: 'Expired', expiryDate: '2024-03-10' }, fitness: { status: 'Expired', expiryDate: '2024-04-12' }, status: 'Inactive' },
      { registrationNumber: 'RJ14NP2233', model: 'Creta', brand: 'Hyundai', branch: 'Jaipur', manufacturingYear: 2022, mileage: 14.8, driverAssigned: 'Deepak', fleetManager: 'Ritika', maintenanceStatus: 'Operational', insurance: { status: 'Valid', expiryDate: '2027-02-14' }, pollution: { status: 'Valid', expiryDate: '2026-09-07' }, fitness: { status: 'Expiring Soon', expiryDate: '2025-08-08' }, status: 'Active' },
      { registrationNumber: 'UP16QR7744', model: 'Nexon', brand: 'Tata', branch: 'Lucknow', manufacturingYear: 2020, mileage: 13.2, driverAssigned: 'Asha K', fleetManager: 'Salman', maintenanceStatus: 'Service Due', insurance: { status: 'Valid', expiryDate: '2026-08-16' }, pollution: { status: 'Valid', expiryDate: '2026-10-22' }, fitness: { status: 'Valid', expiryDate: '2026-12-18' }, status: 'Active' },
      { registrationNumber: 'HR18ST8899', model: 'Brezza', brand: 'Maruti', branch: 'Gurugram', manufacturingYear: 2023, mileage: 18.3, driverAssigned: 'Renu T', fleetManager: 'Nikhil', maintenanceStatus: 'Operational', insurance: { status: 'Valid', expiryDate: '2027-03-03' }, pollution: { status: 'Expiring Soon', expiryDate: '2025-08-01' }, fitness: { status: 'Valid', expiryDate: '2026-09-12' }, status: 'Active' },
      { registrationNumber: 'DL04UV1122', model: 'Innova', brand: 'Toyota', branch: 'Delhi', manufacturingYear: 2019, mileage: 12.0, driverAssigned: 'Mohit', fleetManager: 'Priya', maintenanceStatus: 'Under Maintenance', insurance: { status: 'Expired', expiryDate: '2024-05-15' }, pollution: { status: 'Expired', expiryDate: '2024-06-20' }, fitness: { status: 'Valid', expiryDate: '2026-08-30' }, status: 'Active' },
      { registrationNumber: 'WB22WX3344', model: 'Fortuner', brand: 'Toyota', branch: 'Kolkata', manufacturingYear: 2021, mileage: 10.5, driverAssigned: 'Subhash', fleetManager: 'Tanmoy', maintenanceStatus: 'Operational', insurance: { status: 'Valid', expiryDate: '2026-11-11' }, pollution: { status: 'Valid', expiryDate: '2026-10-10' }, fitness: { status: 'Valid', expiryDate: '2027-01-01' }, status: 'Active' },
      { registrationNumber: 'OD06YZ5566', model: 'Bolero', brand: 'Mahindra', branch: 'Bhubaneswar', manufacturingYear: 2018, mileage: 11.0, driverAssigned: 'Unassigned', fleetManager: 'Unassigned', maintenanceStatus: 'Out of Service', insurance: { status: 'Expired', expiryDate: '2023-12-01' }, pollution: { status: 'Expired', expiryDate: '2023-11-15' }, fitness: { status: 'Expired', expiryDate: '2023-10-20' }, status: 'Inactive' },
      { registrationNumber: 'MP09ZA7788', model: 'Scorpio', brand: 'Mahindra', branch: 'Bhopal', manufacturingYear: 2020, mileage: 13.5, driverAssigned: 'Ramesh', fleetManager: 'Sunita', maintenanceStatus: 'Operational', insurance: { status: 'Valid', expiryDate: '2026-07-25' }, pollution: { status: 'Valid', expiryDate: '2026-08-14' }, fitness: { status: 'Valid', expiryDate: '2026-09-09' }, status: 'Active' },
      { registrationNumber: 'GA01BC9900', model: 'Thar', brand: 'Mahindra', branch: 'Panaji', manufacturingYear: 2023, mileage: 15.8, driverAssigned: 'Carlos', fleetManager: 'Fernandes', maintenanceStatus: 'Operational', insurance: { status: 'Valid', expiryDate: '2027-04-18' }, pollution: { status: 'Valid', expiryDate: '2027-02-22' }, fitness: { status: 'Valid', expiryDate: '2027-03-30' }, status: 'Active' },
    ]);
    console.log('Seeded 15 vehicles');

    // --- Users (20) ---
    const hashedPassword = await bcrypt.hash('Fleet@1234', 10);
    await User.insertMany([
      { name: 'Admin User', email: 'admin@fleetguard.com', password: hashedPassword, role: 'Admin', branch: 'Head Office', phone: '9000000001', status: 'Active' },
      { name: 'Anita Rao', email: 'anita@fleetguard.com', password: hashedPassword, role: 'Fleet Manager', branch: 'Bangalore', phone: '9000000002', status: 'Active' },
      { name: 'Madhavan K', email: 'madhavan@fleetguard.com', password: hashedPassword, role: 'Fleet Manager', branch: 'Chennai', phone: '9000000003', status: 'Active' },
      { name: 'Kiran Shah', email: 'kiran@fleetguard.com', password: hashedPassword, role: 'Fleet Manager', branch: 'Mumbai', phone: '9000000004', status: 'Active' },
      { name: 'Ravi Kumar', email: 'ravi@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Bangalore', phone: '9000000005', status: 'Active' },
      { name: 'Suresh B', email: 'suresh@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Chennai', phone: '9000000006', status: 'Active' },
      { name: 'Pooja N', email: 'pooja@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Mumbai', phone: '9000000007', status: 'Active' },
      { name: 'Arun Das', email: 'arun@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Kochi', phone: '9000000008', status: 'Active' },
      { name: 'Neeraj Singh', email: 'neeraj@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Hyderabad', phone: '9000000009', status: 'Active' },
      { name: 'Meera S', email: 'meera@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Ahmedabad', phone: '9000000010', status: 'Active' },
      { name: 'Harpreet K', email: 'harpreet@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Ludhiana', phone: '9000000011', status: 'Inactive' },
      { name: 'Deepak M', email: 'deepak@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Jaipur', phone: '9000000012', status: 'Active' },
      { name: 'Asha K', email: 'asha@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Lucknow', phone: '9000000013', status: 'Active' },
      { name: 'Renu T', email: 'renu@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Gurugram', phone: '9000000014', status: 'Active' },
      { name: 'Mohit V', email: 'mohit@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Delhi', phone: '9000000015', status: 'Active' },
      { name: 'Subhash C', email: 'subhash@fleetguard.com', password: hashedPassword, role: 'Driver', branch: 'Kolkata', phone: '9000000016', status: 'Active' },
      { name: 'SpeedFix Center', email: 'speedfix@fleetguard.com', password: hashedPassword, role: 'Service Center', branch: 'Bangalore', phone: '9000000017', status: 'Active' },
      { name: 'AutoCare Hub', email: 'autocare@fleetguard.com', password: hashedPassword, role: 'Service Center', branch: 'Chennai', phone: '9000000018', status: 'Active' },
      { name: 'Nisha Menon', email: 'nisha@fleetguard.com', password: hashedPassword, role: 'Fleet Manager', branch: 'Kochi', phone: '9000000019', status: 'Active' },
      { name: 'Sajid Khan', email: 'sajid@fleetguard.com', password: hashedPassword, role: 'Fleet Manager', branch: 'Hyderabad', phone: '9000000020', status: 'Active' },
    ]);
    console.log('Seeded 20 users');

    // --- Maintenance (20) ---
    await Maintenance.insertMany([
      { vehicle: 'KA01AB1234', serviceDate: '2025-01-10', cost: 4500, description: 'Oil change and filter replacement', serviceCenter: 'SpeedFix Center', status: 'Completed' },
      { vehicle: 'TN09CD7788', serviceDate: '2025-02-14', cost: 8200, description: 'Brake pad replacement', serviceCenter: 'AutoCare Hub', status: 'Completed' },
      { vehicle: 'MH12XY4567', serviceDate: '2025-03-05', cost: 12000, description: 'Engine overhaul', serviceCenter: 'Mumbai Motors', status: 'In Progress' },
      { vehicle: 'KL07EF2345', serviceDate: '2025-01-22', cost: 3200, description: 'Tyre rotation and alignment', serviceCenter: 'Kochi AutoWorks', status: 'Completed' },
      { vehicle: 'AP05GH9988', serviceDate: '2025-04-01', cost: 5600, description: 'AC servicing', serviceCenter: 'HydroFix', status: 'Completed' },
      { vehicle: 'GJ03JK4455', serviceDate: '2025-02-28', cost: 7800, description: 'Suspension repair', serviceCenter: 'Ahmedabad AutoCare', status: 'Completed' },
      { vehicle: 'PB11LM6677', serviceDate: '2025-03-18', cost: 15000, description: 'Full body repair', serviceCenter: 'Punjab Motors', status: 'Completed' },
      { vehicle: 'RJ14NP2233', serviceDate: '2025-04-10', cost: 4100, description: 'Battery replacement', serviceCenter: 'Jaipur AutoHub', status: 'Completed' },
      { vehicle: 'UP16QR7744', serviceDate: '2025-05-02', cost: 6300, description: 'Clutch replacement', serviceCenter: 'Lucknow Service', status: 'Pending' },
      { vehicle: 'HR18ST8899', serviceDate: '2025-05-15', cost: 2800, description: 'Windshield wiper replacement', serviceCenter: 'Gurugram AutoFix', status: 'Completed' },
      { vehicle: 'DL04UV1122', serviceDate: '2025-04-20', cost: 9500, description: 'Transmission service', serviceCenter: 'Delhi AutoCare', status: 'In Progress' },
      { vehicle: 'WB22WX3344', serviceDate: '2025-03-30', cost: 5200, description: 'Coolant flush', serviceCenter: 'Kolkata Motors', status: 'Completed' },
      { vehicle: 'OD06YZ5566', serviceDate: '2025-02-10', cost: 18000, description: 'Major overhaul', serviceCenter: 'Bhubaneswar AutoWorks', status: 'Completed' },
      { vehicle: 'MP09ZA7788', serviceDate: '2025-05-20', cost: 3700, description: 'Spark plug replacement', serviceCenter: 'Bhopal AutoCare', status: 'Completed' },
      { vehicle: 'GA01BC9900', serviceDate: '2025-06-01', cost: 4900, description: 'Periodic service', serviceCenter: 'Goa AutoHub', status: 'Pending' },
      { vehicle: 'KA01AB1234', serviceDate: '2025-06-05', cost: 2200, description: 'Air filter replacement', serviceCenter: 'SpeedFix Center', status: 'Completed' },
      { vehicle: 'TN09CD7788', serviceDate: '2025-06-10', cost: 6700, description: 'Fuel injector cleaning', serviceCenter: 'AutoCare Hub', status: 'Completed' },
      { vehicle: 'MH12XY4567', serviceDate: '2025-06-12', cost: 3400, description: 'Power steering fluid change', serviceCenter: 'Mumbai Motors', status: 'Pending' },
      { vehicle: 'RJ14NP2233', serviceDate: '2025-06-15', cost: 5100, description: 'Exhaust system repair', serviceCenter: 'Jaipur AutoHub', status: 'Completed' },
      { vehicle: 'HR18ST8899', serviceDate: '2025-06-18', cost: 7200, description: 'Differential service', serviceCenter: 'Gurugram AutoFix', status: 'In Progress' },
    ]);
    console.log('Seeded 20 maintenance records');

    // --- Notifications (15) ---
    await Notification.insertMany([
      { title: 'Insurance Expiry Alert', message: 'TN09CD7788 insurance expired on 01/06/2024', type: 'Insurance Expiry', priority: 'High', isRead: false },
      { title: 'Insurance Expiry Alert', message: 'PB11LM6677 insurance expired on 20/01/2024', type: 'Insurance Expiry', priority: 'High', isRead: false },
      { title: 'Insurance Expiry Alert', message: 'DL04UV1122 insurance expired on 15/05/2024', type: 'Insurance Expiry', priority: 'High', isRead: true },
      { title: 'Fitness Certificate Expired', message: 'KL07EF2345 fitness certificate expired on 01/07/2024', type: 'Compliance Expired', priority: 'High', isRead: false },
      { title: 'Pollution Certificate Expired', message: 'PB11LM6677 pollution certificate expired on 10/03/2024', type: 'Compliance Expired', priority: 'High', isRead: false },
      { title: 'Maintenance Due', message: 'UP16QR7744 is due for scheduled maintenance', type: 'Maintenance Due', priority: 'Medium', isRead: false },
      { title: 'Maintenance Due', message: 'GA01BC9900 periodic service is pending', type: 'Maintenance Due', priority: 'Medium', isRead: true },
      { title: 'Vehicle Assignment', message: 'OD06YZ5566 has no driver assigned', type: 'Vehicle Assignment', priority: 'Low', isRead: false },
      { title: 'Vehicle Registration', message: 'New vehicle GA01BC9900 registered in Panaji branch', type: 'Vehicle Registration', priority: 'Low', isRead: true },
      { title: 'Insurance Expiring Soon', message: 'AP05GH9988 insurance expiring on 02/08/2025', type: 'Insurance Expiry', priority: 'Medium', isRead: false },
      { title: 'Pollution Expiring Soon', message: 'HR18ST8899 pollution certificate expiring on 01/08/2025', type: 'Compliance Expired', priority: 'Medium', isRead: false },
      { title: 'Fitness Expiring Soon', message: 'RJ14NP2233 fitness certificate expiring on 08/08/2025', type: 'Compliance Expired', priority: 'Medium', isRead: false },
      { title: 'Vehicle Out of Service', message: 'PB11LM6677 marked as Out of Service', type: 'Vehicle Assignment', priority: 'High', isRead: true },
      { title: 'Maintenance Completed', message: 'KA01AB1234 oil change completed at SpeedFix Center', type: 'Maintenance Due', priority: 'Low', isRead: true },
      { title: 'Compliance Expired', message: 'OD06YZ5566 has 3 expired documents', type: 'Compliance Expired', priority: 'High', isRead: false },
    ]);
    console.log('Seeded 15 notifications');

    // --- Override Logs (10) ---
    await OverrideLog.insertMany([
      { vehicleNumber: 'TN09CD7788', driver: 'Suresh B', fleetManager: 'Madhavan', overrideReason: 'Emergency delivery — insurance renewal in process', status: 'Approved' },
      { vehicleNumber: 'PB11LM6677', driver: 'Harpreet K', fleetManager: 'Vikram', overrideReason: 'One-time trip to service center for repair', status: 'Approved' },
      { vehicleNumber: 'KL07EF2345', driver: 'Arun Das', fleetManager: 'Nisha Menon', overrideReason: 'Fitness certificate renewal appointment', status: 'Pending' },
      { vehicleNumber: 'DL04UV1122', driver: 'Mohit V', fleetManager: 'Priya', overrideReason: 'Urgent client pickup — documents being renewed', status: 'Approved' },
      { vehicleNumber: 'OD06YZ5566', driver: 'Unassigned', fleetManager: 'Unassigned', overrideReason: 'Vehicle towed to service center', status: 'Approved' },
      { vehicleNumber: 'AP05GH9988', driver: 'Neeraj', fleetManager: 'Sajid Khan', overrideReason: 'Insurance renewal delayed by 2 days', status: 'Pending' },
      { vehicleNumber: 'MH12XY4567', driver: 'Pooja N', fleetManager: 'Kiran Shah', overrideReason: 'Test drive after maintenance', status: 'Approved' },
      { vehicleNumber: 'HR18ST8899', driver: 'Renu T', fleetManager: 'Nikhil', overrideReason: 'Pollution certificate appointment scheduled', status: 'Rejected' },
      { vehicleNumber: 'RJ14NP2233', driver: 'Deepak', fleetManager: 'Ritika', overrideReason: 'Fitness certificate expiring — renewal booked', status: 'Pending' },
      { vehicleNumber: 'UP16QR7744', driver: 'Asha K', fleetManager: 'Salman', overrideReason: 'Emergency medical transport', status: 'Approved' },
    ]);
    console.log('Seeded 10 override logs');

    console.log('\n✅ All seed data inserted successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
