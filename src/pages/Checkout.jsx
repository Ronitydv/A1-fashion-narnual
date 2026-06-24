import React, { useState } from 'react';
import { Lock, UserCheck, ShieldAlert, ArrowLeft, Loader } from 'lucide-react';

export default function Checkout({
  cart,
  appliedCoupon,
  user,
  onOpenLogin,
  onOpenPayment,
  setActivePage,
  onPlaceOrderOffline
}) {
  const [billingDetails, setBillingDetails] = useState({
    firstName: user?.name ? user.name.split(' ')[0] : '',
    lastName: user?.name ? user.name.split(' ')[1] || '' : '',
    address: '102, Premium Heights, Link Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400053',
    phone: user?.phone || '9999999999',
    email: user?.email || 'customer@a1fashion.in',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = (subtotal >= 2500 || (appliedCoupon && appliedCoupon.freeShipping)) ? 0 : 150;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent > 0) {
      discountAmount = Math.round(subtotal * (appliedCoupon.discountPercent / 100));
    }
  }
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

  if (cart.length === 0) {
    return (
      <div className="container text-center section-padding">
        <h3>Your shopping bag is empty</h3>
        <p>You cannot checkout with an empty bag.</p>
        <button className="btn-primary" onClick={() => setActivePage('shop')}>Back to Shop</button>
      </div>
    );
  }

  const handleInputChange = (field, val) => {
    setBillingDetails(prev => ({ ...prev, [field]: val }));
  };

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      onOpenLogin();
      return;
    }

    // Field validation
    const tempErrors = {};
    if (!billingDetails.firstName) tempErrors.firstName = 'Required';
    if (!billingDetails.address) tempErrors.address = 'Required';
    if (!billingDetails.phone || billingDetails.phone.length < 10) tempErrors.phone = '10-digit Phone Required';
    if (!billingDetails.email) tempErrors.email = 'Required';
    
    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      alert('Please fill out all required billing fields.');
      return;
    }

    setErrors({});
    
    // Open payment gateway simulator
    onOpenPayment(grandTotal, billingDetails);
  };

  return (
    <div className="checkout-page container animate-fade">
      <div className="checkout-header text-left">
        <button onClick={() => setActivePage('cart')} className="checkout-back-link">
          <ArrowLeft size={14} /> Back to Bag
        </button>
        <h1>Secure Checkout</h1>
        <p>Complete your delivery details to finish your order.</p>
      </div>

      <div className="checkout-layout">
        {/* Left Column: Billing Form & Login Gate */}
        <div className="checkout-left-col text-left">
          {!user ? (
            <div className="checkout-login-gate-card">
              <ShieldAlert size={36} color="var(--color-accent-orange)" className="gate-icon" />
              <h3>Authentication Required</h3>
              <p>Please login or verify your mobile number to complete your purchase. We save your order history and tracking details in your profile.</p>
              <button className="btn-primary Gate-btn" onClick={onOpenLogin}>
                Sign In / Verify OTP
              </button>
            </div>
          ) : (
            <div className="checkout-auth-success-badge">
              <UserCheck size={18} />
              <span>Logged in as <strong>{user.name}</strong> ({user.phone}). Shipping details preloaded.</span>
            </div>
          )}

          <form onSubmit={handlePlaceOrderSubmit} className={`billing-form ${!user ? 'dimmed-form' : ''}`}>
            <h3>Delivery & Billing Address</h3>
            
            <div className="form-row-2">
              <div className="checkout-input-group">
                <label>First Name *</label>
                <input
                  type="text"
                  placeholder="Rohan"
                  value={billingDetails.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!user}
                  required
                />
                {errors.firstName && <span className="err-msg">{errors.firstName}</span>}
              </div>
              <div className="checkout-input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Sharma"
                  value={billingDetails.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!user}
                />
              </div>
            </div>

            <div className="checkout-input-group">
              <label>Street Address *</label>
              <input
                type="text"
                placeholder="Apartment/Suite, Road, Area"
                value={billingDetails.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!user}
                required
              />
              {errors.address && <span className="err-msg">{errors.address}</span>}
            </div>

            <div className="form-row-3">
              <div className="checkout-input-group">
                <label>City *</label>
                <input
                  type="text"
                  placeholder="Mumbai"
                  value={billingDetails.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!user}
                  required
                />
              </div>
              <div className="checkout-input-group">
                <label>State *</label>
                <input
                  type="text"
                  placeholder="Maharashtra"
                  value={billingDetails.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  disabled={!user}
                  required
                />
              </div>
              <div className="checkout-input-group">
                <label>Pincode / ZIP *</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="400001"
                  value={billingDetails.zip}
                  onChange={(e) => handleInputChange('zip', e.target.value.replace(/\D/g, ''))}
                  disabled={!user}
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="checkout-input-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit number"
                  value={billingDetails.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                  disabled={!user}
                  required
                />
                {errors.phone && <span className="err-msg">{errors.phone}</span>}
              </div>
              <div className="checkout-input-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="rohan@gmail.com"
                  value={billingDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!user}
                  required
                />
                {errors.email && <span className="err-msg">{errors.email}</span>}
              </div>
            </div>

            <div className="checkout-input-group">
              <label>Delivery Instructions / Order Notes</label>
              <textarea
                rows={3}
                placeholder="Leave package at the door, call before delivery, etc."
                value={billingDetails.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                disabled={!user}
              />
            </div>

            {user && (
              <button type="submit" className="btn-primary checkout-pay-btn">
                <Lock size={16} /> Place Order & Pay (₹{grandTotal.toLocaleString('en-IN')})
              </button>
            )}
          </form>
        </div>

        {/* Right Column: Order Review Panel */}
        <div className="checkout-right-col text-left">
          <div className="checkout-order-review-box">
            <h3>Order Review</h3>
            
            {/* Items scroll */}
            <div className="review-items-list">
              {cart.map((item, idx) => (
                <div key={idx} className="review-item-card">
                  <img src={item.image} alt={item.title} className="review-thumb" />
                  <div className="review-meta">
                    <h4>{item.title}</h4>
                    <span>Size: {item.size} | Qty: {item.quantity}</span>
                    <strong className="review-price-text">₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Summary */}
            <div className="review-totals-block">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedCoupon && (
                <div className="summary-row discount-row">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping Fees</span>
                <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
              </div>
              <div className="summary-row grand-total-row">
                <span>Grand Total</span>
                <span className="total-amount-large">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="checkout-trust-badge">
              <Lock size={14} /> 256-bit SSL Encrypted Connection
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-page {
          padding-top: 30px;
        }

        .checkout-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--color-body);
          margin-bottom: 20px;
        }

        .checkout-back-link:hover {
          color: var(--color-primary);
        }

        .checkout-header h1 {
          font-family: var(--font-serif);
          font-size: 32px;
          margin-bottom: 8px;
        }

        .checkout-header p {
          font-size: 14px;
          color: var(--color-body);
          margin-bottom: 40px;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
        }

        .checkout-left-col {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .checkout-login-gate-card {
          background-color: #fffaf5;
          border: 1px solid #ffe7d3;
          border-radius: var(--border-radius-lg);
          padding: 30px 24px;
          text-align: center;
        }

        .gate-icon {
          margin-bottom: 15px;
        }

        .checkout-login-gate-card h3 {
          font-size: 18px;
          margin-bottom: 8px;
          color: var(--color-heading);
        }

        .checkout-login-gate-card p {
          font-size: 13px;
          line-height: 1.5;
          color: var(--color-body-dark);
          margin-bottom: 20px;
        }

        .Gate-btn {
          margin: 0 auto;
        }

        .checkout-auth-success-badge {
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          padding: 12px 15px;
          border-radius: var(--border-radius-sm);
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .billing-form {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          padding: 30px;
        }

        .dimmed-form {
          opacity: 0.5;
          pointer-events: none;
          user-select: none;
        }

        .billing-form h3 {
          font-size: 18px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 12px;
          margin-bottom: 20px;
        }

        .checkout-input-group {
          margin-bottom: 15px;
        }

        .checkout-input-group label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--color-heading);
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .checkout-input-group input, .checkout-input-group textarea {
          width: 100%;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          padding: 10px 12px;
          font-size: 13px;
          background-color: var(--color-bg-light);
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
        }

        .err-msg {
          font-size: 11px;
          color: var(--color-danger);
          font-weight: 600;
          margin-top: 4px;
          display: block;
        }

        .checkout-pay-btn {
          width: 100%;
          justify-content: center;
          margin-top: 15px;
          padding: 14px;
          font-size: 15px;
        }

        /* Order Review Box */
        .checkout-order-review-box {
          background-color: var(--color-bg-light);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          position: sticky;
          top: 180px;
        }

        .checkout-order-review-box h3 {
          font-size: 16px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 12px;
          margin-bottom: 15px;
        }

        .review-items-list {
          max-height: 250px;
          overflow-y: auto;
          margin-bottom: 20px;
          padding-right: 5px;
        }

        .review-item-card {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          border-bottom: 1px dashed var(--color-border);
          padding-bottom: 12px;
        }

        .review-thumb {
          width: 50px;
          height: 50px;
          border-radius: var(--border-radius-sm);
          object-fit: cover;
          background-color: white;
        }

        .review-meta h4 {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-heading);
          margin-bottom: 2px;
        }

        .review-meta span {
          font-size: 11px;
          color: var(--color-body);
          display: block;
        }

        .review-price-text {
          font-size: 13px;
          color: var(--color-primary);
          display: block;
          margin-top: 2px;
        }

        .review-totals-block {
          border-top: 1px solid var(--color-border);
          padding-top: 15px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 10px;
          color: var(--color-body-dark);
        }

        .discount-row {
          color: var(--color-primary);
          font-weight: 600;
        }

        .grand-total-row {
          border-top: 1px solid var(--color-border);
          padding-top: 12px;
          margin-top: 12px;
          font-weight: 800;
        }

        .total-amount-large {
          font-size: 18px;
          color: var(--color-primary);
        }

        .checkout-trust-badge {
          text-align: center;
          font-size: 10px;
          color: #999;
          margin-top: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        /* Mobile views */
        @media (max-width: 1024px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .form-row-2, .form-row-3 {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .billing-form {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
