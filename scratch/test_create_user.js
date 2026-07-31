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
  console.log("=== Testing User Creation in Admin Module ===");
  const testEmail = "testuser" + Math.floor(1000 + Math.random() * 9000) + "@gmail.com";
  console.log(`Posting new user ${testEmail}...`);
  
  const createRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/users',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: "Test User",
    email: testEmail,
    password: "Password123",
    role: "Driver",
    branch: "Kochi",
    phone: "01234567890"
  });

  console.log("Create User Response Status:", createRes.status, createRes.data);
  if (createRes.status === 201) {
    console.log("SUCCESS: User created successfully in MongoDB!");
  } else {
    console.log("FAILED: User creation returned status", createRes.status);
  }
}

runTest().catch(console.error);
