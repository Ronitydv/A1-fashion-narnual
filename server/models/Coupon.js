const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true, uppercase: true },
  discountPercent: { type: Number, default: 0 },
  freeShipping: { type: Boolean, default: false },
  minPurchase: { type: Number, default: 0 },
  startDate: { type: String, required: true }, // Format YYYY-MM-DD
  endDate: { type: String, required: true }   // Format YYYY-MM-DD
});

module.exports = mongoose.model('Coupon', CouponSchema);
