import React from 'react';
import { Home, User, Wallet, ShoppingCart, Menu } from 'lucide-react';

export default function BottomNav({
  activePage,
  setActivePage,
  cartCount,
  onOpenInstagram
}) {
  return (
    <>
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919999999999?text=Hello%20A1%20Fashion,%20I'm%20interested%20in%20your%20men's%20apparel%20collection!"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.528 2.012 14.077.99 11.953.99c-5.437 0-9.862 4.37-9.865 9.801-.001 1.739.486 3.431 1.413 4.937L2.43 21.07l5.418-1.416zM17.47 14.39c-.3-.149-1.778-.874-2.053-.974-.275-.099-.475-.149-.675.15-.2.299-.775.974-.95 1.173-.175.199-.35.224-.65.075-.3-.15-1.267-.467-2.414-1.485-.893-.794-1.496-1.775-1.671-2.074-.175-.299-.019-.461.13-.61.135-.133.3-.349.45-.523.15-.174.2-.299.3-.498.1-.199.05-.374-.025-.524-.075-.15-.675-1.624-.925-2.223-.244-.588-.493-.508-.675-.518-.174-.01-.374-.012-.574-.012-.2 0-.525.075-.8.374-.275.299-1.05 1.022-1.05 2.493 0 1.47 1.071 2.89 1.221 3.089.15.199 2.107 3.203 5.105 4.492.712.307 1.268.49 1.703.628.714.227 1.365.195 1.88.118.574-.085 1.778-.724 2.028-1.42.25-.697.25-1.296.175-1.42-.075-.124-.275-.199-.575-.349z"/>
        </svg>
      </a>

      {/* Sticky Bottom Nav Bar (Mobile Viewports Only) */}
      <nav className="mobile-bottom-nav">
        <button
          className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => setActivePage('home')}
        >
          <Home size={22} className="nav-icon" />
          <span className="nav-text">Home</span>
        </button>

        <button
          className={`nav-item ${activePage === 'account' ? 'active' : ''}`}
          onClick={() => setActivePage('account')}
        >
          <User size={22} className="nav-icon" />
          <span className="nav-text">You</span>
        </button>


        <button
          className={`nav-item ${activePage === 'cart' ? 'active' : ''}`}
          onClick={() => setActivePage('cart')}
        >
          <div className="cart-icon-container">
            <ShoppingCart size={22} className="nav-icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
          <span className="nav-text">Cart</span>
        </button>

        <button
          className={`nav-item ${activePage === 'shop' ? 'active' : ''}`}
          onClick={() => setActivePage('shop')}
        >
          <Menu size={22} className="nav-icon" />
          <span className="nav-text">Browse</span>
        </button>

        <a
          href="https://www.instagram.com/a1fashionnnl/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon instagram-icon">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span className="nav-text">Insta</span>
        </a>
      </nav>

      {/* Styles for Bottom Nav */}
      <style>{`
        .mobile-bottom-nav {
          display: none; /* hidden on desktop */
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 65px;
          background-color: var(--color-bg-white);
          border-top: 1px solid var(--color-border);
          box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
          z-index: 990;
          justify-content: space-around;
          align-items: center;
          padding: 0 10px;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #555;
          text-align: center;
          font-size: 11px;
          font-weight: 500;
          flex: 1;
          height: 100%;
          gap: 2px;
          transition: var(--transition-fast);
        }

        .nav-icon {
          color: #333;
          stroke-width: 1.8px;
        }

        .nav-item.active {
          color: var(--color-primary);
        }

        .nav-item.active .nav-icon {
          color: var(--color-primary);
        }

        .cart-icon-container {
          position: relative;
        }

        .cart-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background-color: var(--color-accent);
          color: white;
          font-size: 9px;
          font-weight: 700;
          min-width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
        }

        .instagram-icon {
          color: #e1306c;
        }

        /* Show only on Mobile/Tablet */
        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
