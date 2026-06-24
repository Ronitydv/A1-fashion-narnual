import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, Heart, Ruler } from 'lucide-react';
import { getReviews, addReview } from '../utils/db';

export default function ProductDetail({
  productId,
  products,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  setActivePage
}) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    return (
      <div className="container text-center section-padding">
        <h3>Product Not Found</h3>
        <button className="btn-primary" onClick={() => setActivePage('shop')}>Back to Shop</button>
      </div>
    );
  }

  const { title, price, originalPrice, category, image, description, specs, inStock, rating, reviewsCount } = product;

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc'); // 'desc', 'specs', 'reviews'
  
  // Reviews state
  const [reviewsList, setReviewsList] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Size Guide state
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    // Load reviews on mount
    const fetchReviews = async () => {
      const list = await getReviews(product.id);
      setReviewsList(list);
    };
    fetchReviews();
    // Reset review form
    setNewComment('');
    setReviewerName('');
    setReviewSuccess(false);
  }, [product.id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName || !newComment) return;

    const reviewObj = {
      name: reviewerName,
      rating: newRating,
      comment: newComment
    };

    try {
      await addReview(product.id, reviewObj);
      const list = await getReviews(product.id);
      setReviewsList(list);
      setReviewSuccess(true);
      setNewComment('');
      setReviewerName('');
      // Dispatch catalog update event to tell parent products have changed (like review rating)
      window.dispatchEvent(new CustomEvent('a1_catalog_updated'));
    } catch (err) {
      alert(err.message || 'Failed to submit review.');
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
  };

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const isWishlisted = wishlist.some(item => item.id === product.id);

  return (
    <div className="product-detail-page container animate-fade">
      {/* Breadcrumbs */}
      <div className="breadcrumbs-nav">
        <button onClick={() => setActivePage('home')}>Home</button> / 
        <button onClick={() => setActivePage('shop')}>Shop</button> / 
        <span className="current-crumb">{title}</span>
      </div>

      {/* Main product box */}
      <div className="detail-layout">
        {/* Left Side: Product Gallery */}
        <div className="gallery-container">
          <div className="main-preview-box">
            <img src={image} alt={title} className="detail-main-image" />
          </div>
          {/* Thumbnails row (mock gallery) */}
          <div className="thumbnails-row">
            <div className="thumb-item active"><img src={image} alt="thumb" /></div>
            <div className="thumb-item"><img src={image} alt="thumb" /></div>
          </div>
        </div>

        {/* Right Side: Product Meta & Purchase Panel */}
        <div className="purchase-panel">
          <span className="detail-cat-label">{category}</span>
          <h1 className="detail-title">{title}</h1>

          {/* Rating */}
          <div className="rating-summary-row">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={15} 
                  fill={i < Math.floor(product.rating) ? "#ffb300" : "none"} 
                  color={i < Math.floor(product.rating) ? "#ffb300" : "#ccc"} 
                />
              ))}
            </div>
            <span className="rating-label-txt">{product.rating} Star Rating ({reviewsList.length + product.reviewsCount} Customer Reviews)</span>
          </div>

          {/* Price */}
          <div className="detail-price-box">
            <span className="detail-current-price">₹{price.toLocaleString('en-IN')}</span>
            {originalPrice && (
              <>
                <span className="detail-original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
                <span className="detail-discount-badge">{discount}% Off</span>
              </>
            )}
          </div>

          {/* Low Stock Warning Alert Banner */}
          {inStock > 0 && inStock <= 5 && (
            <div className="low-stock-detail-banner animate-blink">
              ⚠️ Only {inStock} piece{inStock > 1 ? 's' : ''} left - buy now!
            </div>
          )}

          <p className="detail-desc-short">{description}</p>

          {/* Sizing Section */}
          <div className="options-selector-group">
            <div className="selector-title-row">
              <span>Select Size:</span>
              <button className="size-guide-trigger-btn" onClick={() => setSizeGuideOpen(true)}>
                <Ruler size={14} /> Size Guide
              </button>
            </div>
            <div className="sizes-options-buttons">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`size-btn-item ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Section */}
          <div className="options-selector-group">
            <span>Select Color: <strong>{selectedColor}</strong></span>
            <div className="colors-options-buttons">
              {product.colors.map(color => (
                <button
                  key={color}
                  className={`color-btn-item ${selectedColor === color ? 'active' : ''}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row: Quantity + Add Cart + Wishlist */}
          {inStock > 0 ? (
            <div className="cart-action-row">
              <div className="quantity-adjuster">
                <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>

              <button className="btn-primary flex-1-btn" onClick={handleAddToCartClick}>
                <ShoppingCart size={18} /> Add to Cart
              </button>

              <button 
                className={`wishlist-toggle-btn-detail ${isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(product)}
                title="Save to Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? "var(--color-accent)" : "none"} />
              </button>
            </div>
          ) : (
            <div className="out-of-stock-alert">
              🚫 Out of Stock - We are restocking this item shortly.
            </div>
          )}

          {/* Trust badges */}
          <div className="trust-bullets">
            <p><Truck size={16} /> Free shipping on orders over ₹1,499</p>
            <p><RefreshCw size={16} /> 7-day hassle-free returns</p>
            <p><ShieldCheck size={16} /> 100% Original men's premium apparel guaranteed</p>
          </div>
        </div>
      </div>

      {/* Tabs description / Specifications / Reviews */}
      <section className="product-tabs-section">
        <div className="tabs-nav-bar">
          <button className={`tab-nav-item ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>
            Description
          </button>
          <button className={`tab-nav-item ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>
            Specifications
          </button>
          <button className={`tab-nav-item ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
            Reviews ({reviewsList.length + product.reviewsCount})
          </button>
        </div>

        <div className="tab-pane-content">
          {activeTab === 'desc' && (
            <div className="desc-tab-pane animate-fade text-left">
              <p>{description}</p>
              <br />
              <p>Designed with meticulous attention to detail, A1 Fashion guarantees durable seams, premium zippers, and premium custom sizing tailored for Indian body shapes. Style it casually with white sneakers or elevate it under a blazer for semi-formal gatherings.</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="specs-tab-pane animate-fade text-left">
              <table className="specs-table">
                <tbody>
                  {Object.entries(specs).map(([key, val]) => (
                    <tr key={key}>
                      <td className="spec-key">{key}</td>
                      <td className="spec-value">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab-pane animate-fade">
              <div className="reviews-layout">
                {/* Reviews List */}
                <div className="reviews-list-block text-left">
                  <h3>Customer Experiences</h3>
                  {reviewsList.length > 0 ? (
                    <div className="reviews-scroll-area">
                      {reviewsList.map((rev) => (
                        <div key={rev.id} className="review-item">
                          <div className="review-item-header">
                            <span className="reviewer-name">{rev.name}</span>
                            <span className="review-date">{rev.date}</span>
                          </div>
                          <div className="review-stars-row">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                fill={i < rev.rating ? "#ffb300" : "none"} 
                                color={i < rev.rating ? "#ffb300" : "#ccc"} 
                              />
                            ))}
                          </div>
                          <p className="review-comment-txt">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-reviews-state">
                      <p>No ratings yet. Be the first to express your thoughts about this product!</p>
                    </div>
                  )}
                </div>

                {/* Write Review Form */}
                <div className="write-review-block text-left">
                  <h3>Share Your Experience</h3>
                  {reviewSuccess && (
                    <div className="review-success-msg">
                      🎉 Review submitted successfully! Thank you for rating A1 Fashion.
                    </div>
                  )}
                  <form onSubmit={handleReviewSubmit} className="review-submit-form">
                    <div className="review-input-group">
                      <label>Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sen"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="review-input-group">
                      <label>Product Rating</label>
                      <div className="rating-select-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="star-selector-btn"
                          >
                            <Star 
                              size={22} 
                              fill={star <= newRating ? "#ffb300" : "none"} 
                              color={star <= newRating ? "#ffb300" : "#ccc"} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="review-input-group">
                      <label>Comments / Feedback</label>
                      <textarea
                        rows={4}
                        placeholder="What did you like or dislike about the fit, quality, or colors?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn-primary">Submit Review</button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Size Guide Modal Popup */}
      {sizeGuideOpen && (
        <div className="size-guide-modal-overlay animate-fade">
          <div className="size-guide-card animate-slide-up">
            <button className="close-guide-btn" onClick={() => setSizeGuideOpen(false)}>×</button>
            <h2>Men's Fit Size Guide</h2>
            <p className="size-guide-subtitle">Standard dimensions in inches. Fits true to size.</p>
            <table className="size-guide-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (in)</th>
                  <th>Shoulders (in)</th>
                  <th>Length (in)</th>
                  <th>Sleeve Length (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>S</strong></td>
                  <td>38"</td>
                  <td>17.5"</td>
                  <td>27"</td>
                  <td>24.5"</td>
                </tr>
                <tr>
                  <td><strong>M</strong></td>
                  <td>40"</td>
                  <td>18"</td>
                  <td>28"</td>
                  <td>25"</td>
                </tr>
                <tr>
                  <td><strong>L</strong></td>
                  <td>42"</td>
                  <td>19"</td>
                  <td>29"</td>
                  <td>25.5"</td>
                </tr>
                <tr>
                  <td><strong>XL</strong></td>
                  <td>44"</td>
                  <td>20"</td>
                  <td>30"</td>
                  <td>26"</td>
                </tr>
              </tbody>
            </table>
            <div className="measurement-tips text-left">
              <h4>How to Measure:</h4>
              <ul>
                <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
                <li><strong>Shoulder:</strong> Measure from the edge of one shoulder bone to the other across the back.</li>
                <li><strong>Length:</strong> Measure from the highest point of the shoulder down to the waist.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .product-detail-page {
          padding-top: 30px;
        }

        .breadcrumbs-nav {
          text-align: left;
          font-size: 13px;
          margin-bottom: 30px;
          color: var(--color-body);
        }

        .breadcrumbs-nav button {
          color: var(--color-body);
          font-weight: 500;
          font-size: 13px;
          background: none;
          border: none;
        }

        .breadcrumbs-nav button:hover {
          color: var(--color-primary);
        }

        .current-crumb {
          color: var(--color-heading);
          font-weight: 600;
          margin-left: 5px;
        }

        .detail-layout {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 40px;
          margin-bottom: 50px;
        }

        .main-preview-box {
          background-color: var(--color-bg-light);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          aspect-ratio: 1;
        }

        .detail-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-normal);
        }

        .thumbnails-row {
          display: flex;
          gap: 12px;
          margin-top: 15px;
        }

        .thumb-item {
          width: 70px;
          height: 70px;
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          background-color: var(--color-bg-light);
        }

        .thumb-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumb-item.active {
          border-color: var(--color-primary);
        }

        .purchase-panel {
          text-align: left;
        }

        .detail-cat-label {
          font-size: 12px;
          text-transform: uppercase;
          color: var(--color-primary);
          font-weight: 700;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 10px;
        }

        .detail-title {
          font-family: var(--font-serif);
          font-size: 32px;
          color: var(--color-heading);
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .rating-summary-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .rating-label-txt {
          font-size: 13px;
          color: var(--color-body);
        }

        .detail-price-box {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 20px;
        }

        .detail-current-price {
          font-size: 28px;
          font-weight: 800;
          color: var(--color-primary);
        }

        .detail-original-price {
          font-size: 18px;
          color: var(--color-body);
          text-decoration: line-through;
        }

        .detail-discount-badge {
          background-color: var(--color-accent-orange);
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .detail-desc-short {
          font-size: 14px;
          line-height: 1.6;
          color: var(--color-body-dark);
          margin-bottom: 25px;
        }

        .options-selector-group {
          margin-bottom: 20px;
        }

        .selector-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .options-selector-group span {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-heading);
          display: block;
          margin-bottom: 8px;
        }

        .size-guide-trigger-btn {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-primary);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .sizes-options-buttons, .colors-options-buttons {
          display: flex;
          gap: 10px;
        }

        .size-btn-item {
          width: 42px;
          height: 42px;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
          background: white;
          color: var(--color-heading);
          transition: var(--transition-fast);
        }

        .size-btn-item.active, .size-btn-item:hover {
          border-color: var(--color-primary);
          background-color: var(--color-primary-light);
          color: var(--color-primary);
        }

        .color-btn-item {
          padding: 8px 16px;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          background: white;
          color: var(--color-heading);
          transition: var(--transition-fast);
        }

        .color-btn-item.active, .color-btn-item:hover {
          border-color: var(--color-primary);
          background-color: var(--color-primary-light);
          color: var(--color-primary);
        }

        .cart-action-row {
          display: flex;
          gap: 15px;
          margin-top: 30px;
          margin-bottom: 30px;
        }

        .quantity-adjuster {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          background-color: var(--color-bg-light);
        }

        .quantity-adjuster button {
          padding: 10px 15px;
          font-weight: 700;
          color: var(--color-heading);
          background-color: white;
        }

        .quantity-adjuster span {
          padding: 0 15px;
          font-weight: 600;
          color: var(--color-heading);
        }

        .flex-1-btn {
          flex: 1;
        }

        .wishlist-toggle-btn-detail {
          width: 48px;
          height: 48px;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-body);
          transition: var(--transition-fast);
        }

        .wishlist-toggle-btn-detail:hover, .wishlist-toggle-btn-detail.active {
          color: var(--color-accent);
          border-color: var(--color-accent);
          background-color: #fff1f4;
        }

        .out-of-stock-alert {
          background-color: #fff2e8;
          border: 1px solid var(--color-accent-orange);
          padding: 15px;
          border-radius: var(--border-radius-sm);
          color: var(--color-accent-orange);
          font-weight: 600;
          font-size: 14px;
          margin-top: 20px;
        }

        .trust-bullets {
          border-top: 1px solid var(--color-border);
          padding-top: 20px;
        }

        .trust-bullets p {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          color: var(--color-body-dark);
        }

        .product-tabs-section {
          margin-top: 60px;
          border-top: 1px solid var(--color-border);
          padding-top: 30px;
        }

        .tabs-nav-bar {
          display: flex;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 30px;
        }

        .tab-nav-item {
          padding: 12px 25px;
          font-size: 14px;
          font-weight: 700;
          color: var(--color-body);
          position: relative;
          border-bottom: 2px solid transparent;
        }

        .tab-nav-item.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        .tab-pane-content {
          min-height: 150px;
        }

        .specs-table {
          width: 100%;
          max-width: 600px;
          border-collapse: collapse;
        }

        .specs-table tr {
          border-bottom: 1px solid var(--color-border);
        }

        .specs-table td {
          padding: 10px 15px;
          font-size: 13px;
        }

        .spec-key {
          font-weight: 700;
          color: var(--color-heading);
          width: 40%;
          background-color: var(--color-bg-light);
        }

        .spec-value {
          color: var(--color-body-dark);
        }

        .reviews-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
        }

        .reviews-list-block h3, .write-review-block h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .review-item {
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 15px;
          margin-bottom: 15px;
        }

        .review-item-header {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .reviewer-name {
          font-weight: 700;
          color: var(--color-heading);
        }

        .review-date {
          color: var(--color-body);
        }

        .review-stars-row {
          margin-bottom: 8px;
        }

        .review-comment-txt {
          font-size: 13px;
          color: var(--color-body-dark);
          line-height: 1.5;
        }

        .reviews-scroll-area {
          max-height: 400px;
          overflow-y: auto;
          padding-right: 10px;
        }

        .review-success-msg {
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          padding: 10px 15px;
          border-radius: var(--border-radius-sm);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .review-submit-form .review-input-group {
          margin-bottom: 15px;
        }

        .review-submit-form label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-heading);
          margin-bottom: 6px;
        }

        .review-submit-form input, .review-submit-form textarea {
          width: 100%;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          padding: 10px 12px;
          font-size: 13px;
        }

        .rating-select-stars {
          display: flex;
          gap: 6px;
        }

        /* Size Guide Modal Overlay */
        .size-guide-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(37, 61, 83, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2100;
          padding: 15px;
        }

        .size-guide-card {
          background: white;
          border-radius: var(--border-radius-lg);
          padding: 30px;
          width: 100%;
          max-width: 500px;
          position: relative;
          box-shadow: var(--shadow-lg);
        }

        .close-guide-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 24px;
          color: var(--color-body);
        }

        .size-guide-card h2 {
          font-family: var(--font-serif);
          font-size: 22px;
          margin-bottom: 5px;
        }

        .size-guide-subtitle {
          font-size: 12px;
          color: var(--color-body);
          margin-bottom: 20px;
        }

        .size-guide-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .size-guide-table th, .size-guide-table td {
          border: 1px solid var(--color-border);
          padding: 8px 12px;
          font-size: 13px;
        }

        .size-guide-table th {
          background-color: var(--color-bg-light);
          color: var(--color-heading);
          font-weight: 700;
        }

        .measurement-tips h4 {
          font-size: 13px;
          margin-bottom: 8px;
        }

        .measurement-tips ul {
          font-size: 12px;
          list-style-type: disc;
          padding-left: 15px;
          color: var(--color-body-dark);
        }

        }

        .low-stock-detail-banner {
          background-color: #fff2e8;
          border: 1px solid var(--color-accent-orange);
          padding: 8px 12px;
          border-radius: var(--border-radius-sm);
          color: var(--color-accent-orange);
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 20px;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .animate-blink {
          animation: blink 1.5s infinite;
        }

        .measurement-tips li {
          margin-bottom: 4px;
        }

        /* Responsive Layout */
        @media (max-width: 768px) {
          .detail-layout {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .detail-title {
            font-size: 24px;
          }
          .detail-current-price {
            font-size: 22px;
          }
          .cart-action-row {
            flex-wrap: wrap;
          }
          .flex-1-btn {
            order: 3;
            width: 100%;
            flex: none;
          }
          .reviews-layout {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }
      `}</style>
    </div>
  );
}
