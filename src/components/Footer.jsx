import React from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="a1-footer">
      <div className="container footer-grid">
        {/* Info Column */}
        <div className="footer-col info-col">
          <div className="logo-container" onClick={() => setActivePage('home')}>
            <span className="logo-a1">A1</span>
            <span className="logo-fashion">FASHION</span>
          </div>
          <p className="shop-description">
            A1 Fashion is your premier destination for high-end, contemporary men's streetwear, sharp formal wear, and premium essentials. Designed to elevate your daily style with confidence and class.
          </p>
          <div className="contact-details-list">
            <p><MapPin size={16} className="footer-icon" /> Mumbai, Maharashtra, India - 400001</p>
            <p><Phone size={16} className="footer-icon" /> +91 99999 99999</p>
            <p><Mail size={16} className="footer-icon" /> support@a1fashion.in</p>
          </div>
        </div>

        {/* Categories Column */}
        <div className="footer-col links-col">
          <h3>Quick Links</h3>
          <ul>
            <li><button onClick={() => setActivePage('home')}>Home</button></li>
            <li><button onClick={() => setActivePage('shop')}>Shop All Catalog</button></li>
            <li><button onClick={() => setActivePage('wishlist')}>My Wishlist</button></li>
            <li><button onClick={() => setActivePage('cart')}>Shopping Cart</button></li>
            <li><button onClick={() => setActivePage('account')}>Track Order</button></li>
          </ul>
        </div>

        {/* Instagram / Socials Column */}
        <div className="footer-col social-col">
          <h3>Follow Our Instagram</h3>
          <p className="insta-callout">Catch the latest drops, styling hacks, and streetwear updates on our handle!</p>
          <a
            href="https://www.instagram.com/a1fashionnnl/"
            target="_blank"
            rel="noopener noreferrer"
            className="insta-profile-btn"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            @a1fashionnnl
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} <strong>A1 Fashion</strong>. All rights reserved.</p>
          <div className="policy-links-footer">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Shipping Info</a>
          </div>
        </div>
      </div>

      <style>{`
        .a1-footer {
          background-color: var(--color-bg-light);
          border-top: 1px solid var(--color-border);
          padding: 60px 0 20px 0;
          margin-top: 60px;
          color: var(--color-body-dark);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1.8fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-col h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-heading);
          margin-bottom: 20px;
          position: relative;
        }

        .footer-col h3::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 30px;
          height: 2px;
          background-color: var(--color-primary);
        }

        .info-col .logo-container {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 20px;
        }

        .info-col .logo-a1 {
          background-color: var(--color-primary);
          color: white;
          font-weight: 800;
          font-size: 20px;
          padding: 2px 8px;
          border-radius: var(--border-radius-sm);
        }

        .info-col .logo-fashion {
          color: var(--color-heading);
          font-weight: 800;
          font-size: 20px;
          letter-spacing: 0.5px;
        }

        .shop-description {
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 20px;
          color: var(--color-body);
        }

        .contact-details-list p {
          font-size: 13px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--color-body-dark);
        }

        .footer-icon {
          color: var(--color-primary);
        }

        .links-col ul {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .links-col button {
          font-size: 13px;
          color: var(--color-body-dark);
          text-align: left;
          transition: var(--transition-fast);
        }

        .links-col button:hover {
          color: var(--color-primary);
          padding-left: 5px;
        }

        .admin-footer-link {
          color: var(--color-primary) !important;
          font-weight: 600;
        }

        .insta-callout {
          font-size: 13px;
          color: var(--color-body);
          margin-bottom: 15px;
        }

        .insta-profile-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: white;
          border: 1px solid var(--color-border);
          padding: 8px 15px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #e1306c;
          box-shadow: var(--shadow-sm);
          margin-bottom: 15px;
        }

        .insta-profile-btn:hover {
          background-color: #e1306c;
          color: white;
          border-color: #e1306c;
        }

        .insta-pics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .insta-pic-item {
          aspect-ratio: 1;
          border-radius: var(--border-radius-sm);
          overflow: hidden;
        }

        .insta-pic-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-fast);
        }

        .insta-pic-item img:hover {
          transform: scale(1.1);
        }

        .newsletter-col p {
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 15px;
          color: var(--color-body);
        }

        .newsletter-form {
          display: flex;
          background-color: white;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          overflow: hidden;
        }

        .newsletter-form input {
          flex: 1;
          border: none;
          padding: 10px 12px;
          font-size: 13px;
        }

        .newsletter-form button {
          background-color: var(--color-primary);
          color: white;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }

        .newsletter-form button:hover {
          background-color: var(--color-primary-hover);
        }

        .footer-bottom {
          border-top: 1px solid var(--color-border);
          padding-top: 20px;
          font-size: 12px;
        }

        .footer-bottom-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .policy-links-footer {
          display: flex;
          gap: 20px;
        }

        .policy-links-footer a {
          color: var(--color-body);
        }

        .policy-links-footer a:hover {
          color: var(--color-primary);
        }

        /* Responsive footer */
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
        }
        @media (max-width: 768px) {
          .a1-footer {
            padding: 40px 0 85px 0; /* Add bottom margin so it doesn't overlap mobile bottom nav bar */
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .footer-bottom-inner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
