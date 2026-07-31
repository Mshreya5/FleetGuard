const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (dnsErr) {
  // Ignore DNS config errors
}

const connectDB = async () => {
  let uri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://askdfleet_db_user:CB9iPFuU2gkT0p7A@cluster0.lcwickq.mongodb.net/fleetguard";

  if (uri.startsWith('mongodb+srv://') && !uri.includes('.mongodb.net/')) {
    uri = uri.replace('.mongodb.net', '.mongodb.net/fleetguard');
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'fleetguard',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log(`[FleetGuard Unified Backend] MongoDB Connected: ${conn.connection.host} / DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[FleetGuard Unified Backend] Primary MongoDB Atlas warning: ${error.message}. Attempting local fallback...`);
    try {
      const fallbackConn = await mongoose.connect("mongodb://127.0.0.1:27017/fleetguard", {
        dbName: 'fleetguard',
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });
      console.log(`[FleetGuard Unified Backend] Connected to local MongoDB fallback: ${fallbackConn.connection.host}`);
      return fallbackConn;
    } catch (fallbackError) {
      console.error(`[FleetGuard Unified Backend] MongoDB Connection Error: ${fallbackError.message}`);
      return null;
    }
  }
};

connectDB.connectDB = connectDB;
module.exports = connectDB;
