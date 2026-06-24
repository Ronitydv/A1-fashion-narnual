const express = require('express');
const router = express.Router();
const { readOrders, writeOrders, readProducts, writeProducts, readUsers, writeUsers } = require('../config/db');
const { protect, isAdmin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order, decrement inventory, increment salesCount, handle wallet payments
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount, shippingDetails, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order.' });
    }

    // 1. If paying with Wallet, verify balance and deduct
    if (paymentMethod === 'A1 Wallet') {
      const users = readUsers();
      const userIdx = users.findIndex(u => u.id === req.user.id);
      if (userIdx === -1) {
        return res.status(404).json({ message: 'User not found.' });
      }

      if (users[userIdx].walletBalance < totalAmount) {
        return res.status(400).json({ message: 'Insufficient wallet balance.' });
      }
      
      // Deduct balance and add transaction log
      users[userIdx].walletBalance -= totalAmount;
      users[userIdx].walletTransactions.unshift({
        date: new Date().toLocaleDateString(),
        desc: `Checkout Purchase (Order Total)`,
        amount: totalAmount,
        type: 'debit'
      });
      writeUsers(users);
    }

    // 2. Decrement product stock, increment salesCount
    const products = readProducts();
    for (const item of items) {
      const prodIdx = products.findIndex(p => p.id === item.id);
      if (prodIdx >= 0) {
        products[prodIdx].inStock = Math.max(0, products[prodIdx].inStock - item.quantity);
        products[prodIdx].salesCount = (products[prodIdx].salesCount || 0) + item.quantity;
      }
    }
    writeProducts(products);

    // 3. Create unique Order ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `A1-${randomSuffix}`;

    const orders = readOrders();
    const newOrder = {
      id: 'o_' + Date.now().toString(),
      orderId,
      userId: req.user.id,
      items,
      totalAmount,
      shippingDetails,
      paymentMethod,
      paymentStatus: 'Paid',
      paymentId: 'TXN-' + Math.floor(100000000 + Math.random() * 900000000),
      status: 'Processing',
      date: new Date().toLocaleDateString()
    };

    orders.unshift(newOrder);
    writeOrders(orders);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/history
// @desc    Get logged in user order history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const orders = readOrders();
    const userOrders = orders.filter(o => o.userId === req.user.id);
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/track/:orderId
// @desc    Track a shipment by ID
// @access  Public
router.get('/track/:orderId', async (req, res) => {
  try {
    const orders = readOrders();
    const order = orders.find(o => o.orderId.toUpperCase() === req.params.orderId.toUpperCase());
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:orderId/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:orderId/status', protect, isAdmin, async (req, res) => {
  try {
    const orders = readOrders();
    const idx = orders.findIndex(o => o.orderId === req.params.orderId);

    if (idx === -1) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    orders[idx].status = req.body.status;
    writeOrders(orders);

    res.json(orders[idx]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
