const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    price: Number,
    image: String,
    size: String,
    color: String,
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  shippingDetails: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    email: String,
    notes: String
  },
  paymentMethod: { type: String, default: 'Online UPI/Card Secure pay' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Paid' },
  paymentId: { type: String, default: () => 'TXN-' + Math.floor(100000000 + Math.random() * 900000000) },
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered'], default: 'Processing' },
  date: { type: String, default: () => new Date().toLocaleDateString() }
});

module.exports = mongoose.model('Order', OrderSchema);
