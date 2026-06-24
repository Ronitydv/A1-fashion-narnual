import React from 'react';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';

export default function Wishlist({
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  setActivePage
}) {
  const handleAddToCart = (product) => {
    onAddToCart(product);
    onRemoveFromWishlist(product.id);
  };

  return (
    <div className="wishlist-page container animate-fade">
      <div className="wishlist-header text-left">
        <h1>Your Favourites Wishlist</h1>
        <p>Keep track of the men's styles you love and easily add them to your cart.</p>
      </div>

      {wishlist.length > 0 ? (
        <div className="wishlist-content-wrapper">
          {/* Desktop Table View */}
          <div className="wishlist-table-container">
            <table className="wishlist-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Actions</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map(item => (
                  <tr key={item.id}>
                    <td className="wishlist-prod-cell">
                      <img src={item.image} alt={item.title} className="wishlist-thumb" />
                      <div className="wishlist-meta-info text-left">
                        <span className="wishlist-category">{item.category}</span>
                        <h4 onClick={() => { setActivePage('detail'); window.dispatchEvent(new CustomEvent('a1_view_prod', { detail: item.id })); }}>
                          {item.title}
                        </h4>
                      </div>
                    </td>
                    <td className="wishlist-price-cell">
                      <strong>₹{item.price.toLocaleString('en-IN')}</strong>
                    </td>
                    <td className="wishlist-stock-cell">
                      {item.inStock > 0 ? (
                        <span className="stock-badge in-stock">In Stock</span>
                      ) : (
                        <span className="stock-badge out-stock">Out of Stock</span>
                      )}
                    </td>
                    <td className="wishlist-action-cell">
                      {item.inStock > 0 ? (
                        <button className="btn-primary" onClick={() => handleAddToCart(item)}>
                          <ShoppingCart size={14} /> Add to Cart
                        </button>
                      ) : (
                        <button className="btn-primary disabled-btn" disabled>
                          Sold Out
                        </button>
                      )}
                    </td>
                    <td className="wishlist-remove-cell">
                      <button className="delete-btn" onClick={() => onRemoveFromWishlist(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="wishlist-cards-mobile">
            {wishlist.map(item => (
              <div key={item.id} className="wishlist-mobile-card">
                <div className="wishlist-mobile-main">
                  <img src={item.image} alt={item.title} className="wishlist-thumb-mobile" />
                  <div className="wishlist-mobile-details text-left">
                    <span className="wishlist-category">{item.category}</span>
                    <h4 onClick={() => { setActivePage('detail'); window.dispatchEvent(new CustomEvent('a1_view_prod', { detail: item.id })); }}>
                      {item.title}
                    </h4>
                    <strong className="wishlist-price-mobile">₹{item.price.toLocaleString('en-IN')}</strong>
                    <div className="mobile-stock-badge-row">
                      {item.inStock > 0 ? (
                        <span className="stock-badge in-stock">In Stock</span>
                      ) : (
                        <span className="stock-badge out-stock">Sold Out</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="wishlist-mobile-actions">
                  {item.inStock > 0 ? (
                    <button className="btn-primary" onClick={() => handleAddToCart(item)}>
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                  ) : (
                    <button className="btn-primary disabled-btn" disabled>
                      Sold Out
                    </button>
                  )}
                  <button className="mobile-delete-btn" onClick={() => onRemoveFromWishlist(item.id)}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-wishlist-state text-center animate-fade">
          <div className="ambient-background-card">
            {/* SVG Animated Viewport (Background) */}
            <div className="ambient-svg-bg">
              <svg className="wishlist-svg-animation" viewBox="0 0 400 250" style={{ width: '100%', height: '100%', opacity: 0.35 }}>
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Bouncing Oops Text */}
                <text x="50%" y="30%" className="oops-animated-text" textAnchor="middle">OOPS!</text>
                
                {/* Floating Pulsing Hearts */}
                <g className="drifting-hearts">
                  {/* Big pulsing heart */}
                  <path className="pulsing-heart" d="M 200,165 C 200,165 160,125 160,100 C 160,80 175,65 195,65 C 205,65 210,75 215,80 C 220,75 225,65 235,65 C 255,65 270,80 270,100 C 270,125 230,165 230,165 Z" fill="rgba(247, 75, 129, 0.2)" stroke="var(--color-accent)" strokeWidth="3" />
                  
                  {/* Floating little hearts */}
                  <path className="floating-heart fh-1" d="M 120,110 C 120,110 100,90 100,75 C 100,63 110,55 120,55 C 125,55 128,60 130,63 C 132,60 135,55 140,55 C 150,55 160,63 160,75 C 160,90 140,110 140,110 Z" fill="rgba(247, 75, 129, 0.4)" />
                  <path className="floating-heart fh-2" d="M 290,140 C 290,140 275,125 275,112 C 275,103 282,97 290,97 C 294,97 297,101 298,103 C 299,101 302,97 306,97 C 314,97 320,103 320,112 C 320,125 305,140 305,140 Z" fill="rgba(247, 75, 129, 0.3)" />
                </g>
              </svg>
            </div>

            {/* Foreground Content */}
            <div className="card-foreground-content">
              <span className="error-badge-premium">404 WISHLIST EMPTY</span>
              <h2 className="empty-title-premium">Your wishlist is completely empty!</h2>
              <p className="empty-desc-premium">Keep track of the men's styles you love by saving them from our shop catalog.</p>
              <button className="btn-primary-premium" onClick={() => setActivePage('shop')}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .wishlist-page {
          padding-top: 40px;
        }

        .wishlist-header h1 {
          font-family: var(--font-serif);
          font-size: 32px;
          margin-bottom: 8px;
        }

        .wishlist-header p {
          font-size: 14px;
          color: var(--color-body);
          margin-bottom: 40px;
        }

        .wishlist-table-container {
          overflow-x: auto;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          background-color: white;
          margin-bottom: 30px;
        }

        .wishlist-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .wishlist-table th, .wishlist-table td {
          padding: 15px 20px;
          border-bottom: 1px solid var(--color-border);
        }

        .wishlist-table th {
          background-color: var(--color-bg-light);
          color: var(--color-heading);
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
        }

        .wishlist-prod-cell {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .wishlist-thumb {
          width: 60px;
          height: 60px;
          border-radius: var(--border-radius-sm);
          object-fit: cover;
          background-color: var(--color-bg-light);
        }

        .wishlist-meta-info h4 {
          font-size: 14px;
          color: var(--color-heading);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .wishlist-meta-info h4:hover {
          color: var(--color-primary);
        }

        .wishlist-category {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--color-body);
          display: block;
          margin-bottom: 4px;
        }

        .stock-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .stock-badge.in-stock {
          background-color: var(--color-primary-light);
          color: var(--color-primary);
        }

        .stock-badge.out-stock {
          background-color: #ffefef;
          color: var(--color-danger);
        }

        .delete-btn {
          color: var(--color-body);
          transition: var(--transition-fast);
          padding: 5px;
        }

        .delete-btn:hover {
          color: var(--color-danger);
          transform: scale(1.1);
        }

        .disabled-btn {
          background-color: #ddd !important;
          color: #aaa !important;
          cursor: not-allowed;
        }

        .empty-wishlist-state {
          padding: 60px 20px;
          background-color: var(--color-bg-light);
          border-radius: var(--border-radius-lg);
          border: 1px dashed var(--color-border);
        }

        .empty-heart-icon-holder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          box-shadow: var(--shadow-sm);
          animation: floatHeart 2.2s ease-in-out infinite;
        }

        .floating-heart-icon {
          transition: var(--transition-fast);
        }

        @keyframes floatHeart {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.08); }
        }

        .empty-wishlist-state h3 {
          font-size: 22px;
          margin-bottom: 8px;
        }

        .empty-wishlist-state p {
          font-size: 14px;
          color: var(--color-body);
          margin-bottom: 25px;
        }

        /* Mobile views */
        .wishlist-cards-mobile {
          display: none;
        }

        @media (max-width: 768px) {
          .wishlist-table-container {
            display: none;
          }
          .wishlist-cards-mobile {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          .wishlist-mobile-card {
            background-color: white;
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius-md);
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          .wishlist-mobile-main {
            display: flex;
            gap: 15px;
          }
          .wishlist-thumb-mobile {
            width: 70px;
            height: 70px;
            border-radius: var(--border-radius-sm);
            object-fit: cover;
            background-color: var(--color-bg-light);
          }
          .wishlist-mobile-details {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .wishlist-mobile-details h4 {
            font-size: 13px;
            font-weight: 600;
          }
          .wishlist-price-mobile {
            color: var(--color-primary);
            font-size: 14px;
          }
          .mobile-stock-badge-row {
            margin-top: 4px;
          }
          .wishlist-mobile-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid var(--color-border);
            padding-top: 12px;
          }
          .mobile-delete-btn {
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
          background: linear-gradient(135deg, #1f151b 0%, #0f0a0d 100%);
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
          background-color: rgba(247, 75, 129, 0.15);
          color: #f74b81;
          border: 1px solid rgba(247, 75, 129, 0.3);
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
          color: #c9b5bd;
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

        .pulsing-heart {
          transform-origin: 215px 115px;
          animation: pulseHeart 1.2s ease-in-out infinite alternate;
        }

        .floating-heart {
          animation: floatHeart 3s ease-in-out infinite;
        }

        .fh-1 {
          transform-origin: 130px 80px;
          animation-delay: 0.5s;
        }

        .fh-2 {
          transform-origin: 298px 118px;
          animation-delay: 1.2s;
        }

        @keyframes strokeDash {
          0% { stroke-dasharray: 0 100; fill: rgba(255,255,255,0); }
          50% { stroke-dasharray: 100 0; fill: rgba(255,255,255,0.04); }
          100% { stroke-dasharray: 0 100; fill: rgba(255,255,255,0); }
        }

        @keyframes pulseHeart {
          0% { transform: scale(0.9); }
          100% { transform: scale(1.1); fill: rgba(247, 75, 129, 0.4); }
        }

        @keyframes floatHeart {
          0% { transform: translateY(15px) scale(0.8); opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateY(-25px) scale(1.1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
