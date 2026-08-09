const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://askdfleet_db_user:CB9iPFuU2gkT0p7A@cluster0.lcwickq.mongodb.net/fleetguard?retryWrites=true&w=majority';

async function inspect() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections:`);
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Inspection error:', err);
  }
}

inspect();
