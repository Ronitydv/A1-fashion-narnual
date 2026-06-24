import React, { useState, useEffect } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { initDb, getProducts, getCart, saveCart, getWishlist, saveWishlist, getCurrentUser, setCurrentUser, createOrder, registerTokenGetter, syncClerkUser } from './utils/db';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import LoginModal from './components/LoginModal';
import PaymentModal from './components/PaymentModal';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import UserAccount from './pages/UserAccount';

export default function App() {
  const { user: clerkUser, isLoaded: clerkUserLoaded, isSignedIn } = useUser();
  const { getToken, signOut: clerkSignOut } = useAuth();
  const { openSignIn } = useClerk();

  const [activePage, setActivePage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState('1');
  
  // Database states
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  
  // Promotion Coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Modals state
  const [loginOpen, setLoginOpen] = useState(false);
  
  // UX & Location states
  const [toast, setToast] = useState(null);
  const [cartAnimating, setCartAnimating] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState({
    city: 'Ateli',
    postcode: '123021',
    formatted: 'Ronit | Ateli 123021'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Auto-Detect Location on Mount (HTML5 Geolocation + IP Fallback)
  useEffect(() => {
    const detectLocation = async () => {
      const fallbackIpLocation = async () => {
        try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          if (data.city && data.postal) {
            setDeliveryLocation({
              city: data.city,
              postcode: data.postal,
              formatted: `${user ? user.name : 'Ronit'} | ${data.city} ${data.postal}`
            });
          }
        } catch (ipErr) {
          console.warn("IP Geolocation fallback failed:", ipErr);
        }
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // OpenStreetMap reverse geocoding
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await res.json();
              const address = data.address || {};
              const city = address.city || address.town || address.village || address.suburb || 'Local Area';
              const postcode = address.postcode || '123021';
              setDeliveryLocation({
                city,
                postcode,
                formatted: `${user ? user.name : 'Ronit'} | ${city} ${postcode}`
              });
              showToast(`Location auto-detected: ${city} (${postcode})`, 'info');
            } catch (err) {
              console.warn("Reverse geocoding failed, falling back to IP:", err);
              await fallbackIpLocation();
            }
          },
          async (error) => {
            console.warn("HTML5 Geolocation denied/failed, using IP fallback:", error.message);
            await fallbackIpLocation();
          },
          { timeout: 8000 }
        );
      } else {
        console.warn("Geolocation not supported, using IP fallback");
        await fallbackIpLocation();
      }
    };

    detectLocation();
  }, [user]);

  const handleUpdateLocation = (city, postcode) => {
    setDeliveryLocation({
      city,
      postcode,
      formatted: `${user ? user.name : 'Ronit'} | ${city} ${postcode}`
    });
    showToast(`Delivery location updated to ${city} ${postcode}`, 'success');
  };

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [billingDetails, setBillingDetails] = useState(null);

  // Register Clerk Token Getter
  useEffect(() => {
    registerTokenGetter(async () => {
      try {
        return await getToken();
      } catch (err) {
        return null;
      }
    });
  }, [getToken]);

  // Synchronize Clerk user state with backend database
  useEffect(() => {
    const handleSync = async () => {
      if (isSignedIn && clerkUser) {
        try {
          const syncedUser = await syncClerkUser(clerkUser);
          setUser(syncedUser);
        } catch (err) {
          console.error("Clerk user sync failed:", err);
        }
      } else if (!isSignedIn && clerkUserLoaded) {
        // If logged out on Clerk, reset local user
        setUser(null);
        setCurrentUser(null);
      }
    };
    handleSync();
  }, [isSignedIn, clerkUser, clerkUserLoaded]);

  // Initial Seeding & Mounting
  useEffect(() => {
    initDb();
    
    const fetchInitialData = async () => {
      const list = await getProducts();
      setProducts(list);
    };
    
    fetchInitialData();
    setCart(getCart());
    setWishlist(getWishlist());

    // Fallback to local cached user if not using/signed in to Clerk yet
    const localUser = getCurrentUser();
    if (localUser && !isSignedIn) {
      setUser(localUser);
    }

    // Listen to global product view requests
    const handleViewProductEvent = (e) => {
      setSelectedProductId(e.detail);
      navigateToPage('detail');
    };

    const handleCatalogUpdate = async () => {
      const list = await getProducts();
      setProducts(list);
    };

    window.addEventListener('a1_view_prod', handleViewProductEvent);
    window.addEventListener('a1_catalog_updated', handleCatalogUpdate);

    return () => {
      window.removeEventListener('a1_view_prod', handleViewProductEvent);
      window.removeEventListener('a1_catalog_updated', handleCatalogUpdate);
    };
  }, []);

  // Update Page & Scroll Top
  const navigateToPage = (pageName) => {
    setActivePage(pageName);
    window.scrollTo(0, 0);
  };

  // Add to Cart
  const handleAddToCart = (product, qty = 1, size = 'M', color = 'Classic Blue') => {
    const existingIndex = cart.findIndex(
      item => item.id === product.id && item.size === size && item.color === color
    );

    let updatedCart = [...cart];
    if (existingIndex >= 0) {
      updatedCart[existingIndex].quantity += qty;
    } else {
      updatedCart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        image: product.image,
        size,
        color,
        quantity: qty,
        inStock: product.inStock
      });
    }

    setCart(updatedCart);
    saveCart(updatedCart);
    showToast(`Added ${qty} item(s) to your shopping bag.`, 'success');
    setCartAnimating(true);
    setTimeout(() => setCartAnimating(false), 800);
  };

  // Update Cart Qty
  const handleUpdateCartQty = (idx, qty) => {
    let updatedCart = [...cart];
    if (qty <= 0) {
      updatedCart.splice(idx, 1);
    } else {
      updatedCart[idx].quantity = qty;
    }
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  // Remove from Cart
  const handleRemoveFromCart = (idx) => {
    let updatedCart = [...cart];
    updatedCart.splice(idx, 1);
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  // Toggle Wishlist
  const handleToggleWishlist = (product) => {
    const idx = wishlist.findIndex(item => item.id === product.id);
    let updatedWishlist = [...wishlist];

    if (idx >= 0) {
      updatedWishlist.splice(idx, 1);
      showToast('Removed style from favorites.', 'info');
    } else {
      updatedWishlist.push(product);
      showToast('Style saved to favorites.', 'success');
    }

    setWishlist(updatedWishlist);
    saveWishlist(updatedWishlist);
  };

  // Remove from Wishlist (Direct)
  const handleRemoveFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(item => item.id !== id);
    setWishlist(updatedWishlist);
    saveWishlist(updatedWishlist);
    showToast('Removed style from favorites.', 'info');
  };

  // Auth Success Handlers
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    showToast(`Successfully verified! Welcome, ${loggedInUser.name}.`, 'success');
  };

  const handleLogout = async () => {
    try {
      if (isSignedIn) {
        await clerkSignOut();
      }
    } catch (err) {
      console.error("Clerk sign out failed:", err);
    }
    setCurrentUser(null);
    setUser(null);
    setAppliedCoupon(null);
    showToast('Logged out from profile successfully.', 'info');
    navigateToPage('home');
  };


  // Trigger checkout payment modal
  const handleTriggerPayment = (amount, shippingInfo) => {
    setPaymentAmount(amount);
    setBillingDetails(shippingInfo);
    setPaymentOpen(true);
  };

  // Payment Completed Successful Handler
  const handlePaymentSuccess = async (paymentMethod = 'Online UPI/Card Secure pay') => {
    try {
      const newOrder = await createOrder({
        items: cart,
        totalAmount: paymentAmount,
        shippingDetails: billingDetails,
        paymentMethod: paymentMethod
      });


      // Reset bag
      setCart([]);
      saveCart([]);
      setAppliedCoupon(null);

      // Refresh catalog stock
      const list = await getProducts();
      setProducts(list);
      
      // Redirect to User account portal to see orders list
      showToast(`🎉 Order Confirmed! Your Order ID is ${newOrder.orderId}.`, 'success');
      navigateToPage('account');
    } catch (err) {
      showToast(err.message || 'Failed to complete order.', 'error');
    }
  };

  const handleOpenLogin = () => {
    if (openSignIn) {
      openSignIn();
    } else {
      setLoginOpen(true);
    }
  };

  // Render Page Selection
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home
            products={products}
            onViewProduct={(id) => { setSelectedProductId(id); navigateToPage('detail'); }}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
            setActivePage={navigateToPage}
          />
        );
      case 'shop':
        return (
          <Shop
            products={products}
            onViewProduct={(id) => { setSelectedProductId(id); navigateToPage('detail'); }}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
        );
      case 'detail':
        return (
          <ProductDetail
            productId={selectedProductId}
            products={products}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
            setActivePage={navigateToPage}
          />
        );
      case 'wishlist':
        return (
          <Wishlist
            wishlist={wishlist}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onAddToCart={handleAddToCart}
            setActivePage={navigateToPage}
          />
        );
      case 'cart':
        return (
          <Cart
            cart={cart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={setAppliedCoupon}
            setActivePage={navigateToPage}
          />
        );
      case 'checkout':
        return (
          <Checkout
            cart={cart}
            appliedCoupon={appliedCoupon}
            user={user}
            onOpenLogin={handleOpenLogin}
            onOpenPayment={handleTriggerPayment}
            setActivePage={navigateToPage}
          />
        );
      case 'account':
        return (
          <UserAccount
            user={user}
            onLogout={handleLogout}
            onOpenLogin={handleOpenLogin}
            setActivePage={navigateToPage}
          />
        );
      default:
        return (
          <Home
            products={products}
            onViewProduct={(id) => { setSelectedProductId(id); navigateToPage('detail'); }}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
            setActivePage={navigateToPage}
          />
        );
    }
  };

  return (
    <div className="a1-app-wrapper">
      {/* Header component */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        activePage={activePage}
        setActivePage={navigateToPage}
        user={user}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        products={products}
        cartAnimating={cartAnimating}
        deliveryLocation={deliveryLocation}
        onUpdateLocation={handleUpdateLocation}
      />

      {/* Primary Page Content Router */}
      <div className="main-content-router">
        {renderPage()}
      </div>

      {/* Footer component */}
      <Footer setActivePage={navigateToPage} />

      {/* Sticky Bottom Nav Bar for Mobile layout */}
      <BottomNav
        activePage={activePage}
        setActivePage={navigateToPage}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />

      {/* Authentication Gateway Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        totalAmount={paymentAmount}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Toast Notification Container */}
      {toast && (
        <div className={`a1-toast-notification toast-${toast.type} animate-slide-in`}>
          <span className="toast-icon">
            {toast.type === 'success' ? '✨' : toast.type === 'error' ? '🚫' : '💡'}
          </span>
          <span className="toast-msg">{toast.message}</span>
          <button className="toast-close-btn" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <style>{`
        .a1-app-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content-router {
          flex: 1;
        }

        .a1-toast-notification {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: rgba(30, 45, 61, 0.95);
          color: white;
          padding: 14px 20px;
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 9999;
          min-width: 300px;
          max-width: 450px;
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .toast-success {
          border-left: 4px solid var(--color-secondary);
        }

        .toast-error {
          border-left: 4px solid var(--color-danger);
          background: rgba(220, 53, 69, 0.95);
        }

        .toast-info {
          border-left: 4px solid var(--color-accent);
        }

        .toast-icon {
          font-size: 18px;
        }

        .toast-msg {
          font-size: 13px;
          font-weight: 500;
          flex-grow: 1;
        }

        .toast-close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 20px;
          cursor: pointer;
          line-height: 1;
          padding: 0;
        }

        .toast-close-btn:hover {
          color: white;
        }

        @keyframes slideIn {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
