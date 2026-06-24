import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Shield, RefreshCw, CreditCard } from 'lucide-react';

const HERO_SLIDES = [
  {
    title: "STREETWEAR COLLECTIONS",
    subtitle: "New Season Arrivals",
    heading: "Level Up Your Aesthetic",
    desc: "Uncompromising quality streetwear. Heavy hoodies, utility cargos, and iconic jackets crafted for the modern man.",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1000&auto=format&fit=crop&q=80",
    btnText: "Shop Streetwear",
    category: "streetwear"
  },
  {
    title: "TAILORED & SHARP",
    subtitle: "Exclusive Blazers & Shirts",
    heading: "Suited for Success",
    desc: "Premium fabrics tailored into sharp regular and slim silhouettes. Perfect transition from business hours to night affairs.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=80",
    btnText: "Shop Suits",
    category: "suits"
  }
];

export default function Home({
  products,
  onViewProduct,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  setActivePage
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const bestsellingProducts = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 4);

  const handleCategoryClick = (cat) => {
    setActivePage('shop');
    // Dispatch filter event
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('a1_filter_cat', { detail: cat }));
    }, 50);
  };

  return (
    <div className="home-page animate-fade">
      {/* Slider Section */}
      <section className="hero-slider-section">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.7) 30%, rgba(0,0,0,0.1)), url(${slide.image})` }}
          >
            <div className="container slide-content-wrapper">
              <div className="slide-body">
                <span className="slide-tag">{slide.title}</span>
                <span className="slide-subtitle">{slide.subtitle}</span>
                <h1 className="slide-heading">{slide.heading}</h1>
                <p className="slide-desc">{slide.desc}</p>
                <button
                  onClick={() => handleCategoryClick(slide.category)}
                  className="btn-primary"
                >
                  {slide.btnText} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* Slider Controls */}
        <div className="slider-dots">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </section>

      {/* Service Core Values Row */}
      <section className="core-values-section section-padding">
        <div className="container values-grid">
          <div className="value-card">
            <div className="value-icon-wrapper"><Shield size={24} /></div>
            <h4>Secure Payments</h4>
            <p>100% secure payment methods supported</p>
          </div>
          <div className="value-card">
            <div className="value-icon-wrapper"><Sparkles size={24} /></div>
            <h4>Premium Fabric</h4>
            <p>Selected high-grade materials only</p>
          </div>
          <div className="value-card">
            <div className="value-icon-wrapper"><RefreshCw size={24} /></div>
            <h4>Easy Returns</h4>
            <p>Friendly 7-day return policy for peace of mind</p>
          </div>
          <div className="value-card">
            <div className="value-icon-wrapper"><CreditCard size={24} /></div>
            <h4>COD Available</h4>
            <p>Pay on delivery across major locations</p>
          </div>
        </div>
      </section>

      {/* Circular Categories Quick Grid */}
      <section className="categories-quick-section">
        <div className="container">
          <div className="section-title text-center">
            <h2>Explore Men's Categories</h2>
            <p>Find the perfect fit for your distinct vibe</p>
          </div>
          <div className="categories-circle-grid">
            <div className="category-circle-item" onClick={() => handleCategoryClick('shirts')}>
              <div className="circle-img-holder">
                <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&auto=format&fit=crop&q=80" alt="Shirts" />
              </div>
              <span>Shirts</span>
            </div>
            <div className="category-circle-item" onClick={() => handleCategoryClick('hoodies')}>
              <div className="circle-img-holder">
                <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=150&auto=format&fit=crop&q=80" alt="Hoodies" />
              </div>
              <span>Hoodies</span>
            </div>
            <div className="category-circle-item" onClick={() => handleCategoryClick('suits')}>
              <div className="circle-img-holder">
                <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&auto=format&fit=crop&q=80" alt="Suits" />
              </div>
              <span>Suits</span>
            </div>
            <div className="category-circle-item" onClick={() => handleCategoryClick('streetwear')}>
              <div className="circle-img-holder">
                <img src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=150&auto=format&fit=crop&q=80" alt="Streetwear" />
              </div>
              <span>Streetwear</span>
            </div>
            <div className="category-circle-item" onClick={() => handleCategoryClick('accessories')}>
              <div className="circle-img-holder">
                <img src="https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=150&auto=format&fit=crop&q=80" alt="Accessories" />
              </div>
              <span>Accessories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="featured-products-section section-padding">
        <div className="container">
          <div className="section-title text-center">
            <h2>Trending Men's Collection</h2>
            <p>Handpicked styles setting the fashion standards this season</p>
          </div>
          <div className="grid-4">
            {featuredProducts.map(product => (
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
          <div className="view-all-btn-row text-center">
            <button className="btn-outline" onClick={() => setActivePage('shop')}>
              View Full Shop Catalog <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Dual Banners */}
      <section className="banners-split-section">
        <div className="container splits-grid">
          <div className="banner-split-item" style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80')` }}>
            <span className="split-sub">Limited Drop</span>
            <h3>Premium Winter Fleece</h3>
            <p>Flat 15% discount on all hoodies & jackets this week.</p>
            <button className="btn-outline" onClick={() => handleCategoryClick('hoodies')}>Shop Now</button>
          </div>
          <div className="banner-split-item" style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=800&auto=format&fit=crop&q=80')` }}>
            <span className="split-sub">Club Wear</span>
            <h3>Signature Tailoring</h3>
            <p>Elevate your formal style with handpicked Italian wool suits.</p>
            <button className="btn-outline" onClick={() => handleCategoryClick('suits')}>Explore Suits</button>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="bestsellers-products-section section-padding" style={{ backgroundColor: 'var(--color-bg-light)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-title text-center">
            <h2>A1 Best Sellers</h2>
            <p>Our top-moving, high-demand style statements, rated premium by A1 customers</p>
          </div>
          <div className="grid-4">
            {bestsellingProducts.map(product => (
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
          <div className="view-all-btn-row text-center">
            <button className="btn-outline" onClick={() => { setActivePage('shop'); setTimeout(() => window.dispatchEvent(new CustomEvent('a1_filter_cat', { detail: 'all' })), 50); }}>
              Explore Full Collection <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* CSS Styles inside Home */}
      <style>{`
        .hero-slider-section {
          position: relative;
          height: 520px;
          overflow: hidden;
          background-color: #000;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.8s ease-in-out, visibility 0.8s ease-in-out;
          z-index: 1;
        }

        .hero-slide.active {
          opacity: 1;
          visibility: visible;
          z-index: 2;
        }

        .slide-content-wrapper {
          display: flex;
          justify-content: flex-start;
          width: 100%;
        }

        .slide-body {
          max-width: 550px;
          color: white;
          text-align: left;
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .slide-tag {
          color: var(--color-primary);
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 10px;
        }

        .slide-subtitle {
          font-size: 18px;
          font-weight: 500;
          color: #ccc;
          display: block;
          margin-bottom: 12px;
        }

        .slide-heading {
          font-family: var(--font-serif);
          font-size: 48px;
          line-height: 1.15;
          margin-bottom: 20px;
          color: #fff;
          font-weight: 600;
        }

        .slide-desc {
          font-size: 15px;
          line-height: 1.6;
          color: #ddd;
          margin-bottom: 30px;
        }

        .slider-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.4);
          transition: var(--transition-fast);
        }

        .dot.active {
          background-color: var(--color-primary);
          width: 25px;
          border-radius: 5px;
        }

        .section-title {
          margin-bottom: 40px;
        }

        .section-title h2 {
          font-family: var(--font-serif);
          font-size: 32px;
          color: var(--color-heading);
          margin-bottom: 10px;
        }

        .section-title p {
          color: var(--color-body);
          font-size: 15px;
        }

        .core-values-section {
          background-color: var(--color-bg-light);
          border-bottom: 1px solid var(--color-border);
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .value-card {
          text-align: center;
          padding: 15px;
        }

        .value-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px auto;
        }

        .value-card h4 {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--color-heading);
        }

        .value-card p {
          font-size: 12px;
          color: var(--color-body);
        }

        .categories-quick-section {
          padding: 60px 0;
        }

        .categories-circle-grid {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }

        .category-circle-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .circle-img-holder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid transparent;
          box-shadow: var(--shadow-sm);
          transition: var(--transition-fast);
        }

        .category-circle-item:hover .circle-img-holder {
          border-color: var(--color-primary);
          transform: scale(1.05);
          box-shadow: var(--shadow-md);
        }

        .circle-img-holder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-circle-item span {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-heading);
          text-transform: uppercase;
        }

        .view-all-btn-row {
          margin-top: 40px;
        }

        .banners-split-section {
          padding-bottom: 60px;
        }

        .splits-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .banner-split-item {
          background-size: cover;
          background-position: center;
          border-radius: var(--border-radius-lg);
          padding: 50px 40px;
          color: white;
          text-align: left;
          min-height: 240px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }

        .split-sub {
          color: var(--color-warning);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .banner-split-item h3 {
          font-family: var(--font-serif);
          font-size: 26px;
          color: white;
          margin-bottom: 10px;
        }

        .banner-split-item p {
          font-size: 13px;
          color: #eee;
          margin-bottom: 20px;
          max-width: 320px;
        }

        .banner-split-item button {
          border-color: white;
          color: white;
        }

        .banner-split-item button:hover {
          background-color: white;
          color: var(--color-heading);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero-slider-section { height: 420px; }
          .slide-heading { font-size: 38px; }
        }

        @media (max-width: 768px) {
          .hero-slider-section { height: 320px; }
          .slide-body { max-width: 100%; padding: 0 15px; }
          .slide-heading { font-size: 26px; margin-bottom: 12px; }
          .slide-desc { font-size: 13px; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          .values-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .splits-grid { grid-template-columns: 1fr; }
          .categories-circle-grid { gap: 20px; }
          .circle-img-holder { width: 80px; height: 80px; }
          .section-title h2 { font-size: 24px; }
        }
      `}</style>
    </div>
  );
}
