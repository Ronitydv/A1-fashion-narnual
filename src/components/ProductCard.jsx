import React from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';

export default function ProductCard({
  product,
  onViewProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) {
  const { id, title, price, originalPrice, category, image, rating, reviewsCount, featured, inStock, salesCount } = product;
  
  // Calculate discount percentage
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="product-card animate-fade">
      {/* Product Image Area */}
      <div className="product-img-wrapper">
        <img src={image} alt={title} className="product-main-img" onClick={() => onViewProduct(id)} />
        
        {/* Badges */}
        <div className="badge-container">
          {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
          {featured && <span className="badge badge-hot">Hot</span>}
          {salesCount >= 30 && <span className="badge badge-best">Best Seller</span>}
          {inStock <= 5 && inStock > 0 && <span className="badge badge-warning">Only {inStock} left!</span>}
          {inStock === 0 && <span className="badge badge-danger">Out of Stock</span>}
        </div>

        {/* Hover Quick Actions */}
        <div className="quick-actions-overlay">
          <button 
            onClick={() => onToggleWishlist(product)} 
            className={`action-icon-btn ${isWishlisted ? 'wishlisted' : ''}`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={18} fill={isWishlisted ? "var(--color-accent)" : "none"} />
          </button>
          <button onClick={() => onViewProduct(id)} className="action-icon-btn" title="Quick View">
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Product Body details */}
      <div className="product-details">
        <span className="product-cat-label">{category}</span>
        <h3 className="product-title-heading" onClick={() => onViewProduct(id)}>
          {title}
        </h3>
        
        {/* Rating */}
        <div className="product-rating-row">
          <div className="stars-row">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={13} 
                fill={i < Math.floor(rating) ? "#ffb300" : "none"} 
                color={i < Math.floor(rating) ? "#ffb300" : "#ccc"} 
              />
            ))}
          </div>
          <span className="rating-score-txt">{rating} ({reviewsCount})</span>
        </div>

        {/* Price & Cart row */}
        <div className="product-price-row">
          <div className="price-block">
            <span className="current-price-tag">₹{price.toLocaleString('en-IN')}</span>
            {originalPrice && <span className="original-price-tag">₹{originalPrice.toLocaleString('en-IN')}</span>}
          </div>
          {inStock > 0 ? (
            <button 
              onClick={() => onAddToCart(product)} 
              className="quick-add-cart-btn" 
              title="Add to Cart"
            >
              <ShoppingCart size={15} />
            </button>
          ) : (
            <span className="out-of-stock-label">Sold Out</span>
          )}
        </div>
      </div>

      <style>{`
        .product-card {
          background-color: var(--color-bg-white);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          position: relative;
          transition: var(--transition-normal);
        }

        .product-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--color-primary-light);
          transform: translateY(-5px);
        }

        .product-img-wrapper {
          position: relative;
          background-color: var(--color-bg-light);
          aspect-ratio: 1 / 1.1;
          overflow: hidden;
          cursor: pointer;
        }

        .product-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-card:hover .product-main-img {
          transform: scale(1.08);
        }

        .badge-container {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 5;
        }

        .quick-actions-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.9);
          display: flex;
          gap: 10px;
          opacity: 0;
          visibility: hidden;
          transition: var(--transition-normal);
          z-index: 10;
        }

        .product-card:hover .quick-actions-overlay {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, -50%) scale(1);
        }

        .action-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--color-bg-white);
          color: var(--color-heading);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
          transition: var(--transition-fast);
        }

        .action-icon-btn:hover {
          background-color: var(--color-primary);
          color: white;
          transform: translateY(-2px);
        }

        .action-icon-btn.wishlisted {
          color: var(--color-accent);
        }

        .product-details {
          padding: 18px;
          text-align: left;
        }

        .product-cat-label {
          font-size: 11px;
          text-transform: uppercase;
          color: var(--color-body);
          font-weight: 500;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 5px;
        }

        .product-title-heading {
          font-size: 15px;
          font-weight: 600;
          color: var(--color-heading);
          margin-bottom: 8px;
          line-height: 1.4;
          cursor: pointer;
          height: 42px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          transition: var(--transition-fast);
        }

        .product-title-heading:hover {
          color: var(--color-primary);
        }

        .product-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .stars-row {
          display: flex;
          gap: 2px;
        }

        .rating-score-txt {
          font-size: 12px;
          color: var(--color-body);
        }

        .product-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .price-block {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .current-price-tag {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-primary);
        }

        .original-price-tag {
          font-size: 13px;
          color: var(--color-body);
          text-decoration: line-through;
        }

        .quick-add-cart-btn {
          width: 32px;
          height: 32px;
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }

        .quick-add-cart-btn:hover {
          background-color: var(--color-primary);
          color: white;
        }

        .out-of-stock-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-danger);
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .product-details {
            padding: 12px;
          }
          .product-title-heading {
            font-size: 13px;
            height: 36px;
          }
          .current-price-tag {
            font-size: 14px;
          }
          .original-price-tag {
            font-size: 11px;
          }
          .quick-add-cart-btn {
            width: 28px;
            height: 28px;
          }
          /* Keep buttons visible directly instead of hover overlay on mobile */
          .quick-actions-overlay {
            display: none;
          }
          .badge-container {
            top: 6px;
            left: 6px;
          }
          .badge {
            padding: 2px 6px;
            font-size: 9px;
          }
        }
      `}</style>
    </div>
  );
}
