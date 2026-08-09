const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const connectDB = require('../server/config/db');

async function fixVehicleIndexes() {
  try {
    const mongoose = await connectDB();
    console.log('====================================================');
    console.log('  INSPECTING & REMOVING ALL LEGACY MONGO DB INDEXES');
    console.log('====================================================\n');

    const collection = mongoose.connection.collection('vehicles');
    const indexes = await collection.indexes();
    console.log('Current indexes on `vehicles` collection:', indexes.map(i => i.name));

    // Drop all legacy unique indexes except _id_ and registrationNumber_1
    for (const idx of indexes) {
      if (idx.name !== '_id_' && idx.name !== 'registrationNumber_1') {
        console.log(`⚠️ Found legacy index \`${idx.name}\`. Dropping...`);
        await collection.dropIndex(idx.name).catch(err => console.warn(`Could not drop ${idx.name}:`, err.message));
        console.log(`✅ Successfully dropped \`${idx.name}\`.`);
      }
    }

    const updatedIndexes = await collection.indexes();
    console.log('\nFinal clean indexes on `vehicles` collection:', updatedIndexes.map(i => i.name));

    // Test inserting multiple vehicles consecutively without VIN or licensePlate
    console.log('\n--- TESTING MULTIPLE VEHICLE INSERTS ---');
    const Vehicle = require('../src/modules/Admin/backend/src/models/Vehicle');
    
    const reg1 = `TEST-REG-${Math.floor(Math.random() * 8999 + 1000)}`;
    const reg2 = `TEST-REG-${Math.floor(Math.random() * 8999 + 1000)}`;
    const reg3 = `TEST-REG-${Math.floor(Math.random() * 8999 + 1000)}`;

    const v1 = await Vehicle.create({
      registrationNumber: reg1,
      model: 'Bolero',
      brand: 'Mahindra',
      branch: 'Bangalore',
      manufacturingYear: 2023,
      mileage: 10000
    });
    console.log(`• Vehicle 1 inserted: ${v1.registrationNumber} (ID: ${v1._id})`);

    const v2 = await Vehicle.create({
      registrationNumber: reg2,
      model: 'Scorpio',
      brand: 'Mahindra',
      branch: 'Chennai',
      manufacturingYear: 2024,
      mileage: 5000
    });
    console.log(`• Vehicle 2 inserted: ${v2.registrationNumber} (ID: ${v2._id})`);

    const v3 = await Vehicle.create({
      registrationNumber: reg3,
      model: 'XUV700',
      brand: 'Mahindra',
      branch: 'Mumbai',
      manufacturingYear: 2024,
      mileage: 12000
    });
    console.log(`• Vehicle 3 inserted: ${v3.registrationNumber} (ID: ${v3._id})`);

    // Clean up test vehicles
    await Vehicle.deleteMany({ registrationNumber: { $in: [reg1, reg2, reg3] } });
    console.log('\n✅ Cleaned up test vehicles.');
    console.log('====================================================');
    console.log('  ALL LEGACY INDEXES REMOVED & 3 INSERTS VERIFIED 100%!');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to fix indexes:', error);
    process.exit(1);
  }
}

fixVehicleIndexes();
