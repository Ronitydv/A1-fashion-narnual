import React, { useState, useEffect } from 'react';
import { User, History, Truck, Plus, LogOut, CheckCircle, Clock } from 'lucide-react';
import { getOrders, getOrderTrackInfo, setCurrentUser, getCurrentUser } from '../utils/db';

export default function UserAccount({ user, onLogout, onOpenLogin, setActivePage }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'tracking'
  const [orders, setOrders] = useState([]);

  // Order tracking lookup state
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackError, setTrackError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const ords = await getOrders();
        setOrders(ords);
      }
    };
    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="container text-center section-padding account-login-gate animate-fade">
        <div className="login-gate-box">
          <span className="gate-emoji">👤</span>
          <h2>Your Personal Profile</h2>
          <p>Login to view your orders, track deliveries, manage your A1 Wallet, and update your billing details.</p>
          <button className="btn-primary" onClick={onOpenLogin}>Sign In / Register</button>
        </div>
        <style>{`
          .account-login-gate {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
          }
          .login-gate-box {
            background-color: var(--color-bg-light);
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius-lg);
            padding: 40px 30px;
            max-width: 450px;
            box-shadow: var(--shadow-sm);
          }
          .gate-emoji {
            font-size: 40px;
            display: block;
            margin-bottom: 15px;
          }
          .login-gate-box h2 {
            font-family: var(--font-serif);
            font-size: 24px;
            margin-bottom: 10px;
          }
          .login-gate-box p {
            font-size: 13px;
            color: var(--color-body);
            margin-bottom: 25px;
            line-height: 1.5;
          }
        `}</style>
      </div>
    );
  }


  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setTrackError('');
    setTrackedOrder(null);

    if (!trackOrderId) return;

    try {
      const order = await getOrderTrackInfo(trackOrderId.trim());
      setTrackedOrder(order);
    } catch (err) {
      setTrackError(err.message || 'Order not found. Please double-check your Order ID.');
    }
  };

  const getStatusStep = (status) => {
    if (status === 'Processing') return 1;
    if (status === 'Shipped') return 2;
    if (status === 'Delivered') return 3;
    return 1;
  };

  return (
    <div className="account-page container animate-fade">
      {/* Account Header */}
      <div className="account-welcome-box">
        <div className="user-profile-summary">
          <img src={user.avatar} alt={user.name} className="user-avatar" />
          <div className="user-text text-left">
            <h2>Welcome back, {user.name}!</h2>
            <p>Mobile: +91 {user.phone} | Email: {user.email}</p>
          </div>
        </div>
        <button onClick={onLogout} className="btn-outline logout-btn-acc">
          <LogOut size={16} /> Log Out
        </button>
      </div>

      {/* Account Tabs Section */}
      <div className="account-layout">
        {/* Navigation Left Sidebar */}
        <aside className="account-sidebar">
          <button className={`sidebar-tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <History size={16} /> My Orders
          </button>
          <button className={`sidebar-tab-btn ${activeTab === 'tracking' ? 'active' : ''}`} onClick={() => setActiveTab('tracking')}>
            <Truck size={16} /> Track Order
          </button>
        </aside>

        {/* Tab Contents Pane */}
        <main className="account-contents-pane text-left">
          {activeTab === 'orders' && (
            <div className="orders-pane animate-fade">
              <h3>Order History</h3>
              {orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-history-card">
                      <div className="order-card-header">
                        <div>
                          <span className="order-meta-label">Order ID</span>
                          <span className="order-meta-value">{order.id}</span>
                        </div>
                        <div>
                          <span className="order-meta-label">Date Placed</span>
                          <span className="order-meta-value">{order.date}</span>
                        </div>
                        <div>
                          <span className="order-meta-label">Total Amount</span>
                          <span className="order-meta-value font-primary">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className={`order-status-badge status-${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Products inside order */}
                      <div className="order-card-body">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="ordered-product-item">
                            <img src={item.image} alt={item.title} className="ordered-thumb" />
                            <div className="ordered-details">
                              <h4>{item.title}</h4>
                              <p>Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="order-card-footer">
                        <span>Payment Method: <strong>{order.paymentMethod || 'Online Secured Card'}</strong></span>
                        <button className="track-order-btn-inline" onClick={() => { setTrackOrderId(order.id); setTrackedOrder(order); setActiveTab('tracking'); }}>
                          Track Shipment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-orders-state text-center">
                  <p>You haven't placed any orders yet.</p>
                  <button className="btn-primary" onClick={() => setActivePage('shop')}>Shop Collections</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="tracking-pane animate-fade">
              <h3>Track Your Shipment</h3>
              <p className="track-desc-txt">Enter your A1 Fashion Order ID (provided in your order receipt) to view transit updates.</p>
              
              <form onSubmit={handleTrackOrder} className="track-lookup-form">
                <input
                  type="text"
                  placeholder="e.g. A1-123456"
                  value={trackOrderId}
                  onChange={(e) => setTrackOrderId(e.target.value)}
                  required
                />
                <button type="submit">Track Order</button>
              </form>

              {trackError && <div className="tracking-error">{trackError}</div>}

              {trackedOrder && (
                <div className="tracking-results-box">
                  <div className="tracking-order-summary">
                    <p>Status for Order ID: <strong>{trackedOrder.id}</strong></p>
                    <p>Estimated Delivery: <strong>{trackedOrder.date} (Standard Shipping)</strong></p>
                  </div>

                  {/* Visual Timeline */}
                  <div className="tracking-timeline">
                    <div className={`timeline-step ${getStatusStep(trackedOrder.status) >= 1 ? 'completed' : ''}`}>
                      <div className="step-bullet"><CheckCircle size={18} /></div>
                      <div className="step-details">
                        <h4>Order Confirmed</h4>
                        <p>Order details verified, payment verified successfully.</p>
                      </div>
                    </div>
                    <div className={`timeline-step ${getStatusStep(trackedOrder.status) >= 2 ? 'completed' : ''}`}>
                      <div className="step-bullet">
                        {getStatusStep(trackedOrder.status) === 1 ? <Clock size={18} className="spin" /> : <CheckCircle size={18} />}
                      </div>
                      <div className="step-details">
                        <h4>Shipped / In Transit</h4>
                        <p>Package dispatched from Mumbai hub. Handed over to BlueDart courier.</p>
                      </div>
                    </div>
                    <div className={`timeline-step ${getStatusStep(trackedOrder.status) >= 3 ? 'completed' : ''}`}>
                      <div className="step-bullet">
                        {getStatusStep(trackedOrder.status) === 2 ? <Clock size={18} className="spin" /> : <CheckCircle size={18} />}
                      </div>
                      <div className="step-details">
                        <h4>Delivered</h4>
                        <p>Delivered to your address. Secured with signature verification.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <style>{`
        .account-page {
          padding-top: 40px;
        }

        .account-welcome-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--color-bg-light);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          padding: 24px 30px;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .user-profile-summary {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid white;
          box-shadow: var(--shadow-sm);
        }

        .user-text h2 {
          font-family: var(--font-serif);
          font-size: 24px;
          color: var(--color-heading);
          margin-bottom: 4px;
        }

        .user-text p {
          font-size: 13px;
          color: var(--color-body);
        }

        .logout-btn-acc {
          border-color: #ddd;
          color: #555;
        }

        .logout-btn-acc:hover {
          background-color: var(--color-danger);
          border-color: var(--color-danger);
          color: white;
        }

        .account-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 40px;
        }

        .account-sidebar {
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: left;
        }

        .sidebar-tab-btn {
          width: 100%;
          text-align: left;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-heading);
          border-radius: var(--border-radius-sm);
          display: flex;
          align-items: center;
          gap: 10px;
          transition: var(--transition-fast);
        }

        .sidebar-tab-btn:hover, .sidebar-tab-btn.active {
          background-color: var(--color-primary-light);
          color: var(--color-primary);
        }

        .account-contents-pane h3 {
          font-size: 20px;
          color: var(--color-heading);
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 12px;
          margin-bottom: 25px;
        }

        .order-history-card {
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          background-color: white;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .order-card-header {
          background-color: var(--color-bg-light);
          padding: 15px 20px;
          display: grid;
          grid-template-columns: 1.5fr 1.5fr 1.5fr 1.2fr;
          gap: 15px;
          border-bottom: 1px solid var(--color-border);
        }

        .order-meta-label {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          color: var(--color-body);
          font-weight: 700;
          margin-bottom: 3px;
        }

        .order-meta-value {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-heading);
        }

        .font-primary {
          color: var(--color-primary) !important;
        }

        .order-status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        .order-status-badge.status-processing {
          background-color: #fff2e8;
          color: var(--color-accent-orange);
        }

        .order-status-badge.status-shipped {
          background-color: #e6f7ff;
          color: #1890ff;
        }

        .order-status-badge.status-delivered {
          background-color: var(--color-primary-light);
          color: var(--color-primary);
        }

        .order-card-body {
          padding: 20px;
        }

        .ordered-product-item {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 12px;
        }

        .ordered-product-item:last-child {
          margin-bottom: 0;
        }

        .ordered-thumb {
          width: 50px;
          height: 50px;
          border-radius: var(--border-radius-sm);
          object-fit: cover;
          background-color: var(--color-bg-light);
        }

        .ordered-details h4 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .ordered-details p {
          font-size: 11px;
          color: var(--color-body);
        }

        .order-card-footer {
          background-color: white;
          padding: 12px 20px;
          border-top: 1px dashed var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .track-order-btn-inline {
          color: var(--color-primary);
          font-weight: 700;
          text-decoration: underline;
        }

        /* Wallet Pane */
        .wallet-overview-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 25px;
          margin-bottom: 40px;
        }

        .wallet-balance-card {
          background-color: var(--color-primary);
          color: white;
          border-radius: var(--border-radius-lg);
          padding: 30px 25px;
        }

        .wallet-sub-title {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.8;
          display: block;
          margin-bottom: 5px;
        }

        .wallet-balance-card h2 {
          font-size: 36px;
          color: white;
          margin-bottom: 10px;
        }

        .wallet-balance-card p {
          font-size: 12px;
          opacity: 0.9;
        }

        .wallet-voucher-card {
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          background: white;
        }

        .wallet-voucher-card h4 {
          font-size: 16px;
          margin-bottom: 5px;
        }

        .wallet-voucher-card p {
          font-size: 12px;
          color: var(--color-body);
          margin-bottom: 15px;
        }

        .voucher-submit-form {
          display: flex;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          background: white;
        }

        .voucher-submit-form input {
          flex: 1;
          border: none;
          padding: 10px;
          font-size: 13px;
        }

        .voucher-submit-form button {
          background-color: var(--color-primary);
          color: white;
          padding: 0 15px;
          font-weight: 600;
          font-size: 13px;
        }

        .gift-err {
          color: var(--color-danger);
          font-size: 11px;
          margin-top: 6px;
          display: block;
          font-weight: 600;
        }

        .gift-success {
          color: var(--color-success);
          font-size: 11px;
          margin-top: 6px;
          display: block;
          font-weight: 600;
        }

        .transactions-table-holder {
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          background-color: white;
        }

        .transactions-table {
          width: 100%;
          border-collapse: collapse;
        }

        .transactions-table th, .transactions-table td {
          padding: 12px 15px;
          font-size: 13px;
          border-bottom: 1px solid var(--color-border);
        }

        .transactions-table th {
          background-color: var(--color-bg-light);
          font-weight: 700;
          color: var(--color-heading);
        }

        .transaction-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
        }

        .transaction-badge.credit {
          background-color: var(--color-primary-light);
          color: var(--color-primary);
        }

        .transaction-badge.debit {
          background-color: #fff2f4;
          color: var(--color-danger);
        }

        .text-success { color: var(--color-success); font-weight: 600; }
        .text-danger { color: var(--color-danger); font-weight: 600; }

        /* Tracking Pane */
        .track-desc-txt {
          font-size: 13px;
          color: var(--color-body);
          margin-bottom: 20px;
        }

        .track-lookup-form {
          display: flex;
          max-width: 400px;
          border: 2px solid var(--color-primary);
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          margin-bottom: 30px;
        }

        .track-lookup-form input {
          flex: 1;
          border: none;
          padding: 12px 15px;
          font-size: 14px;
        }

        .track-lookup-form button {
          background-color: var(--color-primary);
          color: white;
          padding: 0 20px;
          font-weight: 600;
          font-size: 14px;
        }

        .tracking-error {
          background-color: #fff2f2;
          color: var(--color-danger);
          padding: 12px;
          border-radius: var(--border-radius-sm);
          font-size: 13px;
          margin-bottom: 20px;
          border-left: 3px solid var(--color-danger);
          max-width: 400px;
        }

        .tracking-results-box {
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          padding: 25px;
          background: white;
          max-width: 600px;
        }

        .tracking-order-summary {
          border-bottom: 1px dashed var(--color-border);
          padding-bottom: 15px;
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .tracking-timeline {
          display: flex;
          flex-direction: column;
          gap: 30px;
          position: relative;
          padding-left: 15px;
        }

        .tracking-timeline::before {
          content: '';
          position: absolute;
          top: 8px;
          left: 23px;
          bottom: 15px;
          width: 2px;
          background-color: var(--color-border);
          z-index: 1;
        }

        .timeline-step {
          display: flex;
          gap: 20px;
          position: relative;
          z-index: 2;
        }

        .step-bullet {
          width: 18px;
          height: 18px;
          background: white;
          color: #ccc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-details h4 {
          font-size: 14px;
          font-weight: 700;
          color: #bbb;
        }

        .step-details p {
          font-size: 12px;
          color: #ccc;
        }

        /* Completed styles */
        .timeline-step.completed .step-bullet {
          color: var(--color-primary);
        }

        .timeline-step.completed .step-details h4 {
          color: var(--color-heading);
        }

        .timeline-step.completed .step-details p {
          color: var(--color-body);
        }

        .empty-orders-state {
          padding: 40px;
          background-color: var(--color-bg-light);
          border-radius: var(--border-radius-md);
          text-align: center;
        }

        /* Responsive Account */
        @media (max-width: 768px) {
          .account-layout {
            grid-template-columns: 1fr;
          }
          .account-sidebar {
            flex-direction: row;
            overflow-x: auto;
            border-bottom: 1px solid var(--color-border);
            padding-bottom: 10px;
          }
          .sidebar-tab-btn {
            white-space: nowrap;
            padding: 8px 12px;
            font-size: 12px;
          }
          .wallet-overview-grid {
            grid-template-columns: 1fr;
          }
          .order-card-header {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
