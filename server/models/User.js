const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  email: { type: String, unique: true, sparse: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  walletBalance: { type: Number, default: 5000 }, // Seeded with ₹5000 welcome credits
  walletTransactions: [{
    date: { type: String, default: () => new Date().toLocaleDateString() },
    desc: String,
    amount: Number,
    type: { type: String, enum: ['credit', 'debit'] }
  }]
});

module.exports = mongoose.model('User', UserSchema);
