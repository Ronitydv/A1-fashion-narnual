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
    alert(`Added ${qty} item(s) to your shopping bag.`);
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
      alert('Removed style from favorites.');
    } else {
      updatedWishlist.push(product);
      alert('Style saved to favorites.');
    }

    setWishlist(updatedWishlist);
    saveWishlist(updatedWishlist);
  };

  // Remove from Wishlist (Direct)
  const handleRemoveFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(item => item.id !== id);
    setWishlist(updatedWishlist);
    saveWishlist(updatedWishlist);
    alert('Removed style from favorites.');
  };

  // Auth Success Handlers
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    alert(`Successfully verified! Welcome, ${loggedInUser.name}.`);
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
    alert('Logged out from profile successfully.');
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
      alert(`🎉 Order Confirmed! Your Order ID is ${newOrder.orderId}.`);
      navigateToPage('account');
    } catch (err) {
      alert(err.message || 'Failed to complete order.');
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

      <style>{`
        .a1-app-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content-router {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
