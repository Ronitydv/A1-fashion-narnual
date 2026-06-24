import React, { useState, useEffect } from 'react';
import { X, Smartphone, ArrowRight, Loader } from 'lucide-react';
import { setCurrentUser, sendOtpCode, verifyOtpCode, loginWithGoogleMock } from '../utils/db';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('otp'); // 'otp' or 'google'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await sendOtpCode(phoneNumber);
      setLoading(false);
      setOtpSent(true);
      setTimer(30);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await verifyOtpCode(phoneNumber, otpCode);
      setLoading(false);
      onLoginSuccess(data.user);
      resetState();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'OTP verification failed.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const googleUserMock = {
        name: 'Aman Verma',
        email: 'aman.verma@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        phone: '9876543210'
      };
      const data = await loginWithGoogleMock(googleUserMock);
      setLoading(false);
      onLoginSuccess(data.user);
      resetState();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Google login failed.');
    }
  };

  const resetState = () => {
    setPhoneNumber('');
    setOtpSent(false);
    setOtpCode('');
    setTimer(30);
    setError('');
    setLoading(false);
  };

  const handleResendOtp = () => {
    setTimer(30);
    setError('');
    // Resend animation
  };

  return (
    <div className="modal-overlay animate-fade">
      <div className="modal-card animate-slide-up">
        {/* Close Button */}
        <button className="close-modal-btn" onClick={() => { resetState(); onClose(); }}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <h2>Welcome to A1 Fashion</h2>
          <p>Login or Register to track orders, access your wallet, and save items to your wishlist.</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`tab-btn ${activeTab === 'otp' ? 'active' : ''}`}
            onClick={() => { resetState(); setActiveTab('otp'); }}
          >
            <Smartphone size={16} /> OTP Login
          </button>
          <button
            className={`tab-btn ${activeTab === 'google' ? 'active' : ''}`}
            onClick={() => { resetState(); setActiveTab('google'); }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Google Sign-in
          </button>
        </div>

        {/* Tab Contents */}
        <div className="auth-content">
          {error && <div className="auth-error-msg">{error}</div>}

          {activeTab === 'otp' ? (
            !otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div className="input-group">
                  <label>Mobile Number</label>
                  <div className="phone-input-wrapper">
                    <span className="phone-prefix">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <Loader className="spin" size={18} /> : <>Send OTP <ArrowRight size={16} /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="input-group">
                  <label>One-Time Password (OTP)</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit code (Use 1234)"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="otp-input-field"
                    required
                    autoFocus
                  />
                  <div className="otp-info-tip">
                    <span>We sent an OTP to <strong>+91 {phoneNumber}</strong></span>
                    <button type="button" onClick={() => setOtpSent(false)} className="edit-phone-btn">Edit</button>
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <Loader className="spin" size={18} /> : 'Verify & Sign In'}
                </button>

                <div className="resend-container">
                  {timer > 0 ? (
                    <span>Resend OTP in <strong>{timer}s</strong></span>
                  ) : (
                    <button type="button" onClick={handleResendOtp} className="resend-btn">
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            )
          ) : (
            <div className="google-auth-container">
              <p className="google-instructions">
                Signing in with Google is fast and secure. We will securely import your name, email address, and profile photo.
              </p>
              <button onClick={handleGoogleLogin} className="google-login-btn" disabled={loading}>
                {loading ? (
                  <Loader className="spin" size={20} />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ marginRight: '10px' }}>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#fff" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#fff" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CSS Styles inside LoginModal */}
      <style>{`
        .modal-overlay {
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
          z-index: 1500;
          padding: 15px;
        }

        .modal-card {
          background-color: var(--color-bg-white);
          border-radius: var(--border-radius-lg);
          width: 100%;
          max-width: 450px;
          box-shadow: var(--shadow-lg);
          padding: 30px;
          position: relative;
          border: 1px solid var(--color-border);
        }

        .close-modal-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          color: var(--color-body);
          transition: var(--transition-fast);
          padding: 5px;
          border-radius: 50%;
        }

        .close-modal-btn:hover {
          background-color: var(--color-bg-light);
          color: var(--color-primary);
        }

        .modal-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .modal-header h2 {
          font-family: var(--font-serif);
          font-size: 26px;
          margin-bottom: 8px;
          color: var(--color-heading);
        }

        .modal-header p {
          font-size: 13px;
          color: var(--color-body);
        }

        .auth-tabs {
          display: flex;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 20px;
        }

        .tab-btn {
          flex: 1;
          padding: 12px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          color: var(--color-body);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-bottom: 2px solid transparent;
          transition: var(--transition-fast);
        }

        .tab-btn.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        .auth-error-msg {
          background-color: #ffeef0;
          color: var(--color-danger);
          padding: 10px 15px;
          border-radius: var(--border-radius-sm);
          font-size: 13px;
          margin-bottom: 15px;
          border-left: 3px solid var(--color-danger);
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-heading);
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .phone-input-wrapper {
          display: flex;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          background-color: var(--color-bg-light);
        }

        .phone-prefix {
          background-color: #eee;
          padding: 10px 15px;
          font-weight: 600;
          color: var(--color-heading);
          border-right: 1px solid var(--color-border);
          font-size: 14px;
        }

        .phone-input-wrapper input {
          flex: 1;
          border: none;
          padding: 10px 15px;
          font-size: 15px;
          background: transparent;
          letter-spacing: 1px;
        }

        .otp-input-field {
          width: 100%;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          padding: 12px 15px;
          font-size: 18px;
          letter-spacing: 8px;
          text-align: center;
          background-color: var(--color-bg-light);
        }

        .otp-info-tip {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-top: 8px;
        }

        .edit-phone-btn {
          color: var(--color-primary);
          font-weight: 600;
          text-decoration: underline;
        }

        .auth-submit-btn {
          width: 100%;
          background-color: var(--color-primary);
          color: white;
          padding: 14px;
          border-radius: var(--border-radius-sm);
          font-weight: 600;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: var(--transition-normal);
        }

        .auth-submit-btn:hover {
          background-color: var(--color-primary-hover);
        }

        .auth-submit-btn:disabled {
          background-color: #a3d0cc;
          cursor: not-allowed;
        }

        .resend-container {
          text-align: center;
          margin-top: 15px;
          font-size: 13px;
        }

        .resend-btn {
          color: var(--color-primary);
          font-weight: 600;
          text-decoration: underline;
        }

        .google-auth-container {
          text-align: center;
          padding: 10px 0;
        }

        .google-instructions {
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .google-login-btn {
          width: 100%;
          background-color: #4285F4;
          color: white;
          padding: 14px;
          border-radius: var(--border-radius-sm);
          font-weight: 600;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-normal);
        }

        .google-login-btn:hover {
          background-color: #357ae8;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
