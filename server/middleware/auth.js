const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'fleetguard_super_secret_jwt_key_2026';

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers.cookie) {
      const match = req.headers.cookie.match(/token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Check user account status in database if DB is connected
    if (mongoose.connection.readyState === 1) {
      const User = mongoose.models.User || require('../models/User');
      const dbUser = await User.findById(decoded.id || decoded.userId).lean();
      if (dbUser) {
        if (dbUser.status === 'Blocked') {
          return res.status(403).json({ success: false, message: 'Account is blocked. Access denied.' });
        }
        if (dbUser.status === 'Inactive') {
          return res.status(403).json({ success: false, message: 'Account is inactive. Access denied.' });
        }
        req.user.name = dbUser.name;
        req.user.role = dbUser.role;
        req.user.email = dbUser.email;
      }
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token. Authentication failed.' });
  }
};

const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Authentication required.' });
    }

    const userRole = req.user.role;
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${userRole}' is not authorized to access this resource.`
      });
    }

    next();
  };
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  verifyToken,
  requireRole,
  generateToken,
  JWT_SECRET
};
