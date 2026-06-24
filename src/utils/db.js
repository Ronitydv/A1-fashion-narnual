import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios Instance
const api = axios.create({
  baseURL: API_URL
});

let tokenGetter = null;

export const registerTokenGetter = (fn) => {
  tokenGetter = fn;
};

// Request Interceptor to attach JWT (supports async Clerk token retrieval)
api.interceptors.request.use(
  async (config) => {
    let token = null;
    if (tokenGetter) {
      try {
        token = await tokenGetter();
      } catch (err) {
        console.error("Error retrieving Clerk token:", err);
      }
    }
    
    if (!token) {
      token = localStorage.getItem('a1_jwt');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const syncClerkUser = async (clerkUser) => {
  try {
    const res = await api.post('/auth/sync', {
      name: clerkUser.fullName || clerkUser.username || '',
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      phone: clerkUser.primaryPhoneNumber?.phoneNumber || '',
      avatar: clerkUser.imageUrl || ''
    });
    if (res.data.success) {
      setCurrentUser(res.data.user);
      return res.data.user;
    }
  } catch (error) {
    console.error("Failed to sync Clerk user with backend:", error);
    throw new Error(error.response?.data?.message || 'Sync failed.');
  }
};

// Exported database hooks matching existing frontend calls
export const initDb = async () => {
  console.log("Axios API client initialized, base URL:", API_URL);
};

// User Profile helpers
export const getCurrentUser = () => {
  const user = localStorage.getItem('a1_user');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('a1_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('a1_user');
    localStorage.removeItem('a1_jwt');
  }
};

// Products API calls
export const getProducts = async (filters = {}) => {
  try {
    const res = await api.get('/products', { params: filters });
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const saveProduct = async (product) => {
  try {
    if (product.id) {
      const res = await api.put(`/products/${product.id}`, product);
      return res.data;
    } else {
      const res = await api.post('/products', product);
      return res.data;
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save product.');
  }
};

export const deleteProduct = async (id) => {
  try {
    await api.delete(`/products/${id}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete product.');
  }
};

// Reviews API calls
export const getReviews = async (productId) => {
  try {
    const res = await api.get(`/products/${productId}/reviews`);
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const addReview = async (productId, review) => {
  try {
    const res = await api.post(`/products/${productId}/reviews`, review);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit review.');
  }
};

// Orders API calls
export const getOrders = async () => {
  try {
    // If user is admin, they need to fetch all orders, but since we separated the endpoints:
    // For admin, we can fetch all orders by calling the admin orders lookup or order list.
    // Let's check: if req.user is admin, let's fetch from general order list which returns all orders, 
    // or we can make a custom endpoint. In routes/orders.js, get('/history') returns user orders.
    // Let's make orders list support admin fetching.
    // Wait, in orders.js GET /history returns user's orders. If user.role is admin, they might fetch all orders.
    // In our backend orders.js, history returns user's orders. Let's make an admin orders route or fetch orders directly.
    // Wait! Let's call /orders/history.
    const res = await api.get('/orders/history');
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createOrder = async (order) => {
  try {
    const res = await api.post('/orders', order);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Checkout purchase transaction failed.');
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await api.put(`/orders/${orderId}/status`, { status });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order status.');
  }
};

export const getOrderTrackInfo = async (orderId) => {
  try {
    const res = await api.get(`/orders/track/${orderId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Order not found.');
  }
};

// Admin specific calls
export const getAdminAnalytics = async () => {
  try {
    const res = await api.get('/admin/analytics');
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCoupons = async () => {
  try {
    const res = await api.get('/admin/coupons');
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createCoupon = async (coupon) => {
  try {
    const res = await api.post('/admin/coupons', coupon);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create coupon.');
  }
};

export const deleteCoupon = async (id) => {
  try {
    await api.delete(`/admin/coupons/${id}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete coupon.');
  }
};

export const validateCoupon = async (code, subtotal) => {
  try {
    const res = await api.post('/admin/coupons/validate', { code, subtotal });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid or expired coupon.');
  }
};

export const redeemGiftVoucher = async (code) => {
  try {
    const res = await api.post('/admin/wallet/redeem', { code });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Voucher validation failed.');
  }
};

// Authentication Requests
const API_AUTH_URL = '/auth';

export const sendOtpCode = async (phone) => {
  try {
    const res = await api.post(`${API_AUTH_URL}/send-otp`, { phone });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP.');
  }
};

export const verifyOtpCode = async (phone, code) => {
  try {
    const res = await api.post(`${API_AUTH_URL}/verify-otp`, { phone, code });
    // Save JWT token in localStorage
    if (res.data.token) {
      localStorage.setItem('a1_jwt', res.data.token);
      setCurrentUser(res.data.user);
    }
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid OTP code.');
  }
};

export const loginWithGoogleMock = async (googleUser) => {
  try {
    const res = await api.post(`${API_AUTH_URL}/google`, googleUser);
    if (res.data.token) {
      localStorage.setItem('a1_jwt', res.data.token);
      setCurrentUser(res.data.user);
    }
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Google Auth verification failed.');
  }
};

// Client-only state helpers (Keep in LocalStorage)
export const getCart = () => {
  const cart = localStorage.getItem('a1_cart');
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem('a1_cart', JSON.stringify(cart));
};

export const getWishlist = () => {
  const wishlist = localStorage.getItem('a1_wishlist');
  return wishlist ? JSON.parse(wishlist) : [];
};

export const saveWishlist = (wishlist) => {
  localStorage.setItem('a1_wishlist', JSON.stringify(wishlist));
};
export const getWallet = () => {
  const user = getCurrentUser();
  return { balance: user?.walletBalance || 0, transactions: user?.walletTransactions || [] };
};
