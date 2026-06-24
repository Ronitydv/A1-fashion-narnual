const jwt = require('jsonwebtoken');
const { readUsers } = require('../config/db');

// Protect routes - verify token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a1_fashion_secret_key_2026_safe');

      // Get user from JSON DB
      const users = readUsers();
      const user = users.find(u => u.id === decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user profile not found.' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, session token invalid or expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no security token provided.' });
  }
};

// Admin role check middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Admin authorization required.' });
  }
};

module.exports = { protect, isAdmin };
