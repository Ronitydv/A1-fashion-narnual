const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { readUsers, writeUsers } = require('../config/db');

// Helper to sign JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'a1_fashion_secret_key_2026_safe', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/send-otp
// @desc    Simulate sending OTP SMS
// @access  Public
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ message: 'Invalid 10-digit mobile number.' });
  }

  console.log(`[OTP Verification] Sending SMS to +91 ${phone}. Code: 1234`);
  res.json({ success: true, message: 'OTP sent successfully! Enter 1234 to verify.' });
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and log user in / register
// @access  Public
router.post('/verify-otp', async (req, res) => {
  const { phone, code } = req.body;

  if (code !== '1234') {
    return res.status(400).json({ message: 'Invalid OTP code. Please use 1234.' });
  }

  try {
    const users = readUsers();
    let user = users.find(u => u.phone === phone);

    if (!user) {
      const role = phone === '9999999999' ? 'admin' : 'customer';
      user = {
        id: phone === '9999999999' ? 'u_admin' : 'u_' + Date.now().toString(),
        name: phone === '9999999999' ? 'Owner Admin' : `User +91${phone.slice(-4)}`,
        phone,
        email: phone === '9999999999' ? 'admin@a1fashion.in' : `${phone}@a1user.com`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role,
        walletBalance: 5000,
        walletTransactions: [{ date: new Date().toLocaleDateString(), desc: 'Welcome Bonus', amount: 5000, type: 'credit' }]
      };
      users.push(user);
      writeUsers(users);
    }

    res.json({
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/google
// @desc    Simulate Google Sign-In
// @access  Public
router.post('/google', async (req, res) => {
  const { name, email, avatar, phone } = req.body;

  try {
    const users = readUsers();
    let user = users.find(u => u.email === email);

    if (!user) {
      user = {
        id: 'u_' + Date.now().toString(),
        name: name || 'Google User',
        email: email,
        phone: phone || '9' + Math.floor(100000000 + Math.random() * 900000000),
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'customer',
        walletBalance: 5000,
        walletTransactions: [{ date: new Date().toLocaleDateString(), desc: 'Welcome Bonus', amount: 5000, type: 'credit' }]
      };
      users.push(user);
      writeUsers(users);
    }

    res.json({
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
