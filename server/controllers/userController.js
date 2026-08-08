const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Vehicle = require('../models/Vehicle');
const { generateToken } = require('../middleware/auth');
const { validateUserData, EMAIL_REGEX, PASSWORD_REGEX, NAME_REGEX, PHONE_REGEX, LICENSE_REGEX } = require('../middleware/validation');
const { logAudit } = require('../utils/auditLogger');

// REGISTER USER (Strict 5-field Registration: Name, Email, Password, Confirm Password, Role)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Check for prohibited extra fields in registration
    const allowedFields = ['name', 'email', 'password', 'confirmPassword', 'role'];
    const extraFields = Object.keys(req.body).filter((key) => !allowedFields.includes(key));
    if (extraFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Registration only accepts Name, Email, Password, Confirm Password, and Role. Please do not submit extraneous fields (${extraFields.join(', ')}).`,
      });
    }

    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ success: false, message: 'Full Name, Email, Password, Confirm Password, and Role are required' });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!NAME_REGEX.test(cleanName)) {
      return res.status(400).json({ success: false, message: 'Name must contain alphabets and spaces only (2-50 characters)' });
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid RFC-compliant email address' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password and Confirm Password do not match' });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain uppercase, lowercase, a digit, and a special character.',
      });
    }

    if (!['Admin', 'Fleet Manager', 'Driver', 'Service Center'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role selected' });
    }

    // Unique Email Check
    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists. Please login instead.' });
    }

    const newUser = new User({
      name: cleanName,
      email: cleanEmail,
      password,
      role,
      status: 'Active',
    });

    await newUser.save();

    await logAudit({
      user: cleanName,
      userEmail: cleanEmail,
      role,
      action: 'User Registered',
      module: 'Authentication',
      status: 'Success',
      next: `Registered as ${role}`,
      reason: 'New user self-registration',
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please log in with your credentials.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide email, password, and role' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      await logAudit({
        user: cleanEmail,
        userEmail: cleanEmail,
        role: role || 'Unknown',
        action: 'User Login Attempt',
        module: 'Authentication',
        status: 'Failed',
        reason: 'User not registered. Please register first.',
      });
      return res.status(401).json({ success: false, message: 'Account not found. Please register before logging in.' });
    }

    // Role check
    if (user.role.toLowerCase() !== role.toLowerCase()) {
      await logAudit({
        user: user.name,
        userEmail: user.email,
        role: user.role,
        action: 'User Login Attempt',
        module: 'Authentication',
        status: 'Failed',
        reason: `Role mismatch. Account role is '${user.role}' but tried logging in as '${role}'`,
      });
      return res.status(401).json({ success: false, message: `Access denied. Selected role '${role}' does not match registered account role '${user.role}'.` });
    }

    // Status check
    if (user.status === 'Blocked') {
      await logAudit({
        user: user.name,
        userEmail: user.email,
        role: user.role,
        action: 'User Login Attempt',
        module: 'Authentication',
        status: 'Failed',
        reason: 'Account is blocked',
      });
      return res.status(403).json({ success: false, message: 'Account is blocked. Please contact system administrator.' });
    }

    if (user.status === 'Inactive') {
      await logAudit({
        user: user.name,
        userEmail: user.email,
        role: user.role,
        action: 'User Login Attempt',
        module: 'Authentication',
        status: 'Failed',
        reason: 'Account is inactive',
      });
      return res.status(403).json({ success: false, message: 'Account is inactive. Please activate your account first.' });
    }

    // Password comparison
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await logAudit({
        user: user.name,
        userEmail: user.email,
        role: user.role,
        action: 'User Login Attempt',
        module: 'Authentication',
        status: 'Failed',
        reason: 'Incorrect password',
      });
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    await logAudit({
      user: user.name,
      userEmail: user.email,
      role: user.role,
      action: 'User Login',
      module: 'Authentication',
      status: 'Success',
      next: 'Session active',
      reason: 'User successfully authenticated',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        phone: user.phone,
        address: user.address,
        department: user.department,
        licenseNumber: user.licenseNumber,
        employeeId: user.employeeId,
        avatar: user.avatar,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET CURRENT USER PROFILE
const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE USER PROFILE (Real-Time Sync with MongoDB)
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, address, department, branch, licenseNumber, employeeId, avatar } = req.body;
    const prevVal = `${user.name} (${user.email})`;

    if (name) {
      if (!NAME_REGEX.test(name.trim())) {
        return res.status(400).json({ success: false, message: 'Name must contain alphabets and spaces only' });
      }
      user.name = name.trim();
    }

    if (phone !== undefined) {
      if (phone && !PHONE_REGEX.test(String(phone).trim())) {
        return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits starting with 6, 7, 8, or 9' });
      }
      user.phone = String(phone).trim();
    }

    if (licenseNumber !== undefined) {
      if (licenseNumber && !LICENSE_REGEX.test(licenseNumber.trim().toUpperCase())) {
        return res.status(400).json({ success: false, message: 'Driver license format is invalid' });
      }
      user.licenseNumber = licenseNumber.trim().toUpperCase();
    }

    if (address !== undefined) user.address = address.trim();
    if (department !== undefined) user.department = department.trim();
    if (branch !== undefined) user.branch = branch.trim();
    if (employeeId !== undefined) user.employeeId = employeeId.trim();
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    await logAudit({
      user: user.name,
      userEmail: user.email,
      role: user.role,
      action: 'Profile Updated',
      module: 'User Profile',
      status: 'Success',
      prev: prevVal,
      next: `${user.name} (${user.email})`,
      reason: 'User self-service profile update',
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL USERS (Admin)
const getUsers = async (req, res) => {
  try {
    const { role, search, status } = req.query;
    let query = {};

    if (role && role !== 'All' && role !== 'All Roles') {
      query.role = role;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { branch: searchRegex }, { phone: searchRegex }];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE USER (Admin)
const createUser = async (req, res) => {
  try {
    const errors = validateUserData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join('. ') });
    }

    const { name, email, password, role, branch, phone, licenseNumber, status } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: 'User with this email address already exists' });
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone: phone.trim() });
      if (existingPhone) {
        return res.status(409).json({ success: false, message: 'User with this phone number already exists' });
      }
    }

    if (licenseNumber) {
      const existingLicense = await User.findOne({ licenseNumber: licenseNumber.trim().toUpperCase() });
      if (existingLicense) {
        return res.status(409).json({ success: false, message: 'User with this driver license number already exists' });
      }
    }

    const newUser = new User({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: role || 'Driver',
      branch: branch || 'Head Office',
      phone: phone ? phone.trim() : '',
      licenseNumber: licenseNumber ? licenseNumber.trim().toUpperCase() : '',
      status: status || 'Active',
    });

    await newUser.save();

    await logAudit({
      user: req.user?.name || 'Admin',
      userEmail: req.user?.email || 'admin@fleetguard.com',
      role: req.user?.role || 'Admin',
      action: 'User Created',
      module: 'User Management',
      status: 'Success',
      next: `User ${newUser.name} (${newUser.role}) created`,
      reason: 'Admin onboarded new user',
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE USER (Admin)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const errors = validateUserData(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join('. ') });
    }

    const prevVal = `${user.name} (${user.role}, ${user.status})`;

    if (req.body.email && req.body.email.trim().toLowerCase() !== user.email) {
      const existingEmail = await User.findOne({ email: req.body.email.trim().toLowerCase() });
      if (existingEmail) {
        return res.status(409).json({ success: false, message: 'Email address already in use by another user' });
      }
      user.email = req.body.email.trim().toLowerCase();
    }

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.role) user.role = req.body.role;
    if (req.body.branch) user.branch = req.body.branch.trim();
    if (req.body.phone !== undefined) user.phone = String(req.body.phone).trim();
    if (req.body.licenseNumber !== undefined) user.licenseNumber = req.body.licenseNumber.trim().toUpperCase();
    if (req.body.status) user.status = req.body.status;

    if (req.body.password && req.body.password.length > 0) {
      user.password = req.body.password;
    }

    await user.save();

    await logAudit({
      user: req.user?.name || 'Admin',
      userEmail: req.user?.email || '',
      role: req.user?.role || 'Admin',
      action: 'User Updated',
      module: 'User Management',
      status: 'Success',
      prev: prevVal,
      next: `${user.name} (${user.role}, ${user.status})`,
      reason: 'User profile updated by admin',
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE USER (Admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'Driver') {
      const activeAssignments = await Assignment.find({ driverName: user.name, status: 'Active' });
      for (const assign of activeAssignments) {
        assign.status = 'Cancelled';
        assign.unassignedDate = new Date();
        await assign.save();

        await Vehicle.updateOne(
          { _id: assign.vehicleId },
          { $set: { status: 'Available', driverAssigned: 'Unassigned', assignedDriver: 'Unassigned' } }
        );
      }
    }

    await User.findByIdAndDelete(id);

    await logAudit({
      user: req.user?.name || 'Admin',
      userEmail: req.user?.email || '',
      role: req.user?.role || 'Admin',
      action: 'User Deleted',
      module: 'User Management',
      status: 'Success',
      prev: `User ${user.name} (${user.role})`,
      next: 'Deleted',
      reason: 'Admin deleted user account',
    });

    res.status(200).json({
      success: true,
      message: 'User deleted and active driver assignments unassigned',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE USER STATUS (Admin)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Inactive', 'Blocked'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be Active, Inactive, or Blocked.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const prevStatus = user.status;
    user.status = status;
    await user.save();

    await logAudit({
      user: req.user?.name || 'Admin',
      userEmail: req.user?.email || '',
      role: req.user?.role || 'Admin',
      action: 'User Status Updated',
      module: 'User Management',
      status: 'Success',
      prev: `Status: ${prevStatus}`,
      next: `Status: ${status}`,
      reason: `User account set to ${status}`,
    });

    res.status(200).json({
      success: true,
      message: `User status changed to ${status}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user?.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New password and confirm password do not match' });
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long and contain uppercase, lowercase, a digit, and a special character.',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    await logAudit({
      user: user.name,
      userEmail: user.email,
      role: user.role,
      action: 'Password Changed',
      module: 'Authentication',
      status: 'Success',
      reason: 'User changed account password',
    });

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  changePassword,
};
