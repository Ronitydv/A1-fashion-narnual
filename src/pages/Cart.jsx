import React, { useState } from 'react';
import { Trash2, ArrowRight, Percent, Loader } from 'lucide-react';
import { validateCoupon } from '../utils/db';

export default function Cart({
  cart,
  onUpdateCartQty,
  onRemoveFromCart,
  appliedCoupon,
  onApplyCoupon,
  setActivePage
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  // Subtotals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Standard Delivery Charge
  const deliveryCharge = (subtotal >= 2500 || (appliedCoupon && appliedCoupon.freeShipping)) ? 0 : 150;
  
  // Calculate discount value
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent > 0) {
      discountAmount = Math.round(subtotal * (appliedCoupon.discountPercent / 100));
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponInput) return;
    
    setCouponLoading(true);
    try {
      const coupon = await validateCoupon(couponInput.trim(), subtotal);
      setCouponLoading(false);
      onApplyCoupon(coupon);
      setCouponSuccess(`Coupon "${coupon.code}" applied successfully! (${coupon.discountPercent}% Off)`);
    } catch (err) {
      setCouponLoading(false);
      setCouponError(err.message || 'Invalid or expired coupon.');
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponSuccess('');
    setCouponInput('');
  };

  return (
    <div className="cart-page container animate-fade">
      <div className="cart-header text-left">
        <h1>Shopping Bag</h1>
        <p>Review the details of the items in your bag before proceeding to checkout.</p>
      </div>

      {cart.length > 0 ? (
        <div className="cart-layout">
          {/* Left Column: Items List */}
          <div className="cart-left-col">
            {/* Desktop Table */}
            <div className="cart-table-container">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product Details</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={`${item.id}-${item.size}-${item.color}`}>
                      <td className="cart-prod-cell">
                        <img src={item.image} alt={item.title} className="cart-thumb" />
                        <div className="cart-meta text-left">
                          <span className="cart-cat">{item.category}</span>
                          <h4>{item.title}</h4>
                          <span className="cart-variant">Size: <strong>{item.size}</strong> | Color: <strong>{item.color}</strong></span>
                        </div>
                      </td>
                      <td>₹{item.price.toLocaleString('en-IN')}</td>
                      <td>
                        <div className="cart-qty-adjuster">
                          <button onClick={() => onUpdateCartQty(idx, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => onUpdateCartQty(idx, item.quantity + 1)}>+</button>
                        </div>
                      </td>
                      <td><strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong></td>
                      <td>
                        <button className="cart-delete-btn" onClick={() => onRemoveFromCart(idx)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card list */}
            <div className="cart-mobile-cards">
              {cart.map((item, idx) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="cart-mobile-card">
                  <div className="cart-mobile-upper">
                    <img src={item.image} alt={item.title} className="cart-thumb-mobile" />
                    <div className="cart-mobile-meta text-left">
                      <span className="cart-cat">{item.category}</span>
                      <h4>{item.title}</h4>
                      <span className="cart-variant">Size: {item.size} | Color: {item.color}</span>
                      <strong className="cart-price-mobile">₹{item.price.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                  <div className="cart-mobile-lower">
                    <div className="cart-qty-adjuster">
                      <button onClick={() => onUpdateCartQty(idx, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onUpdateCartQty(idx, item.quantity + 1)}>+</button>
                    </div>
                    <button className="mobile-remove-link" onClick={() => onRemoveFromCart(idx)}>
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Form */}
            <div className="coupon-form-box text-left">
              <h3>Apply Promo Code</h3>
              <p>Sign up discount: WELCOME10 | Bulk discount: A1STYLE (Orders &gt; ₹1,999)</p>
              
              {appliedCoupon ? (
                <div className="applied-coupon-display">
                  <Percent size={16} />
                  <span>Promo Code <strong>{appliedCoupon.code}</strong> is active ({appliedCoupon.discountPercent > 0 ? `${appliedCoupon.discountPercent}% Off` : 'Free Delivery'}).</span>
                  <button type="button" className="remove-coupon-btn" onClick={handleRemoveCoupon}>Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-form-inputs">
                  <input
                    type="text"
                    placeholder="Enter Code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    required
                  />
                  <button type="submit" disabled={couponLoading}>
                    {couponLoading ? <Loader className="spin" size={16} /> : 'Apply'}
                  </button>
                </form>
              )}

              {couponError && <div className="coupon-error-txt">{couponError}</div>}
              {couponSuccess && <div className="coupon-success-txt">{couponSuccess}</div>}
            </div>
          </div>

          {/* Right Column: Totals summary */}
          <div className="cart-right-col">
            <div className="cart-totals-summary-box text-left">
              <h3>Cart Summary</h3>
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
                <span>Estimated Delivery</span>
                <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
              </div>
              <div className="summary-row grand-total-row">
                <span>Total (in ₹)</span>
                <span className="total-amount-large">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="free-shipping-progress">
                {subtotal < 2500 ? (
                  <p>Add <strong>₹{(2500 - subtotal).toLocaleString('en-IN')}</strong> more to unlock <strong>FREE Delivery</strong>!</p>
                ) : (
                  <p className="unlocked-msg">🎉 Free Shipping unlocked on your order!</p>
                )}
              </div>

              <button className="btn-primary checkout-action-btn" onClick={() => setActivePage('checkout')}>
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart-state text-center animate-fade">
          <div className="ambient-background-card">
            {/* SVG Animated Viewport (Background) */}
            <div className="ambient-svg-bg">
              <svg className="cart-svg-animation" viewBox="0 0 400 250" style={{ width: '100%', height: '100%', opacity: 0.35 }}>
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Bouncing Oops Text */}
                <text x="50%" y="30%" className="oops-animated-text" textAnchor="middle">OOPS!</text>
                
                {/* Hanger / Clothes Animation */}
                <g className="drifting-clothes">
                  {/* Hanger */}
                  <path d="M 180,105 Q 200,85 220,105 L 230,130 L 170,130 Z" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 200,85 C 200,75 210,75 210,80" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
                  {/* T-Shirt */}
                  <path d="M 160,130 L 175,130 L 180,140 L 220,140 L 225,130 L 240,130 L 235,180 L 165,180 Z" fill="rgba(8, 129, 120, 0.2)" stroke="var(--color-primary)" strokeWidth="2" />
                </g>

                {/* Empty Shopping Bag */}
                <g className="bouncing-bag">
                  <path d="M 170,130 L 230,130 L 240,210 L 160,210 Z" fill="rgba(255,255,255,0.08)" stroke="white" strokeWidth="3" />
                  <path d="M 185,130 C 185,110 215,110 215,130" fill="none" stroke="white" strokeWidth="3" />
                  {/* A1 Logo on Bag */}
                  <text x="200" y="180" className="bag-logo" textAnchor="middle">A1</text>
                </g>
              </svg>
            </div>

            {/* Foreground Content */}
            <div className="card-foreground-content">
              <span className="error-badge-premium">404 BAG EMPTY</span>
              <h2 className="empty-title-premium">Your shopping bag is completely empty!</h2>
              <p className="empty-desc-premium">Add some premium men's collections to get started on your style upgrade.</p>
              <button className="btn-primary-premium" onClick={() => setActivePage('shop')}>
                Go to Shop Catalog
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cart-page {
          padding-top: 40px;
        }

        .cart-header h1 {
          font-family: var(--font-serif);
          font-size: 32px;
          margin-bottom: 8px;
        }

        .cart-header p {
          font-size: 14px;
          color: var(--color-body);
          margin-bottom: 40px;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 40px;
        }

        .cart-left-col {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .cart-table-container {
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          background: white;
        }

        .cart-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .cart-table th, .cart-table td {
          padding: 15px 20px;
          border-bottom: 1px solid var(--color-border);
          font-size: 14px;
        }

        .cart-table th {
          background-color: var(--color-bg-light);
          color: var(--color-heading);
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
        }

        .cart-prod-cell {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .cart-thumb {
          width: 60px;
          height: 60px;
          border-radius: var(--border-radius-sm);
          object-fit: cover;
          background-color: var(--color-bg-light);
        }

        .cart-meta h4 {
          font-size: 14px;
          color: var(--color-heading);
          font-weight: 600;
        }

        .cart-cat {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--color-body);
          display: block;
          margin-bottom: 3px;
        }

        .cart-variant {
          font-size: 11px;
          color: var(--color-body-dark);
        }

        .cart-qty-adjuster {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          overflow: hidden;
          width: fit-content;
          background-color: var(--color-bg-light);
        }

        .cart-qty-adjuster button {
          padding: 5px 12px;
          font-weight: 700;
          background-color: white;
        }

        .cart-qty-adjuster span {
          padding: 0 10px;
          font-weight: 600;
          font-size: 13px;
        }

        .cart-delete-btn {
          color: var(--color-body);
          transition: var(--transition-fast);
          padding: 5px;
        }

        .cart-delete-btn:hover {
          color: var(--color-danger);
          transform: scale(1.1);
        }

        .coupon-form-box {
          background-color: var(--color-bg-light);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          padding: 24px;
        }

        .coupon-form-box h3 {
          font-size: 16px;
          margin-bottom: 5px;
        }

        .coupon-form-box p {
          font-size: 12px;
          color: var(--color-body);
          margin-bottom: 15px;
        }

        .coupon-form-inputs {
          display: flex;
          max-width: 320px;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          background: white;
        }

        .coupon-form-inputs input {
          flex: 1;
          border: none;
          padding: 10px 12px;
          font-size: 13px;
        }

        .coupon-form-inputs button {
          background-color: var(--color-primary);
          color: white;
          padding: 0 20px;
          font-weight: 600;
          font-size: 13px;
        }

        .applied-coupon-display {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          padding: 8px 15px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
        }

        .remove-coupon-btn {
          color: var(--color-danger);
          text-decoration: underline;
          margin-left: 10px;
        }

        .coupon-error-txt {
          color: var(--color-danger);
          font-size: 12px;
          margin-top: 8px;
          font-weight: 600;
        }

        .coupon-success-txt {
          color: var(--color-success);
          font-size: 12px;
          margin-top: 8px;
          font-weight: 600;
        }

        /* Totals Box */
        .cart-totals-summary-box {
          background-color: var(--color-bg-light);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          padding: 30px 24px;
          position: sticky;
          top: 180px;
        }

        .cart-totals-summary-box h3 {
          font-size: 18px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 15px;
          margin-bottom: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 12px;
          color: var(--color-body-dark);
        }

        .discount-row {
          color: var(--color-primary);
          font-weight: 600;
        }

        .grand-total-row {
          border-top: 1px solid var(--color-border);
          padding-top: 15px;
          margin-top: 15px;
          font-weight: 800;
          color: var(--color-heading);
        }

        .total-amount-large {
          font-size: 20px;
          color: var(--color-primary);
        }

        .free-shipping-progress {
          background-color: white;
          padding: 10px 15px;
          border-radius: 4px;
          border: 1px solid var(--color-border);
          font-size: 11px;
          margin: 20px 0;
          text-align: center;
        }

        .unlocked-msg {
          color: var(--color-primary);
          font-weight: 700;
        }

        .checkout-action-btn {
          width: 100%;
          justify-content: center;
        }

        .empty-cart-state {
          padding: 60px 20px;
          background-color: var(--color-bg-light);
          border-radius: var(--border-radius-lg);
          border: 1px dashed var(--color-border);
        }

        .animated-empty-cart {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: white;
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          animation: bounceCart 2s ease-in-out infinite;
        }

        .bouncing-cart-icon {
          font-size: 36px;
        }

        @keyframes bounceCart {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .empty-cart-state h3 {
          font-size: 22px;
          margin-bottom: 8px;
        }

        .empty-cart-state p {
          font-size: 14px;
          color: var(--color-body);
          margin-bottom: 25px;
        }

        /* Mobile Adjustments */
        .cart-mobile-cards {
          display: none;
        }

        @media (max-width: 1024px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .cart-table-container {
            display: none;
          }
          .cart-mobile-cards {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          .cart-mobile-card {
            background-color: white;
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius-md);
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .cart-mobile-upper {
            display: flex;
            gap: 15px;
          }
          .cart-thumb-mobile {
            width: 75px;
            height: 75px;
            border-radius: var(--border-radius-sm);
            object-fit: cover;
            background-color: var(--color-bg-light);
          }
          .cart-mobile-meta h4 {
            font-size: 13px;
            font-weight: 600;
          }
          .cart-price-mobile {
            color: var(--color-primary);
            font-size: 14px;
            display: block;
            margin-top: 4px;
          }
          .cart-mobile-lower {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid var(--color-border);
            padding-top: 10px;
          }
          .mobile-remove-link {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: var(--color-danger);
            font-weight: 600;
          }
        }

        /* Ambient Background Card Design */
        .ambient-background-card {
          position: relative;
          background: linear-gradient(135deg, #15222e 0%, #0d161e 100%);
          border-radius: var(--border-radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          padding: 60px 40px;
          max-width: 550px;
          margin: 40px auto;
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ambient-svg-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .card-foreground-content {
          position: relative;
          z-index: 2;
          max-width: 440px;
          margin: 0 auto;
          text-align: center;
        }

        .error-badge-premium {
          display: inline-block;
          background-color: rgba(255, 77, 79, 0.15);
          color: #ff7875;
          border: 1px solid rgba(255, 77, 79, 0.3);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          font-family: monospace;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .empty-title-premium {
          font-family: var(--font-serif);
          font-size: 24px;
          color: white;
          margin-bottom: 12px;
          line-height: 1.3;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .empty-desc-premium {
          font-size: 13.5px;
          color: #a5b5c5;
          margin-bottom: 30px;
          line-height: 1.6;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .btn-primary-premium {
          background-color: var(--color-primary);
          color: white;
          padding: 12px 30px;
          border-radius: var(--border-radius-sm);
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: var(--transition-normal);
          box-shadow: 0 4px 15px rgba(8, 129, 120, 0.4);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary-premium:hover {
          background-color: var(--color-primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(8, 129, 120, 0.6);
        }

        .oops-animated-text {
          font-family: var(--font-serif);
          font-weight: 900;
          font-size: 48px;
          fill: none;
          stroke: rgba(255,255,255,0.12);
          stroke-width: 1px;
          letter-spacing: 4px;
          animation: strokeDash 4s linear infinite;
        }

        .bouncing-bag {
          transform-origin: 200px 210px;
          animation: bounceBag 2s ease-in-out infinite alternate;
        }

        .drifting-clothes {
          animation: driftClothes 4s ease-in-out infinite alternate;
        }

        .bag-logo {
          font-weight: bold;
          font-size: 20px;
          fill: white;
          font-family: var(--font-sans);
        }

        @keyframes strokeDash {
          0% { stroke-dasharray: 0 100; fill: rgba(255,255,255,0); }
          50% { stroke-dasharray: 100 0; fill: rgba(255,255,255,0.04); }
          100% { stroke-dasharray: 0 100; fill: rgba(255,255,255,0); }
        }

        @keyframes bounceBag {
          0% { transform: scale(1) translateY(0); }
          100% { transform: scale(1.05) translateY(-8px); }
        }

        @keyframes driftClothes {
          0% { transform: translate(-15px, -40px) rotate(-15deg); opacity: 0; }
          30% { opacity: 0.8; }
          70% { opacity: 0.8; }
          100% { transform: translate(15px, 20px) rotate(20deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
