const mongoose = require('mongoose');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

function isPlaceholderMongoUri(uri) {
  return !uri || /<username>|<password>|cluster0\.example\.mongodb\.net/i.test(uri);
}

async function connectDatabase() {
  if (!process.env.MONGODB_URI || isPlaceholderMongoUri(process.env.MONGODB_URI)) {
    console.warn('⚠️  MONGODB_URI is not configured. Starting in demo mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.error('⚠️  Server running WITHOUT database — writes will fail.');
    return false;
  }
}

module.exports = { connectDatabase };
