const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fleetguard_super_secret_jwt_key_2026';

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      console.warn('[Auth Middleware Warning]: Invalid or expired token:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no bearer token passed, continue gracefully or allow public routes
  next();
};

const generateToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, JWT_SECRET, { expiresIn: '30d' });
};

module.exports = { protect, generateToken, JWT_SECRET };
