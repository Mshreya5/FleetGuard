const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const connectDB = require('../server/config/db');
const { completeService } = require('../src/modules/ServiceCenter/server/controllers/serviceExtensionController');
const ServiceHistory = require('../server/models/ServiceHistory');

function mockRes() {
  const res = {};
  res.statusCode = 200;
  res.data = null;
  res.status = function(code) {
    res.statusCode = code;
    return res;
  };
  res.json = function(payload) {
    res.data = payload;
    return res;
  };
  return res;
}

async function testCompleteService() {
  await connectDB();
  console.log('Connected to MongoDB');

  const req = {
    body: {
      vehicle: 'KA01AB1234',
      mechanic: 'SpeedFix Mechanic',
      totalCost: 15000,
      nextServiceDue: '10000 km'
    }
  };
  const res = mockRes();
  await completeService(req, res);

  console.log('completeService status:', res.statusCode);
  console.log('completeService response:', JSON.stringify(res.data, null, 2));

  const totalHistories = await ServiceHistory.countDocuments();
  console.log('Total ServiceHistory documents in MongoDB:', totalHistories);

  process.exit(0);
}

testCompleteService().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
