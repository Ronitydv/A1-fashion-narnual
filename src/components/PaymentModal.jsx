import React, { useState } from 'react';
import { X, CreditCard, QrCode, Smartphone, Loader, CheckCircle } from 'lucide-react';
import { getCurrentUser } from '../utils/db';

export default function PaymentModal({ isOpen, onClose, totalAmount, onPaymentSuccess }) {
  const [activeMethod, setActiveMethod] = useState('card'); // 'card', 'upi', 'gpay'
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePay = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (activeMethod === 'card') {
      if (formData.cardNumber.length < 16) {
        setError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!formData.cardExpiry.includes('/') || formData.cardExpiry.length < 5) {
        setError('Please enter expiry in MM/YY format.');
        return;
      }
      if (formData.cardCvv.length < 3) {
        setError('Please enter a valid 3-digit CVV.');
        return;
      }
    } else if (activeMethod === 'upi') {
      if (!formData.upiId.includes('@')) {
        setError('Please enter a valid UPI ID (e.g. user@okhdfc).');
        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setCompleted(true);
      setTimeout(() => {
        onPaymentSuccess('Online UPI/Card Secure pay');
        setCompleted(false);
        resetForm();
        onClose();
      }, 2000);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCvv: '',
      upiId: ''
    });
    setError('');
  };

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="payment-overlay animate-fade">
      <div className="payment-card animate-slide-up">
        <button className="close-payment-btn" onClick={onClose} disabled={loading || completed}>
          <X size={20} />
        </button>

        {completed ? (
          <div className="payment-success-state text-center">
            <CheckCircle size={60} color="var(--color-success)" className="success-icon" />
            <h3>Payment Successful!</h3>
            <p>Your transaction of <strong>₹{totalAmount.toLocaleString('en-IN')}</strong> was completed.</p>
            <p className="redirect-note">Generating your order details now...</p>
          </div>
        ) : (
          <>
            <div className="payment-header">
              <h3>Secure Checkout Gateway</h3>
              <p>Amount to Pay: <strong className="amount-highlight">₹{totalAmount.toLocaleString('en-IN')}</strong></p>
            </div>

            {/* Payment Method Selectors */}
            <div className="payment-methods-grid">
              <button
                className={`method-select-btn ${activeMethod === 'card' ? 'active' : ''}`}
                type="button"
                onClick={() => { setError(''); setActiveMethod('card'); }}
              >
                <CreditCard size={18} /> Card Pay
              </button>
              <button
                className={`method-select-btn ${activeMethod === 'upi' ? 'active' : ''}`}
                type="button"
                onClick={() => { setError(''); setActiveMethod('upi'); }}
              >
                <QrCode size={18} /> UPI / QR
              </button>
              <button
                className={`method-select-btn ${activeMethod === 'gpay' ? 'active' : ''}`}
                type="button"
                onClick={() => { setError(''); setActiveMethod('gpay'); }}
              >
                <Smartphone size={18} /> GPay
              </button>
            </div>

            {error && <div className="payment-error">{error}</div>}

            <form onSubmit={handlePay} className="payment-form">
              {activeMethod === 'card' && (
                <div className="card-fields animate-fade">
                  <div className="payment-input-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rohan Sharma"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="payment-input-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      maxLength={16}
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                  <div className="form-row-2">
                    <div className="payment-input-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (val.length === 2 && !val.includes('/')) {
                            val += '/';
                          }
                          handleInputChange('cardExpiry', val);
                        }}
                        required
                      />
                    </div>
                    <div className="payment-input-group">
                      <label>CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="123"
                        value={formData.cardCvv}
                        onChange={(e) => handleInputChange('cardCvv', e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeMethod === 'upi' && (
                <div className="upi-fields animate-fade text-center">
                  <div className="qr-container">
                    {/* Simulated QR Code */}
                    <div className="mock-qr">
                      <QrCode size={130} />
                    </div>
                    <p className="qr-desc">Scan this QR code using any UPI App (GPay, PhonePe, Paytm)</p>
                  </div>
                  <div className="divider-or">OR</div>
                  <div className="payment-input-group text-left">
                    <label>Enter UPI ID</label>
                    <input
                      type="text"
                      placeholder="e.g. rohan@okaxis"
                      value={formData.upiId}
                      onChange={(e) => handleInputChange('upiId', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {activeMethod === 'gpay' && (
                <div className="gpay-fields animate-fade text-center">
                  <p className="gpay-desc">Pay instantly using your default Google Pay or Paytm account registered on this device.</p>
                  <div className="gpay-brand-row">
                    <span className="gpay-badge">Google Pay</span>
                    <span className="paytm-badge">Paytm</span>
                    <span className="phonepe-badge">PhonePe</span>
                  </div>
                  <p className="instant-tip">We will send a push request to your payment app. Approve it within 2 minutes.</p>
                </div>
              )}

              <button 
                type="submit" 
                className="payment-submit-btn" 
                disabled={loading}
              >
                {loading ? <Loader className="spin" size={18} /> : `Pay ₹${totalAmount.toLocaleString('en-IN')}`}
              </button>
            </form>
          </>
        )}
      </div>

      <style>{`
        .payment-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(37, 61, 83, 0.6);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 15px;
        }

        .payment-card {
          background-color: var(--color-bg-white);
          border-radius: var(--border-radius-lg);
          width: 100%;
          max-width: 500px;
          box-shadow: var(--shadow-lg);
          padding: 30px;
          position: relative;
          border: 1px solid var(--color-border);
        }

        .close-payment-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          color: var(--color-body);
          padding: 5px;
          border-radius: 50%;
        }

        .close-payment-btn:hover {
          background-color: var(--color-bg-light);
          color: var(--color-primary);
        }

        .payment-header {
          margin-bottom: 20px;
        }

        .payment-header h3 {
          font-size: 20px;
          font-family: var(--font-serif);
        }

        .amount-highlight {
          color: var(--color-primary);
          font-size: 20px;
        }

        .payment-methods-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 20px;
        }

        .wallet-fields {
          padding: 10px 0;
        }
        .wallet-balance-card {
          background-color: var(--color-bg-light);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          padding: 15px 25px;
          margin-bottom: 10px;
          display: inline-block;
          min-width: 200px;
        }
        .wallet-card-title {
          font-size: 11px;
          color: var(--color-body);
          text-transform: uppercase;
          font-weight: 700;
          display: block;
          margin-bottom: 4px;
        }
        .wallet-balance-card h3 {
          font-size: 24px;
          color: var(--color-primary);
          font-family: var(--font-sans);
          margin: 0;
        }
        .wallet-warning-msg {
          color: var(--color-danger);
          font-size: 12px;
          margin-top: 8px;
          line-height: 1.4;
        }
        .wallet-success-msg {
          color: var(--color-success);
          font-size: 12px;
          margin-top: 8px;
          font-weight: 600;
        }

        .method-select-btn {
          padding: 12px 5px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          color: var(--color-heading);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background-color: var(--color-bg-light);
          transition: var(--transition-fast);
        }

        .method-select-btn.active {
          border-color: var(--color-primary);
          background-color: var(--color-primary-light);
          color: var(--color-primary);
        }

        .payment-error {
          background-color: #ffeef0;
          color: var(--color-danger);
          padding: 10px;
          border-radius: var(--border-radius-sm);
          font-size: 13px;
          margin-bottom: 15px;
          border-left: 3px solid var(--color-danger);
        }

        .payment-form {
          margin-top: 15px;
        }

        .payment-input-group {
          margin-bottom: 15px;
          text-align: left;
        }

        .payment-input-group label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-heading);
          margin-bottom: 6px;
        }

        .payment-input-group input {
          width: 100%;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          padding: 10px 12px;
          font-size: 14px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .qr-container {
          padding: 10px 0;
        }

        .mock-qr {
          background-color: #fff;
          border: 1px solid var(--color-border);
          padding: 10px;
          border-radius: var(--border-radius-md);
          display: inline-block;
          margin-bottom: 10px;
        }

        .qr-desc {
          font-size: 12px;
          color: var(--color-body);
        }

        .divider-or {
          font-size: 11px;
          font-weight: 700;
          color: #999;
          position: relative;
          margin: 15px 0;
          text-align: center;
        }

        .divider-or::before, .divider-or::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background-color: var(--color-border);
        }

        .divider-or::before { left: 0; }
        .divider-or::after { right: 0; }

        .gpay-desc {
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .gpay-brand-row {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .gpay-badge, .paytm-badge, .phonepe-badge {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          color: white;
        }

        .gpay-badge { background-color: #4285F4; }
        .paytm-badge { background-color: #00b9f5; }
        .phonepe-badge { background-color: #5f259f; }

        .instant-tip {
          font-size: 11px;
          color: var(--color-body);
        }

        .payment-submit-btn {
          width: 100%;
          background-color: var(--color-primary);
          color: white;
          padding: 14px;
          border-radius: var(--border-radius-sm);
          font-weight: 600;
          font-size: 15px;
          margin-top: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: var(--transition-normal);
        }

        .payment-submit-btn:hover {
          background-color: var(--color-primary-hover);
        }

        .payment-success-state {
          padding: 20px 0;
        }

        .success-icon {
          margin-bottom: 15px;
          animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .redirect-note {
          font-size: 13px;
          margin-top: 15px;
          color: var(--color-primary);
        }

        @keyframes scaleUp {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
