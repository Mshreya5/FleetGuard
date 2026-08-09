const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
const connectDB = require('../config/db');

const { validateVehicleData, validateUserData, validateDates } = require('../middleware/validation');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Assignment = require('../models/Assignment');
const ServiceQueue = require('../models/ServiceQueue');
const ServiceHistory = require('../models/ServiceHistory');
const OverrideLog = require('../models/OverrideLog');
const AuditLog = require('../models/AuditLog');

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING AUTOMATED VERIFICATION SUITE');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  };

  // TEST 1: Indian Vehicle Number Validation Regex
  const validRegs = ['KA01AB1234', 'KA19MK4589', 'MH12DE1234', 'DL10AB5678'];
  const invalidRegs = ['12345', 'KA123', 'ABCD1234', 'ka19ab1234', 'KA-19-1234', 'KA@19#1234'];

  validRegs.forEach((reg) => {
    const errs = validateVehicleData({ registrationNumber: reg, model: 'XUV700', manufacturingYear: 2022, mileage: 1000 });
    assert(errs.length === 0, `Valid Reg Number: ${reg}`);
  });

  invalidRegs.forEach((reg) => {
    const errs = validateVehicleData({ registrationNumber: reg, model: 'XUV700', manufacturingYear: 2022, mileage: 1000 });
    assert(errs.length > 0, `Reject Invalid Reg Number: ${reg}`);
  });

  // TEST 2: Vehicle Model Validation
  assert(validateVehicleData({ registrationNumber: 'KA01AB1234', model: '12345', manufacturingYear: 2022, mileage: 100 }).length > 0, 'Reject numbers-only model name');
  assert(validateVehicleData({ registrationNumber: 'KA01AB1234', model: 'A', manufacturingYear: 2022, mileage: 100 }).length > 0, 'Reject <2 char model name');

  // TEST 3: Manufacturing Year & Mileage
  assert(validateVehicleData({ registrationNumber: 'KA01AB1234', model: 'City', manufacturingYear: 1975, mileage: 100 }).length > 0, 'Reject year < 1980');
  assert(validateVehicleData({ registrationNumber: 'KA01AB1234', model: 'City', manufacturingYear: 2030, mileage: 100 }).length > 0, 'Reject future year');
  assert(validateVehicleData({ registrationNumber: 'KA01AB1234', model: 'City', manufacturingYear: 2022, mileage: -50 }).length > 0, 'Reject negative mileage');

  // TEST 4: Phone & Email & Password Regex
  const validUserErrs = validateUserData({
    name: 'Anita Rao',
    email: 'anita@fleetguard.com',
    phone: '9000000002',
    password: 'Fleet@1234',
  });
  assert(validUserErrs.length === 0, 'Valid user input data');

  const invalidUserErrs = validateUserData({
    name: 'Anita123',
    email: 'invalid-email',
    phone: '12345',
    password: 'simple',
  });
  assert(invalidUserErrs.length === 4, 'Reject invalid name, email, phone, and password complexity');

  // TEST 5: Dates
  const invalidDateErrs = validateDates({ issueDate: '2026-10-10', expiryDate: '2025-10-10' });
  assert(invalidDateErrs.length > 0, 'Reject expiry date before issue date');

  // DATABASE INTEGRATION & CROSS-MODULE TESTS
  await connectDB();

  // DB Verification
  const userCount = await User.countDocuments();
  const vehicleCount = await Vehicle.countDocuments();
  const auditCount = await AuditLog.countDocuments();

  assert(userCount > 0, `Database has ${userCount} active users`);
  assert(vehicleCount > 0, `Database has ${vehicleCount} active vehicles`);
  assert(auditCount > 0, `Database has ${auditCount} persistent audit logs`);

  console.log('====================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
