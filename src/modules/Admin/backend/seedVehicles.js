const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Vehicle = require('./src/models/Vehicle');

dotenv.config();

const seedVehicles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fleetguard');
    await Vehicle.deleteMany({});

    const vehicles = [
      {
        registrationNumber: 'KA01AB1234',
        model: 'XUV700',
        brand: 'Mahindra',
        branch: 'Bangalore',
        manufacturingYear: 2022,
        mileage: 14.2,
        driverAssigned: 'Ravi Kumar',
        fleetManager: 'Anita Rao',
        maintenanceStatus: 'Operational',
        insurance: { status: 'Valid', expiryDate: '2026-10-10T00:00:00.000Z' },
        pollution: { status: 'Valid', expiryDate: '2026-09-05T00:00:00.000Z' },
        fitness: { status: 'Valid', expiryDate: '2026-11-20T00:00:00.000Z' },
        status: 'Active',
      },
      {
        registrationNumber: 'TN09CD7788',
        model: 'Ecosport',
        brand: 'Ford',
        branch: 'Chennai',
        manufacturingYear: 2020,
        mileage: 12.8,
        driverAssigned: 'Suresh B',
        fleetManager: 'Madhavan',
        maintenanceStatus: 'Service Due',
        insurance: { status: 'Expired', expiryDate: '2025-06-01T00:00:00.000Z' },
        pollution: { status: 'Valid', expiryDate: '2026-08-12T00:00:00.000Z' },
        fitness: { status: 'Valid', expiryDate: '2026-07-30T00:00:00.000Z' },
        status: 'Active',
      },
      {
        registrationNumber: 'MH12XY4567',
        model: 'City',
        brand: 'Honda',
        branch: 'Mumbai',
        manufacturingYear: 2021,
        mileage: 16.4,
        driverAssigned: 'Pooja N',
        fleetManager: 'Kiran Shah',
        maintenanceStatus: 'Under Maintenance',
        insurance: { status: 'Valid', expiryDate: '2026-12-01T00:00:00.000Z' },
        pollution: { status: 'Expiring Soon', expiryDate: '2026-07-31T00:00:00.000Z' },
        fitness: { status: 'Valid', expiryDate: '2026-10-15T00:00:00.000Z' },
        status: 'Active',
      },
      {
        registrationNumber: 'KL07EF2345',
        model: 'Swift',
        brand: 'Maruti',
        branch: 'Kochi',
        manufacturingYear: 2019,
        mileage: 13.9,
        driverAssigned: 'Arun Das',
        fleetManager: 'Nisha Menon',
        maintenanceStatus: 'Operational',
        insurance: { status: 'Valid', expiryDate: '2026-08-20T00:00:00.000Z' },
        pollution: { status: 'Valid', expiryDate: '2026-09-18T00:00:00.000Z' },
        fitness: { status: 'Expired', expiryDate: '2025-07-01T00:00:00.000Z' },
        status: 'Active',
      },
      {
        registrationNumber: 'AP05GH9988',
        model: 'S-Cross',
        brand: 'Maruti',
        branch: 'Hyderabad',
        manufacturingYear: 2023,
        mileage: 15.4,
        driverAssigned: 'Neeraj',
        fleetManager: 'Sajid Khan',
        maintenanceStatus: 'Operational',
        insurance: { status: 'Expiring Soon', expiryDate: '2026-08-02T00:00:00.000Z' },
        pollution: { status: 'Valid', expiryDate: '2026-12-09T00:00:00.000Z' },
        fitness: { status: 'Valid', expiryDate: '2027-01-10T00:00:00.000Z' },
        status: 'Active',
      },
      {
        registrationNumber: 'GJ03JK4455',
        model: 'Verna',
        brand: 'Hyundai',
        branch: 'Ahmedabad',
        manufacturingYear: 2021,
        mileage: 17.0,
        driverAssigned: 'Meera S',
        fleetManager: 'Prakash',
        maintenanceStatus: 'Operational',
        insurance: { status: 'Valid', expiryDate: '2026-09-25T00:00:00.000Z' },
        pollution: { status: 'Valid', expiryDate: '2026-10-05T00:00:00.000Z' },
        fitness: { status: 'Valid', expiryDate: '2026-11-05T00:00:00.000Z' },
        status: 'Active',
      },
      {
        registrationNumber: 'PB11LM6677',
        model: 'Tigor',
        brand: 'Tata',
        branch: 'Ludhiana',
        manufacturingYear: 2018,
        mileage: 11.6,
        driverAssigned: 'Harpreet',
        fleetManager: 'Vikram',
        maintenanceStatus: 'Out of Service',
        insurance: { status: 'Expired', expiryDate: '2025-01-20T00:00:00.000Z' },
        pollution: { status: 'Expired', expiryDate: '2025-03-10T00:00:00.000Z' },
        fitness: { status: 'Expired', expiryDate: '2025-04-12T00:00:00.000Z' },
        status: 'Inactive',
      },
      {
        registrationNumber: 'RJ14NP2233',
        model: 'Creta',
        brand: 'Hyundai',
        branch: 'Jaipur',
        manufacturingYear: 2022,
        mileage: 14.8,
        driverAssigned: 'Deepak',
        fleetManager: 'Ritika',
        maintenanceStatus: 'Operational',
        insurance: { status: 'Valid', expiryDate: '2027-02-14T00:00:00.000Z' },
        pollution: { status: 'Valid', expiryDate: '2026-09-07T00:00:00.000Z' },
        fitness: { status: 'Expiring Soon', expiryDate: '2026-08-08T00:00:00.000Z' },
        status: 'Active',
      },
      {
        registrationNumber: 'UP16QR7744',
        model: 'Nexon',
        brand: 'Tata',
        branch: 'Lucknow',
        manufacturingYear: 2020,
        mileage: 13.2,
        driverAssigned: 'Asha K',
        fleetManager: 'Salman',
        maintenanceStatus: 'Service Due',
        insurance: { status: 'Valid', expiryDate: '2026-08-16T00:00:00.000Z' },
        pollution: { status: 'Valid', expiryDate: '2026-10-22T00:00:00.000Z' },
        fitness: { status: 'Valid', expiryDate: '2026-12-18T00:00:00.000Z' },
        status: 'Active',
      },
      {
        registrationNumber: 'HR18ST8899',
        model: 'Brezza',
        brand: 'Maruti',
        branch: 'Gurugram',
        manufacturingYear: 2023,
        mileage: 18.3,
        driverAssigned: 'Renu T',
        fleetManager: 'Nikhil',
        maintenanceStatus: 'Operational',
        insurance: { status: 'Valid', expiryDate: '2027-03-03T00:00:00.000Z' },
        pollution: { status: 'Expiring Soon', expiryDate: '2026-08-01T00:00:00.000Z' },
        fitness: { status: 'Valid', expiryDate: '2026-09-12T00:00:00.000Z' },
        status: 'Active',
      },
    ];

    await Vehicle.insertMany(vehicles);
    console.log('Seeded 10 vehicles');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedVehicles();
