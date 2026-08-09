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
<<<<<<< HEAD
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      family: 4
    });
    console.log(`[FleetGuard Unified Backend] MongoDB Connected: ${conn.connection.host} / DB: ${conn.connection.name}`);
    
    // Connection event listeners
    conn.connection.on('connected', () => {
      console.log('[FleetGuard Unified Backend] MongoDB connection established');
    });
    
    conn.connection.on('disconnected', () => {
      console.warn('[FleetGuard Unified Backend] MongoDB disconnected');
    });
    
    conn.connection.on('error', (err) => {
      console.error('[FleetGuard Unified Backend] MongoDB connection error:', err.message);
    });
    
=======
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log(`[FleetGuard Unified Backend] MongoDB Connected: ${conn.connection.host} / DB: ${conn.connection.name}`);
    
>>>>>>> origin/dev
    // Auto-clean legacy MongoDB indexes
    try {
      const vehColl = conn.connection.collection('vehicles');
      const idxs = await vehColl.indexes().catch(() => []);
      for (const idx of idxs) {
        if (['vin_1', 'licensePlate_1', 'chassisNumber_1', 'engineNumber_1'].includes(idx.name)) {
          await vehColl.dropIndex(idx.name).catch(() => {});
        }
      }
    } catch (e) {
      // Ignore index check errors
    }

    return conn;
  } catch (error) {
    console.warn(`[FleetGuard Unified Backend] Primary MongoDB Atlas warning: ${error.message}. Attempting local fallback...`);
    try {
      const fallbackConn = await mongoose.connect("mongodb://127.0.0.1:27017/fleetguard", {
        dbName: 'fleetguard',
<<<<<<< HEAD
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
        retryWrites: true,
        retryReads: true,
        w: 'majority',
        family: 4
=======
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
>>>>>>> origin/dev
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
