const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fleetguard';

const testConnection = async () => {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connection test: SUCCESS');
    console.log('Connected to:', mongoUri);
    console.log('Ready state:', mongoose.connection.readyState);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection test: FAILED');
    console.error(error.message);
    process.exit(1);
  }
};

testConnection();
