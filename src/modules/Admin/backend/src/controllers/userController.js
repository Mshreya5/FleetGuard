const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').lean();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load users', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, branch, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password, role, branch, phone });
    const { password: _, ...userObj } = user.toObject();
    return res.status(201).json({ message: 'User created successfully', user: userObj });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role, branch, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, branch, phone },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Active or Inactive' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User status updated', user });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user status', error: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser, updateUserStatus };
