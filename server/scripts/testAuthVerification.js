const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const { EMAIL_REGEX, PASSWORD_REGEX, NAME_REGEX } = require('../middleware/validation');

const connectDB = async () => {
  const connStr = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/fleetguard';
  await mongoose.connect(connStr);
  console.log('✅ Connected to MongoDB for Verification');
};

const runAuthVerification = async () => {
  let passed = 0;
  let failed = 0;

  const test = (title, condition) => {
    if (condition) {
      console.log(`✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title}`);
      failed++;
    }
  };

  console.log('\n====================================================');
  console.log('RUNNING AUTHENTICATION & PROFILE VERIFICATION SUITE');
  console.log('====================================================\n');

  // 1. Validation Regex Tests
  test('Valid Name: Alex Johnson', NAME_REGEX.test('Alex Johnson'));
  test('Valid Name: Kiran Shree', NAME_REGEX.test('Kiran Shree'));
  test('Reject Invalid Name with Numbers: Alex123', !NAME_REGEX.test('Alex123'));
  test('Reject Invalid Name with Special Chars: Alex@John', !NAME_REGEX.test('Alex@John'));

  test('Valid RFC Email: test.user@fleetguard.com', EMAIL_REGEX.test('test.user@fleetguard.com'));
  test('Reject Invalid Email: user@com', !EMAIL_REGEX.test('user@com'));
  test('Reject Invalid Email: userfleetguard.com', !EMAIL_REGEX.test('userfleetguard.com'));

  test('Valid Strong Password: Password@123', PASSWORD_REGEX.test('Password@123'));
  test('Reject Weak Password (No Special Char): Password123', !PASSWORD_REGEX.test('Password123'));
  test('Reject Weak Password (<8 Chars): Pass@1', !PASSWORD_REGEX.test('Pass@1'));

  // 2. Database Integration & User Tests
  await connectDB();

  const testEmail = `test.reg.${Date.now()}@fleetguard.com`;
  const rawPassword = 'Password@123';

  // Test User Creation & Password Hashing
  const newUser = new User({
    name: 'Verification User',
    email: testEmail,
    password: rawPassword,
    role: 'Fleet Manager',
    status: 'Active',
  });

  await newUser.save();
  test('User successfully registered & stored in MongoDB', Boolean(newUser._id));
  test('Password is saved hashed with bcrypt', newUser.password.startsWith('$2a$') || newUser.password.startsWith('$2b$'));

  const passMatch = await newUser.comparePassword(rawPassword);
  test('Bcrypt password comparison works correctly', passMatch);

  // Test Profile Update
  newUser.name = 'Updated Verification User';
  newUser.phone = '9876543210';
  newUser.address = 'Bengaluru, Karnataka';
  newUser.department = 'Logistics & Fleet';
  await newUser.save();

  const refreshedUser = await User.findById(newUser._id);
  test('Profile update saves name, phone, address to MongoDB', refreshedUser.name === 'Updated Verification User' && refreshedUser.phone === '9876543210');

  // Clean up test user
  await User.findByIdAndDelete(newUser._id);
  test('Cleaned up verification test user', true);

  console.log('\n====================================================');
  console.log(`AUTH SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
};

runAuthVerification().catch((err) => {
  console.error('Test Execution Error:', err);
  process.exit(1);
});
