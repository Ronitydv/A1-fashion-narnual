const jwt = require('jsonwebtoken');
const { readUsers } = require('../config/db');
const { clerkClient } = require('@clerk/clerk-sdk-node');

// Protect routes - verify token (supports custom JWT and Clerk JWT)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      let userId;

      // Decode token to inspect the issuer
      const decodedNoVerify = jwt.decode(token);

      if (decodedNoVerify && decodedNoVerify.iss && decodedNoVerify.iss.includes('clerk')) {
        // This is a Clerk token
        if (process.env.CLERK_SECRET_KEY) {
          try {
            const session = await clerkClient.verifyToken(token);
            userId = session.sub; // Clerk User ID
          } catch (clerkErr) {
            console.error("Clerk Token Verification Failed:", clerkErr.message);
            return res.status(401).json({ message: 'Not authorized, Clerk token verification failed.' });
          }
        } else {
          // Dev mode fallback: trust decoded token if Clerk secret key is not set
          userId = decodedNoVerify.sub;
        }
      } else {
        // This is our custom JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a1_fashion_secret_key_2026_safe');
        userId = decoded.id;
      }

      // Get user from database cache
      const users = readUsers();
      const user = users.find(u => u.id === userId);

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user profile not found.' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
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
