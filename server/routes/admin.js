const express = require('express');
const router = express.Router();
const { readOrders, readProducts, readCoupons, writeCoupons, readUsers, writeUsers } = require('../config/db');
const { protect, isAdmin } = require('../middleware/auth');

// @route   GET /api/admin/analytics
// @desc    Retrieve sales and inventory analytics summary
// @access  Private/Admin
router.get('/analytics', protect, isAdmin, async (req, res) => {
  try {
    const orders = readOrders();
    const products = readProducts();

    // Calculate total delivered revenue
    const totalSales = orders
      .filter(o => o.status === 'Delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Bestseller category counts
    const categorySales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const cat = item.category || 'general';
        categorySales[cat] = (categorySales[cat] || 0) + item.quantity;
      });
    });

    let bestCategory = 'None';
    let maxQty = 0;
    Object.entries(categorySales).forEach(([cat, qty]) => {
      if (qty > maxQty) {
        maxQty = qty;
        bestCategory = cat;
      }
    });

    // Check low stock count
    const lowStockAlerts = products.filter(p => p.inStock <= 5).map(p => ({
      id: p.id,
      title: p.title,
      inStock: p.inStock
    }));

    res.json({
      totalSales,
      ordersCount: orders.length,
      productsCount: products.length,
      bestCategory,
      lowStockAlerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/coupons
// @desc    Get all promo codes
// @access  Private/Admin
router.get('/coupons', protect, isAdmin, async (req, res) => {
  try {
    const coupons = readCoupons();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/coupons
// @desc    Create a promo code with start/end date bounds
// @access  Private/Admin
router.post('/coupons', protect, isAdmin, async (req, res) => {
  try {
    const { code, discountPercent, freeShipping, minPurchase, startDate, endDate } = req.body;
    const coupons = readCoupons();

    const newCoupon = {
      id: Date.now().toString(),
      code: code.toUpperCase(),
      discountPercent: Number(discountPercent),
      freeShipping: freeShipping || false,
      minPurchase: Number(minPurchase || 0),
      startDate,
      endDate
    };

    coupons.push(newCoupon);
    writeCoupons(coupons);

    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/coupons/:id
// @desc    Delete a promo code
// @access  Private/Admin
router.delete('/coupons/:id', protect, isAdmin, async (req, res) => {
  try {
    let coupons = readCoupons();
    coupons = coupons.filter(c => c.id !== req.params.id);
    writeCoupons(coupons);
    res.json({ message: 'Coupon deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/coupons/validate
// @desc    Validate a promo code with active date limit enforcement
// @access  Public
router.post('/coupons/validate', async (req, res) => {
  const { code, subtotal } = req.body;

  try {
    const coupons = readCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
      return res.status(400).json({ message: 'Invalid promo code.' });
    }

    // Check minimum purchase
    if (subtotal < coupon.minPurchase) {
      return res.status(400).json({ message: `Minimum purchase of ₹${coupon.minPurchase.toLocaleString('en-IN')} required.` });
    }

    // Enforce active dates validation
    const currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    if (currentDate < coupon.startDate) {
      return res.status(400).json({ message: `This coupon code is not active yet. Valid from ${coupon.startDate}.` });
    }

    if (currentDate > coupon.endDate) {
      return res.status(400).json({ message: `This coupon code has expired on ${coupon.endDate}.` });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/wallet/redeem
// @desc    Verify and redeem gift vouchers for active users
// @access  Private
router.post('/wallet/redeem', protect, async (req, res) => {
  const { code } = req.body;

  if (code.toUpperCase() !== 'A1GIFT') {
    return res.status(400).json({ message: 'Invalid voucher code.' });
  }

  try {
    const users = readUsers();
    const idx = users.findIndex(u => u.id === req.user.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent double redeemed
    const alreadyRedeemed = users[idx].walletTransactions.some(t => t.desc === 'A1GIFT Voucher Redeemed');
    if (alreadyRedeemed) {
      return res.status(400).json({ message: 'This voucher has already been redeemed on your account.' });
    }

    // Credit ₹1,000
    users[idx].walletBalance += 1000;
    users[idx].walletTransactions.unshift({
      date: new Date().toLocaleDateString(),
      desc: 'A1GIFT Voucher Redeemed',
      amount: 1000,
      type: 'credit'
    });
    
    writeUsers(users);

    res.json({
      balance: users[idx].walletBalance,
      transactions: users[idx].walletTransactions,
      message: 'Gift voucher successfully redeemed!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
