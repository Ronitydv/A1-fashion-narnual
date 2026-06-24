import React, { useState } from 'react';
import { Search, ShoppingCart, Heart, User, MapPin, Bell, ShoppingBag, ChevronDown } from 'lucide-react';

export default function Header({
  cartCount,
  wishlistCount,
  activePage,
  setActivePage,
  user,
  onOpenLogin,
  onLogout,
  products = [],
  cartAnimating = false,
  deliveryLocation = { city: 'Ateli', postcode: '123021', formatted: 'Ronit | Ateli 123021' },
  onUpdateLocation
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [tempCity, setTempCity] = useState(deliveryLocation.city);
  const [tempPostcode, setTempPostcode] = useState(deliveryLocation.postcode);

  const categories = products.length > 0
    ? [...new Set(products.map(p => p.category.toLowerCase()))]
    : ['shirts', 'hoodies', 'suits', 'streetwear', 'accessories'];

  const customerName = user ? user.name : "Ronit";
  const mobileLocation = deliveryLocation.formatted || `${customerName} | Ateli, 123021`;
  const pcLocation = `${customerName}, ${deliveryLocation.city} ${deliveryLocation.postcode}`;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActivePage('shop');
    window.dispatchEvent(new CustomEvent('a1_search', { detail: searchQuery }));
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    setActivePage('shop');
    if (cat === 'All') {
      window.dispatchEvent(new CustomEvent('a1_filter_cat', { detail: '' }));
    } else {
      window.dispatchEvent(new CustomEvent('a1_filter_cat', { detail: cat.toLowerCase() }));
    }
  };

  const handleLocationChange = () => {
    setTempCity(deliveryLocation.city);
    setTempPostcode(deliveryLocation.postcode);
    setShowLocationForm(true);
  };

  const saveManualLocation = () => {
    if (!tempCity || !tempPostcode) {
      alert("Please fill in both City and Postal Code.");
      return;
    }
    if (onUpdateLocation) {
      onUpdateLocation(tempCity, tempPostcode);
    }
    setShowLocationForm(false);
  };

  return (
    <header className="main-header">
      {/* ----------------- DESKTOP HEADER (PC Layout - Image 2 Style) ----------------- */}
      <div className="desktop-header-wrapper">
        {/* PC Top Navigation Bar */}
        <div className="pc-top-bar">
          <div className="pc-container pc-bar-inner">
            {/* Logo */}
            <div className="pc-logo-container" onClick={() => setActivePage('home')}>
              <span className="logo-a1-pc">a1 fashion</span>
              <span className="logo-domain">.in</span>
              <div className="logo-smile"></div>
            </div>

            {/* Location Widget */}
            <div className="pc-location-widget" onClick={handleLocationChange}>
              <MapPin size={20} className="pin-icon" />
              <div className="location-text-block">
                <span className="location-line1">Deliver to {customerName}</span>
                <span className="location-line2">{deliveryLocation.city} {deliveryLocation.postcode}</span>
              </div>
            </div>

            {/* Segmented Search Bar */}
            <form className="pc-search-form" onSubmit={handleSearchSubmit}>
              <div className="pc-search-select-wrapper">
                <select 
                  value={selectedCategory} 
                  onChange={handleCategoryChange}
                  className="pc-search-select"
                >
                  <option value="All">All</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
              <input
                type="text"
                placeholder="Search A1 Fashion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pc-search-input"
              />
              <button type="submit" className="pc-search-btn">
                <Search size={20} />
              </button>
            </form>

            {/* Actions & Menus */}
            <div className="pc-actions-menu">
              {/* Language Selector */}
              <div className="pc-lang-picker">
                <span className="flag-emoji">🇮🇳</span>
                <span className="lang-text">EN</span>
                <ChevronDown size={12} className="picker-chevron" />
              </div>

              {/* User Account / Lists */}
              {user ? (
                <div className="pc-account-dropdown">
                  <div className="dropdown-trigger" onClick={() => setActivePage('account')}>
                    <span className="trigger-line1">Hello, {customerName}</span>
                    <span className="trigger-line2">Account & Lists <ChevronDown size={12} inline="true" /></span>
                  </div>
                  <div className="dropdown-menu">
                    <button onClick={() => setActivePage('account')}>My Account</button>
                    <button onClick={onLogout} className="logout-btn">Sign Out</button>
                  </div>
                </div>
              ) : (
                <div className="pc-account-dropdown" onClick={onOpenLogin}>
                  <span className="trigger-line1">Hello, Sign in</span>
                  <span className="trigger-line2">Account & Lists <ChevronDown size={12} /></span>
                </div>
              )}

              {/* Returns & Orders */}
              <div className="pc-orders-link" onClick={() => setActivePage('account')}>
                <span className="orders-line1">Returns</span>
                <span className="orders-line2">& Orders</span>
              </div>

              {/* Cart Counter */}
              <div className={`pc-cart-widget ${cartAnimating ? 'animate-cart-bounce' : ''}`} onClick={() => setActivePage('cart')}>
                <div className="cart-icon-wrapper">
                  <span className="cart-badge-count">{cartCount}</span>
                  <ShoppingCart size={24} />
                </div>
                <span className="cart-label">Cart</span>
              </div>
            </div>
          </div>
        </div>

        {/* PC Sub-Navigation Bar */}
        <nav className="pc-sub-nav">
          <div className="pc-container sub-nav-inner">
            <ul className="sub-nav-menu">
              <li>
                <button className={activePage === 'home' ? 'sub-active' : ''} onClick={() => setActivePage('home')}>
                  Home
                </button>
              </li>
              <li>
                <button className={activePage === 'shop' ? 'sub-active' : ''} onClick={() => setActivePage('shop')}>
                  Shop All
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat}>
                  <button onClick={() => { setActivePage('shop'); setTimeout(() => window.dispatchEvent(new CustomEvent('a1_filter_cat', { detail: cat })), 50); }}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
            <div className="sub-nav-banner-text">
              🔥 Free Delivery above ₹1,499! Code: <strong>WELCOME10</strong>
            </div>
          </div>
        </nav>
      </div>

      {/* ----------------- MOBILE HEADER (Mobile Layout - Image 1 Style) ----------------- */}
      <div className="mobile-header-wrapper">
        <div className="mobile-main-bar">
          <form className="mobile-search-pill" onSubmit={handleSearchSubmit}>
            {/* Custom "A" badge logo */}
            <div className="mobile-logo-badge" onClick={() => setActivePage('home')}>
              A
            </div>
            <input
              type="text"
              placeholder="Search by product, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-search-input"
            />
            <button type="submit" className="mobile-search-btn">
              <Search size={16} />
            </button>
          </form>

          {/* Right Icon Actions */}
          <div className="mobile-header-actions">
            {/* Bell/Notification */}
            <button className="mobile-action-btn" onClick={() => alert("No new notifications at this time.")} title="Notifications">
              <Bell size={22} />
              <span className="mobile-badge-dot"></span>
            </button>

            {/* Heart/Wishlist */}
            <button className="mobile-action-btn" onClick={() => setActivePage('wishlist')} title="Wishlist">
              <Heart size={22} className={activePage === 'wishlist' ? 'filled-heart' : ''} />
              {wishlistCount > 0 && <span className="mobile-badge-count">{wishlistCount}</span>}
            </button>

            {/* Bag/Cart */}
            <button className={`mobile-action-btn ${cartAnimating ? 'animate-cart-bounce' : ''}`} onClick={() => setActivePage('cart')} title="Cart">
              <ShoppingBag size={22} />
              {cartCount > 0 && <span className="mobile-badge-count">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Mobile Delivery Sub-bar */}
        <div className="mobile-delivery-bar" onClick={handleLocationChange}>
          <div className="delivery-location">
            <MapPin size={14} className="delivery-pin-icon" />
            <span className="delivery-text">{mobileLocation}</span>
          </div>
          <button className="delivery-change-btn">Change</button>
        </div>
      </div>

      {/* Styled Responsive Headers (Custom Palette) */}
      <style>{`
        /* --- GENERAL HEADER STYLES --- */
        .main-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: var(--shadow-sm);
        }

        /* --- DESKTOP HEADER (PC) --- */
        .desktop-header-wrapper {
          display: block;
        }

        .pc-top-bar {
          background-color: var(--color-primary); /* Slate Forest Green-Grey */
          color: #ffffff;
          padding: 10px 0;
        }

        .pc-container {
          max-width: 1250px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .pc-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        /* PC Logo */
        .pc-logo-container {
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: baseline;
          padding: 4px 8px;
          border: 1px solid transparent;
          border-radius: 4px;
          transition: var(--transition-fast);
        }
        
        .pc-logo-container:hover {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .logo-a1-pc {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #ffffff;
        }

        .logo-domain {
          font-size: 13px;
          color: var(--color-accent); /* Soft Peach/Pink */
          font-weight: 600;
        }

        .logo-smile {
          position: absolute;
          bottom: 0px;
          left: 10px;
          right: 25px;
          height: 5px;
          border-bottom: 2px solid var(--color-accent);
          border-radius: 0 0 50% 50%;
        }

        /* PC Location widget */
        .pc-location-widget {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          border: 1px solid transparent;
          border-radius: 4px;
          transition: var(--transition-fast);
        }

        .pc-location-widget:hover {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .pc-location-widget .pin-icon {
          color: var(--color-accent); /* Soft Peach/Pink */
        }

        .location-text-block {
          display: flex;
          flex-direction: column;
        }

        .location-line1 {
          font-size: 11px;
          color: var(--color-primary-light); /* Mint */
        }

        .location-line2 {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        /* PC Search Bar (Pill shape to reflect user request) */
        .pc-search-form {
          display: flex;
          flex: 1;
          max-width: 600px;
          height: 40px;
          background-color: #ffffff;
          border-radius: var(--border-radius-pill); /* Rounded Edges */
          overflow: hidden;
          border: 2px solid transparent;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .pc-search-form:focus-within {
          border-color: var(--color-accent);
        }

        .pc-search-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background-color: var(--color-primary-light); /* Mint */
          border-right: 1px solid var(--color-sage);
          padding: 0 12px;
          cursor: pointer;
        }

        .pc-search-select {
          appearance: none;
          background: transparent;
          border: none;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-primary);
          padding-right: 18px;
          cursor: pointer;
          outline: none;
        }

        .select-chevron {
          position: absolute;
          right: 8px;
          pointer-events: none;
          color: var(--color-primary);
        }

        .pc-search-input {
          flex: 1;
          border: none;
          padding: 0 15px;
          font-size: 14px;
          color: #333333;
          outline: none;
        }

        .pc-search-btn {
          background-color: var(--color-accent); /* Soft Peach/Pink as highlight */
          color: var(--color-primary);
          width: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
          cursor: pointer;
        }

        .pc-search-btn:hover {
          opacity: 0.9;
        }

        /* Actions & menus */
        .pc-actions-menu {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .pc-lang-picker {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px;
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: 4px;
        }
        
        .pc-lang-picker:hover {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .flag-emoji {
          font-size: 16px;
        }

        .lang-text {
          font-size: 13px;
          font-weight: 700;
        }

        .pc-account-dropdown {
          position: relative;
          cursor: pointer;
          padding: 6px 8px;
          border: 1px solid transparent;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
        }

        .pc-account-dropdown:hover {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .pc-account-dropdown:hover .dropdown-menu {
          display: block;
        }

        .trigger-line1 {
          font-size: 11px;
          color: var(--color-primary-light);
        }

        .trigger-line2 {
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          background-color: #ffffff;
          box-shadow: var(--shadow-md);
          border-radius: var(--border-radius-sm);
          min-width: 150px;
          padding: 10px 0;
          z-index: 1000;
        }

        .dropdown-menu button {
          display: block;
          width: 100%;
          text-align: left;
          padding: 8px 16px;
          font-size: 13px;
          color: var(--color-body-dark);
          transition: var(--transition-fast);
        }

        .dropdown-menu button:hover {
          background-color: var(--color-bg-light);
          color: var(--color-primary);
        }

        .dropdown-menu .logout-btn {
          border-top: 1px solid var(--color-border);
          color: var(--color-danger);
          margin-top: 5px;
          padding-top: 10px;
        }

        .pc-orders-link {
          cursor: pointer;
          padding: 6px 8px;
          border: 1px solid transparent;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
        }

        .pc-orders-link:hover {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .orders-line1 {
          font-size: 11px;
          color: var(--color-primary-light);
        }

        .orders-line2 {
          font-size: 13px;
          font-weight: 700;
        }

        .pc-cart-widget {
          cursor: pointer;
          display: flex;
          align-items: flex-end;
          gap: 4px;
          padding: 6px 8px;
          border: 1px solid transparent;
          border-radius: 4px;
          transition: var(--transition-fast);
        }

        .pc-cart-widget:hover {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .cart-icon-wrapper {
          position: relative;
          color: var(--color-accent);
        }

        .cart-badge-count {
          position: absolute;
          top: -10px;
          right: -8px;
          background-color: var(--color-secondary); /* Sky Blue */
          color: var(--color-primary);
          font-size: 11px;
          font-weight: 800;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1px;
          border: 1px solid var(--color-primary);
        }

        .cart-label {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        /* PC Sub-nav bar */
        .pc-sub-nav {
          background-color: var(--color-primary-light); /* Mint */
          border-bottom: 1px solid var(--color-border);
          padding: 8px 0;
        }

        .sub-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sub-nav-menu {
          display: flex;
          gap: 20px;
        }

        .sub-nav-menu button {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-primary);
          transition: var(--transition-fast);
        }

        .sub-nav-menu button:hover, .sub-nav-menu .sub-active {
          color: var(--color-primary-hover);
          text-decoration: underline;
        }

        .sub-nav-banner-text {
          font-size: 12px;
          color: var(--color-primary);
          font-weight: 500;
        }

        /* --- MOBILE HEADER --- */
        .mobile-header-wrapper {
          display: none;
        }

        .mobile-main-bar {
          background-color: var(--color-primary-light); /* Mint */
          padding: 12px 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .mobile-search-pill {
          display: flex;
          align-items: center;
          flex: 1;
          background-color: #ffffff;
          border-radius: var(--border-radius-pill); /* Rounded Pill */
          padding: 6px 12px;
          height: 40px;
          box-shadow: var(--shadow-sm);
        }

        .mobile-logo-badge {
          background-color: var(--color-primary);
          color: #ffffff;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          margin-right: 8px;
          cursor: pointer;
        }

        .mobile-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 13px;
          color: #333333;
          background: transparent;
        }

        .mobile-search-btn {
          color: var(--color-primary);
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-header-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .mobile-action-btn {
          position: relative;
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .filled-heart {
          fill: var(--color-primary);
        }

        .mobile-badge-dot {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--color-secondary); /* Sky Blue */
          border: 1px solid var(--color-primary-light);
        }

        .mobile-badge-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: var(--color-secondary); /* Sky Blue */
          color: var(--color-primary);
          font-size: 10px;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-primary);
        }

        .mobile-delivery-bar {
          background-color: var(--color-bg-warm); /* Creamy Peach/Beige */
          border-bottom: 1px solid var(--color-border);
          padding: 8px 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: var(--color-primary);
          cursor: pointer;
        }

        .delivery-location {
          display: flex;
          align-items: center;
          gap: 6px;
          max-width: 80%;
        }

        .delivery-pin-icon {
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .delivery-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
        }

        .delivery-change-btn {
          color: var(--color-secondary); /* Sky Blue */
          font-weight: 700;
          font-size: 12px;
        }

        /* --- RESPONSIVE TOGGLE --- */
        @media (max-width: 768px) {
          .desktop-header-wrapper {
            display: none;
          }
          .mobile-header-wrapper {
            display: block;
          }
        }

        /* --- LOCATION MODAL --- */
        .location-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(37, 61, 83, 0.5);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .location-modal-card {
          background: white;
          padding: 30px;
          border-radius: var(--border-radius-md);
          width: 100%;
          max-width: 420px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--color-border);
          text-align: center;
          color: var(--color-body-dark);
        }

        .location-modal-card h3 {
          font-family: var(--font-serif);
          font-size: 20px;
          margin-bottom: 10px;
          color: var(--color-heading);
        }

        .location-modal-card p {
          font-size: 13px;
          color: var(--color-body);
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .location-form-inputs {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .location-form-inputs input {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          font-size: 14px;
          outline: none;
          transition: var(--transition-fast);
        }

        .location-form-inputs input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(8, 129, 120, 0.15);
        }

        .location-form-actions {
          display: flex;
          gap: 12px;
        }

        .location-cancel-btn {
          flex: 1;
          padding: 12px;
          border: 1px solid var(--color-border);
          background: white;
          color: var(--color-body);
          font-weight: 600;
          font-size: 14px;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
        }

        .location-save-btn {
          flex: 1;
          padding: 12px;
          border: none;
          background: var(--color-primary);
          color: white;
          font-weight: 600;
          font-size: 14px;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
        }

        .location-save-btn:hover {
          background: var(--color-primary-hover);
        }

        /* --- CART BOUNCE KEYFRAMES --- */
        @keyframes cartBounce {
          0% { transform: scale(1); }
          30% { transform: scale(1.25) rotate(-8deg); }
          50% { transform: scale(1.08) rotate(8deg); }
          70% { transform: scale(1.15) rotate(-4deg); }
          100% { transform: scale(1); }
        }

        .animate-cart-bounce {
          animation: cartBounce 0.75s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }
      `}</style>

      {/* Manual Location Override Form Modal */}
      {showLocationForm && (
        <div className="location-modal-overlay">
          <div className="location-modal-card">
            <h3>Update Delivery Location</h3>
            <p>Enter your City and Postal Code below to update your delivery region.</p>
            <div className="location-form-inputs">
              <input 
                type="text" 
                placeholder="City (e.g. Ateli)" 
                value={tempCity} 
                onChange={(e) => setTempCity(e.target.value)} 
                required
              />
              <input 
                type="text" 
                placeholder="Postal Code (e.g. 123021)" 
                value={tempPostcode} 
                onChange={(e) => setTempPostcode(e.target.value)} 
                required
              />
            </div>
            <div className="location-form-actions">
              <button className="location-cancel-btn" onClick={() => setShowLocationForm(false)}>Cancel</button>
              <button className="location-save-btn" onClick={saveManualLocation}>Save Address</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

