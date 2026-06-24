import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, RefreshCw, Search } from 'lucide-react';

export default function Shop({
  products,
  onViewProduct,
  onAddToCart,
  onToggleWishlist,
  wishlist
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [priceRange, setPriceRange] = useState(6000); // Max seed price is ~4599
  const [sortOption, setSortOption] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Listen to global filter events (from header or home links)
  useEffect(() => {
    const handleCategoryFilter = (e) => {
      setSelectedCategory(e.detail);
      // scroll to top of catalog if needed
    };
    const handleSearchEvent = (e) => {
      setSearchQuery(e.detail);
    };

    window.addEventListener('a1_filter_cat', handleCategoryFilter);
    window.addEventListener('a1_search', handleSearchEvent);

    return () => {
      window.removeEventListener('a1_filter_cat', handleCategoryFilter);
      window.removeEventListener('a1_search', handleSearchEvent);
    };
  }, []);

  // Filter & Sort logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSize = selectedSize === 'all' || product.sizes.includes(selectedSize);
    const matchesPrice = product.price <= priceRange;
    const matchesSearch = searchQuery === '' || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSize && matchesPrice && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    if (sortOption === 'best-selling') return (b.salesCount || 0) - (a.salesCount || 0); // Sort by sales count
    return 0; // Default featured (order as in db)
  });

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setPriceRange(6000);
    setSearchQuery('');
    setSortOption('featured');
  };

  return (
    <div className="shop-page container animate-fade">
      {/* Breadcrumb / Title */}
      <div className="shop-header">
        <h1 className="shop-title">Men's Apparel Catalog</h1>
        <p className="shop-desc-txt">Showing {sortedProducts.length} of {products.length} styles</p>
      </div>

      {/* Top Options Bar */}
      <div className="shop-options-bar">
        {/* Mobile Filter Toggle */}
        <button className="mobile-filter-btn" onClick={() => setMobileFilterOpen(true)}>
          <Filter size={18} /> Filters
        </button>

        {/* Search Display Indicator if active */}
        {searchQuery && (
          <div className="active-search-indicator">
            Search: <strong>"{searchQuery}"</strong>
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          </div>
        )}

        {/* Sort Select */}
        <div className="sort-container">
          <ArrowUpDown size={16} className="sort-icon" />
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-dropdown"
          >
            <option value="featured">Featured Styles</option>
            <option value="best-selling">Best Sellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Catalog Layout */}
      <div className="shop-layout">
        {/* Filters Sidebar (Desktop) */}
        <aside className={`filters-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="reset-filters-btn" onClick={resetFilters} title="Reset all filters">
              <RefreshCw size={14} /> Clear
            </button>
            <button className="mobile-close-filters" onClick={() => setMobileFilterOpen(false)}>×</button>
          </div>

          {/* Search Sub-Filter */}
          <div className="filter-group">
            <h4>Search Keywords</h4>
            <div className="sidebar-search-wrapper">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="search-side-icon" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <h4>Categories</h4>
            <ul className="filter-links-list">
              <li>
                <button 
                  className={selectedCategory === 'all' ? 'active' : ''}
                  onClick={() => setSelectedCategory('all')}
                >
                  All Men's Fashion
                </button>
              </li>
              <li>
                <button 
                  className={selectedCategory === 'shirts' ? 'active' : ''}
                  onClick={() => setSelectedCategory('shirts')}
                >
                  Shirts
                </button>
              </li>
              <li>
                <button 
                  className={selectedCategory === 'hoodies' ? 'active' : ''}
                  onClick={() => setSelectedCategory('hoodies')}
                >
                  Hoodies
                </button>
              </li>
              <li>
                <button 
                  className={selectedCategory === 'suits' ? 'active' : ''}
                  onClick={() => setSelectedCategory('suits')}
                >
                  Suits / Blazers
                </button>
              </li>
              <li>
                <button 
                  className={selectedCategory === 'streetwear' ? 'active' : ''}
                  onClick={() => setSelectedCategory('streetwear')}
                >
                  Streetwear
                </button>
              </li>
              <li>
                <button 
                  className={selectedCategory === 'accessories' ? 'active' : ''}
                  onClick={() => setSelectedCategory('accessories')}
                >
                  Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Sizing Filter */}
          <div className="filter-group">
            <h4>Filter By Size</h4>
            <div className="sizes-filter-buttons">
              {['all', 'S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  className={`size-filter-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size === 'all' ? 'All' : size}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h4>Max Price: <strong className="price-tag-value">₹{priceRange.toLocaleString('en-IN')}</strong></h4>
            <input
              type="range"
              min={999}
              max={6000}
              step={100}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="price-slider-input"
            />
            <div className="slider-limits">
              <span>Min: ₹999</span>
              <span>Max: ₹6,000</span>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="shop-products-main">
          {sortedProducts.length > 0 ? (
            <div className="grid-3">
              {sortedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewProduct={onViewProduct}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.some(item => item.id === product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="no-products-state text-center animate-fade">
              <div className="ambient-background-card">
                {/* SVG Animated Viewport (Background) */}
                <div className="ambient-svg-bg">
                  <svg className="search-svg-animation" viewBox="0 0 400 250" style={{ width: '100%', height: '100%', opacity: 0.35 }}>
                    {/* Background Grid */}
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Bouncing Oops Text */}
                    <text x="50%" y="30%" className="oops-animated-text" textAnchor="middle">OOPS!</text>
                    
                    {/* Scanning Magnifying Glass & Laser */}
                    <g className="scanning-glass">
                      {/* Laser Scan Cone */}
                      <polygon points="120,50 280,50 330,190 70,190" fill="rgba(8, 129, 120, 0.08)" className="laser-cone" />
                      <line x1="70" y1="190" x2="330" y2="190" stroke="var(--color-primary)" strokeWidth="2" className="laser-line" />
                      
                      {/* Magnifying Glass */}
                      <g className="magnifier-float">
                        <circle cx="200" cy="110" r="30" fill="none" stroke="white" strokeWidth="4" />
                        <line x1="221" y1="131" x2="245" y2="155" stroke="white" strokeWidth="6" strokeLinecap="round" />
                        {/* Question mark inside lens */}
                        <text x="200" y="118" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">?</text>
                      </g>
                    </g>
                  </svg>
                </div>

                {/* Foreground Content */}
                <div className="card-foreground-content">
                  <span className="error-badge-premium">404 STYLE NOT FOUND</span>
                  <h2 className="empty-title-premium">No matching styles found</h2>
                  <p className="empty-desc-premium">We couldn't find any men's styles matching your search keywords or price filter bounds.</p>
                  <button className="btn-primary-premium" onClick={resetFilters}>
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .shop-page {
          padding-top: 40px;
        }

        .shop-header {
          text-align: left;
          margin-bottom: 30px;
        }

        .shop-title {
          font-family: var(--font-serif);
          font-size: 36px;
          color: var(--color-heading);
          margin-bottom: 8px;
        }

        .shop-desc-txt {
          font-size: 14px;
          color: var(--color-body);
        }

        .shop-options-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--color-bg-light);
          padding: 12px 20px;
          border-radius: var(--border-radius-sm);
          margin-bottom: 30px;
          border: 1px solid var(--color-border);
        }

        .mobile-filter-btn {
          display: none; /* hidden on desktop */
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 14px;
          color: var(--color-heading);
          border: 1px solid #ccc;
          padding: 6px 12px;
          background: white;
          border-radius: var(--border-radius-sm);
        }

        .active-search-indicator {
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--color-primary-light);
          padding: 4px 10px;
          border-radius: 20px;
          color: var(--color-primary);
        }

        .clear-search-btn {
          font-weight: bold;
          font-size: 15px;
          color: var(--color-danger);
          padding: 0 2px;
        }

        .sort-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sort-icon {
          color: var(--color-body);
        }

        .sort-dropdown {
          border: 1px solid var(--color-border);
          padding: 8px 12px;
          font-size: 13px;
          border-radius: var(--border-radius-sm);
          background: white;
          color: var(--color-heading);
          font-weight: 500;
        }

        .shop-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
        }

        .filters-sidebar {
          background-color: var(--color-bg-white);
          text-align: left;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 10px;
        }

        .sidebar-header h3 {
          font-size: 18px;
        }

        .reset-filters-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--color-primary);
          font-weight: 600;
        }

        .mobile-close-filters {
          display: none;
        }

        .filter-group {
          margin-bottom: 30px;
        }

        .filter-group h4 {
          font-size: 14px;
          color: var(--color-heading);
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sidebar-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sidebar-search-wrapper input {
          width: 100%;
          padding: 10px 35px 10px 12px;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          font-size: 13px;
        }

        .search-side-icon {
          position: absolute;
          right: 12px;
          color: #aaa;
        }

        .filter-links-list li {
          margin-bottom: 8px;
        }

        .filter-links-list button {
          font-size: 14px;
          color: var(--color-body);
          transition: var(--transition-fast);
          width: 100%;
          text-align: left;
        }

        .filter-links-list button:hover, .filter-links-list button.active {
          color: var(--color-primary);
          font-weight: 600;
        }

        .sizes-filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .size-filter-btn {
          min-width: 40px;
          height: 40px;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-heading);
          background-color: white;
          transition: var(--transition-fast);
        }

        .size-filter-btn:hover, .size-filter-btn.active {
          border-color: var(--color-primary);
          background-color: var(--color-primary-light);
          color: var(--color-primary);
        }

        .price-slider-input {
          width: 100%;
          accent-color: var(--color-primary);
          margin-bottom: 8px;
        }

        .slider-limits {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--color-body);
        }

        .price-tag-value {
          color: var(--color-primary);
        }

        .no-products-state {
          padding: 60px 20px;
          background: var(--color-bg-light);
          border-radius: var(--border-radius-lg);
          border: 1px dashed var(--color-border);
        }

        .animated-empty-magnifier {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: white;
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          animation: floatSearch 2.5s ease-in-out infinite;
        }

        .empty-search-icon {
          color: #bbb;
        }

        @keyframes floatSearch {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(15deg); }
        }

        .no-products-state h3 {
          font-size: 20px;
          margin-bottom: 8px;
        }

        .no-products-state p {
          font-size: 14px;
          margin-bottom: 20px;
        }

        /* Mobile Filters Overlay Responsive */
        @media (max-width: 768px) {
          .shop-layout {
            grid-template-columns: 1fr;
          }
          .mobile-filter-btn {
            display: flex;
          }
          .filters-sidebar {
            position: fixed;
            top: 0;
            left: -320px;
            bottom: 0;
            width: 300px;
            background: white;
            z-index: 1200;
            box-shadow: var(--shadow-lg);
            padding: 30px 20px;
            overflow-y: auto;
            transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .filters-sidebar.mobile-open {
            left: 0;
          }
          .mobile-close-filters {
            display: block;
            font-size: 28px;
            color: var(--color-heading);
            padding: 0 5px;
          }
          .shop-title {
            font-size: 26px;
          }
        }

        /* Ambient Background Card Design */
        .ambient-background-card {
          position: relative;
          background: linear-gradient(135deg, #15222d 0%, #0d141b 100%);
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
          background-color: rgba(8, 129, 120, 0.15);
          color: #14c4b9;
          border: 1px solid rgba(8, 129, 120, 0.3);
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

        .magnifier-float {
          animation: floatMagnifier 3s ease-in-out infinite alternate;
        }

        .laser-cone {
          animation: fadeScan 1.5s infinite alternate;
          transform-origin: center top;
        }

        .laser-line {
          animation: scanLaser 3s ease-in-out infinite alternate;
        }

        @keyframes strokeDash {
          0% { stroke-dasharray: 0 100; fill: rgba(255,255,255,0); }
          50% { stroke-dasharray: 100 0; fill: rgba(255,255,255,0.04); }
          100% { stroke-dasharray: 0 100; fill: rgba(255,255,255,0); }
        }

        @keyframes floatMagnifier {
          0% { transform: translate(-30px, -10px); }
          100% { transform: translate(30px, 10px); }
        }

        @keyframes scanLaser {
          0% { transform: translateY(-30px); opacity: 0.4; }
          50% { opacity: 1; }
          100% { transform: translateY(30px); opacity: 0.4; }
        }

        @keyframes fadeScan {
          0% { opacity: 0.3; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
