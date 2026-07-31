const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    options.hostname = '127.0.0.1';
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data || '{}') }));
    });
    req.on('error', reject);
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
}

async function runTest() {
  console.log("=== Testing Admin Dashboard Data Update ===");
  
  // 1. Fetch current dashboard numbers
  const initial = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/admin/dashboard',
    method: 'GET'
  });
  console.log("Initial Admin Dashboard Summary:", initial.data.summary);

  // 2. Post a new vehicle via POST /api/vehicles
  const newReg = "TEST" + Math.floor(1000 + Math.random() * 9000);
  console.log(`Posting new vehicle ${newReg}...`);
  const createRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/vehicles',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    registrationNumber: newReg,
    model: "City Express",
    brand: "Honda",
    branch: "Test Branch",
    manufacturingYear: 2024,
    mileage: 15,
    fuelType: "Diesel",
    vehicleType: "Truck"
  });
  console.log("Create Vehicle Response Status:", createRes.status, createRes.data);

  // 3. Fetch Admin Dashboard numbers again
  const updated = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/admin/dashboard',
    method: 'GET'
  });
  console.log("Updated Admin Dashboard Summary:", updated.data.summary);
  
  if (updated.data.summary.totalVehicles > initial.data.summary.totalVehicles) {
    console.log("SUCCESS: Admin Dashboard updated dynamically after POST!");
  } else {
    console.log("WARNING: Total vehicles count did not increase.");
  }
}

runTest().catch(console.error);
