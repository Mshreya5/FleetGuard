const dotenv = require('dotenv');
const { connectDB } = require('../config/db');
const Assignment = require('../models/Assignment');
const Checklist = require('../models/Checklist');
const IssueReport = require('../models/IssueReport');
const Notification = require('../models/Notification');
const TripStatus = require('../models/TripStatus');
const ServiceHistory = require('../models/ServiceHistory');

dotenv.config();

const seedData = async () => {
  await connectDB();

  const driverId = 'driver-001';
  const vehicleId = 'VH-102';

  await Assignment.deleteMany({ driverId });
  await Checklist.deleteMany({ driverId });
  await IssueReport.deleteMany({ driverId });
  await Notification.deleteMany({ driverId });
  await TripStatus.deleteMany({ driverId });
  await ServiceHistory.deleteMany({ driverId });

  await Assignment.create({
    driverId,
    vehicleId,
    vehicleNumber: 'DL-07-TR-1812',
    vehicleName: 'Truck 12A',
    assignedDate: new Date(),
    status: 'Active',
    complianceStatus: 'Valid',
    insuranceExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120),
    serviceDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35),
    tracker: 'GPS Ready',
  });

  await Checklist.create({
    driverId,
    vehicleId,
    tyres: true,
    brakes: true,
    lights: true,
    fuel: true,
    mirrors: true,
    horn: true,
    status: 'Completed',
    submittedAt: new Date(),
  });

  await Notification.create({
    driverId,
    title: 'Vehicle Assigned',
    message: 'Vehicle Truck 12A has been assigned to driver-001.',
    type: 'Vehicle Assigned',
  });

  await Notification.create({
    driverId,
    title: 'Compliance Alert',
    message: 'Vehicle compliance is currently valid.',
    type: 'Compliance Alert',
  });

  await Notification.create({
    driverId,
    title: 'Checklist Reminder',
    message: 'Complete the pre-trip checklist before starting your route.',
    type: 'Checklist Reminder',
  });

  await Notification.create({
    driverId,
    title: 'Service Reminder',
    message: 'Vehicle service is due in 35 days.',
    type: 'Service Reminder',
  });

  await TripStatus.create({
    driverId,
    vehicleId,
    status: 'Not Started',
    checklistCompleted: true,
  });

  await ServiceHistory.create({
    driverId,
    vehicleId,
    serviceType: 'Brake Inspection',
    performedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    status: 'Completed',
    notes: 'Brake system inspected and confirmed healthy.',
  });

  console.log('Driver seed data inserted successfully');
  process.exit(0);
};

seedData().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
