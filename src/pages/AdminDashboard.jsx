import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, ShieldCheck, DollarSign, ShoppingBag, Eye, Check, Tag } from 'lucide-react';
import { getProducts, saveProduct, deleteProduct, getOrders, updateOrderStatus, getAdminAnalytics, getCoupons, createCoupon, deleteCoupon } from '../utils/db';

export default function AdminDashboard({ onCatalogUpdated }) {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'coupons'
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [couponsList, setCouponsList] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  // Product Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formFields, setFormFields] = useState({
    title: '',
    price: '',
    originalPrice: '',
    category: 'shirts',
    image: '',
    sizes: ['M', 'L'],
    colors: ['Black', 'Blue'],
    description: '',
    inStock: '15'
  });

  // Coupon Form State
  const [isCouponFormOpen, setIsCouponFormOpen] = useState(false);
  const [couponFields, setCouponFields] = useState({
    code: '',
    discountPercent: '10',
    freeShipping: false,
    minPurchase: '0',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prods, ords, an, cops] = await Promise.all([
        getProducts(),
        getOrders(),
        getAdminAnalytics(),
        getCoupons()
      ]);
      setProductsList(prods || []);
      setOrdersList(ords || []);
      setAnalytics(an);
      setCouponsList(cops || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };

  const refreshData = async () => {
    await loadData();
    if (onCatalogUpdated) onCatalogUpdated();
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setFormFields({
      title: '',
      price: '',
      originalPrice: '',
      category: 'shirts',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
      sizes: ['M', 'L', 'XL'],
      colors: ['Classic White', 'Dark Navy'],
      description: 'Handcrafted premium men\'s wear detailing fine finish and breathable fabric styling.',
      inStock: '20'
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (prod) => {
    setEditingProduct(prod);
    setFormFields({
      title: prod.title,
      price: prod.price.toString(),
      originalPrice: prod.originalPrice ? prod.originalPrice.toString() : '',
      category: prod.category,
      image: prod.image,
      sizes: prod.sizes,
      colors: prod.colors,
      description: prod.description || '',
      inStock: prod.inStock.toString()
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formFields.title || !formFields.price) return;

    const priceNum = Number(formFields.price);
    const origPriceNum = formFields.originalPrice ? Number(formFields.originalPrice) : undefined;
    const stockNum = Number(formFields.inStock);

    const productObj = {
      title: formFields.title,
      price: priceNum,
      originalPrice: origPriceNum,
      category: formFields.category,
      image: formFields.image,
      sizes: formFields.sizes,
      colors: Array.isArray(formFields.colors) ? formFields.colors : formFields.colors.split(',').map(c => c.trim()),
      description: formFields.description,
      inStock: stockNum
    };

    if (editingProduct) {
      productObj.id = editingProduct.id;
      productObj.rating = editingProduct.rating;
      productObj.reviewsCount = editingProduct.reviewsCount;
      productObj.featured = editingProduct.featured;
      productObj.specs = editingProduct.specs;
    }

    try {
      await saveProduct(productObj);
      setIsFormOpen(false);
      setEditingProduct(null);
      await refreshData();
      alert(editingProduct ? 'Product updated successfully!' : 'New product added successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        await refreshData();
        alert('Product deleted successfully!');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await refreshData();
      alert(`Order status updated to "${newStatus}"!`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponFields.code || !couponFields.startDate || !couponFields.endDate) {
      alert('Please fill out all required coupon fields.');
      return;
    }

    const couponObj = {
      code: couponFields.code.toUpperCase(),
      discountPercent: Number(couponFields.discountPercent),
      freeShipping: couponFields.freeShipping,
      minPurchase: Number(couponFields.minPurchase || 0),
      startDate: couponFields.startDate,
      endDate: couponFields.endDate
    };

    try {
      await createCoupon(couponObj);
      setIsCouponFormOpen(false);
      setCouponFields({
        code: '',
        discountPercent: '10',
        freeShipping: false,
        minPurchase: '0',
        startDate: '',
        endDate: ''
      });
      await refreshData();
      alert('Coupon created successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon code?')) {
      try {
        await deleteCoupon(id);
        await refreshData();
        alert('Coupon deleted successfully!');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const toggleSizeCheckbox = (size) => {
    setFormFields(prev => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const totalSales = analytics?.totalSales || 0;

  return (
    <div className="admin-page container animate-fade">
      {/* Title */}
      <div className="admin-header text-left">
        <h1>
          <ShieldCheck size={28} className="inline-icon" /> A1 Admin Dashboard
        </h1>
        <p>Manage product catalog inventory, dispatch order updates, and inspect sales diagnostics.</p>
      </div>

      {/* Low Stock Blinking Warning Banner */}
      {analytics?.lowStockAlerts && analytics.lowStockAlerts.length > 0 && (
        <div className="low-stock-alert-banner">
          <div className="blinking-warning-dot"></div>
          <span>
            <strong>⚠️ Low-Stock Alert:</strong> The following men's styles have <strong>5 or less</strong> pieces left. Restock now!
          </span>
          <div className="low-stock-items-row">
            {analytics.lowStockAlerts.map(p => (
              <span key={p.id} className="low-stock-item-tag">
                {p.title} ({p.inStock} left)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Admin stats */}
      <section className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box"><DollarSign size={22} /></div>
          <div>
            <span className="stat-label">Delivered Sales</span>
            <h4>₹{totalSales.toLocaleString('en-IN')}</h4>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box"><ShoppingBag size={22} /></div>
          <div>
            <span className="stat-label">Total Orders</span>
            <h4>{ordersList.length}</h4>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box">🏷️</div>
          <div>
            <span className="stat-label">Active Products</span>
            <h4>{productsList.length}</h4>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box">🔥</div>
          <div>
            <span className="stat-label">Best Seller Category</span>
            <h4 style={{ textTransform: 'capitalize' }}>{analytics?.bestCategory || 'None'}</h4>
          </div>
        </div>
      </section>

      {/* Navigation tabs */}
      <div className="admin-tabs">
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => { setActiveTab('products'); setIsFormOpen(false); }}>
          Manage Catalog Products
        </button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => { setActiveTab('orders'); setIsFormOpen(false); }}>
          Inspect Orders ({ordersList.length})
        </button>
        <button className={activeTab === 'coupons' ? 'active' : ''} onClick={() => { setActiveTab('coupons'); setIsFormOpen(false); }}>
          Manage Coupon Codes ({couponsList.length})
        </button>
      </div>

      {/* Content panel */}
      <main className="admin-content-pane text-left">
        {activeTab === 'products' && (
          <div className="admin-products-pane animate-fade">
            {!isFormOpen ? (
              <>
                <div className="pane-header-actions">
                  <h3>Catalog Items ({productsList.length})</h3>
                  <button className="btn-primary" onClick={handleOpenAddForm}>
                    <Plus size={16} /> Add New Style
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product Preview</th>
                        <th>Category</th>
                        <th>Price (in ₹)</th>
                        <th>Stock Qty</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsList.map(prod => (
                        <tr key={prod.id}>
                          <td className="admin-prod-preview-cell">
                            <img src={prod.image} alt={prod.title} className="admin-table-thumb" />
                            <div>
                              <h4>{prod.title}</h4>
                              <span className="admin-prod-id">ID: {prod.id}</span>
                            </div>
                          </td>
                          <td><span className="admin-cat-badge">{prod.category}</span></td>
                          <td><strong>₹{prod.price.toLocaleString('en-IN')}</strong></td>
                          <td>
                            <span className={prod.inStock > 0 ? (prod.inStock <= 5 ? 'lowstock-text' : 'instock-text') : 'outstock-text'}>
                              {prod.inStock} items {prod.inStock <= 5 && prod.inStock > 0 && '⚠️'}
                            </span>
                          </td>
                          <td>⭐ {prod.rating} ({prod.reviewsCount})</td>
                          <td>
                            <div className="admin-actions-row">
                              <button className="edit-action-btn" onClick={() => handleOpenEditForm(prod)} title="Edit Style">
                                <Edit size={14} />
                              </button>
                              <button className="delete-action-btn" onClick={() => handleDeleteProduct(prod.id)} title="Delete Style">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              /* Add/Edit Form Panel */
              <div className="product-form-box animate-slide-up">
                <h3>{editingProduct ? `Edit Style: ${editingProduct.title}` : 'Add New Style Catalog'}</h3>
                
                <form onSubmit={handleFormSubmit} className="admin-product-form">
                  <div className="form-grid-2">
                    <div className="form-input-group">
                      <label>Product Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Classic Linen Shirt"
                        value={formFields.title}
                        onChange={(e) => setFormFields(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-input-group">
                      <label>Category *</label>
                      <select
                        value={formFields.category}
                        onChange={(e) => setFormFields(prev => ({ ...prev, category: e.target.value }))}
                      >
                        <option value="shirts">Shirts</option>
                        <option value="hoodies">Hoodies</option>
                        <option value="suits">Suits / Blazers</option>
                        <option value="streetwear">Streetwear</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="form-input-group">
                      <label>Selling Price (₹) *</label>
                      <input
                        type="number"
                        placeholder="1499"
                        value={formFields.price}
                        onChange={(e) => setFormFields(prev => ({ ...prev, price: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-input-group">
                      <label>Original Price (₹)</label>
                      <input
                        type="number"
                        placeholder="1999"
                        value={formFields.originalPrice}
                        onChange={(e) => setFormFields(prev => ({ ...prev, originalPrice: e.target.value }))}
                      />
                    </div>
                    <div className="form-input-group">
                      <label>Stock Qty *</label>
                      <input
                        type="number"
                        placeholder="15"
                        value={formFields.inStock}
                        onChange={(e) => setFormFields(prev => ({ ...prev, inStock: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-input-group">
                    <label>Image URL *</label>
                    <input
                      type="text"
                      placeholder="https://unsplash.com/..."
                      value={formFields.image}
                      onChange={(e) => setFormFields(prev => ({ ...prev, image: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-input-group">
                      <label>Available Sizes</label>
                      <div className="checkboxes-row">
                        {['S', 'M', 'L', 'XL'].map(size => (
                          <label key={size} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={formFields.sizes.includes(size)}
                              onChange={() => toggleSizeCheckbox(size)}
                            />
                            <span>{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-input-group">
                      <label>Colors (Comma separated)</label>
                      <input
                        type="text"
                        placeholder="Classic Black, Pure White, Sage"
                        value={Array.isArray(formFields.colors) ? formFields.colors.join(', ') : formFields.colors}
                        onChange={(e) => setFormFields(prev => ({ ...prev, colors: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="form-input-group">
                    <label>Product Description</label>
                    <textarea
                      rows={4}
                      placeholder="Write premium description copy for this clothing style..."
                      value={formFields.description}
                      onChange={(e) => setFormFields(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="form-actions-row">
                    <button type="submit" className="btn-primary">
                      <Check size={16} /> Save Product
                    </button>
                    <button type="button" className="btn-outline" onClick={() => setIsFormOpen(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-orders-pane animate-fade">
            <h3>Customer Orders Tracker ({ordersList.length})</h3>
            
            {ordersList.length > 0 ? (
              <div className="admin-orders-list">
                {ordersList.map(order => (
                  <div key={order.id} className="admin-order-card">
                    <div className="admin-order-header">
                      <div>
                        <strong>Order ID: {order.orderId}</strong>
                        <p className="order-user-name">Client: {order.shippingDetails?.firstName} {order.shippingDetails?.lastName || ''} | {order.shippingDetails?.phone}</p>
                      </div>
                      <div>
                        <span className="order-meta-label">Date</span>
                        <span>{order.date}</span>
                      </div>
                      <div>
                        <span className="order-meta-label">Order Total</span>
                        <strong className="font-primary">₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="status-selector-block">
                        <span className="order-meta-label">Change Status</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          className={`admin-status-dropdown status-${order.status.toLowerCase()}`}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    <div className="admin-order-body">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="admin-ordered-item">
                          <span>• {item.title} (Size: {item.size} | Color: {item.color} | Qty: {item.quantity})</span>
                        </div>
                      ))}
                      {order.shippingDetails && (
                        <div className="admin-order-address-box">
                          <strong>Shipping Destination:</strong>
                          <p>{order.shippingDetails.address}, {order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.zip}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-orders-state text-center">
                <p>No customer orders have been simulated yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="admin-coupons-pane animate-fade">
            {!isCouponFormOpen ? (
              <>
                <div className="pane-header-actions">
                  <h3>Active Coupon Codes ({couponsList.length})</h3>
                  <button className="btn-primary" onClick={() => setIsCouponFormOpen(true)}>
                    <Plus size={16} /> Create Promo Code
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Promo Code</th>
                        <th>Discount Value</th>
                        <th>Free Shipping</th>
                        <th>Min Purchase</th>
                        <th>Start Validity Date</th>
                        <th>Expiry End Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {couponsList.map(c => (
                        <tr key={c.id}>
                          <td><strong>{c.code}</strong></td>
                          <td>{c.discountPercent}% Off</td>
                          <td>{c.freeShipping ? 'Yes' : 'No'}</td>
                          <td>₹{c.minPurchase.toLocaleString('en-IN')}</td>
                          <td>{c.startDate}</td>
                          <td>{c.endDate}</td>
                          <td>
                            <button className="delete-action-btn" onClick={() => handleDeleteCoupon(c.id)} title="Delete Coupon">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              /* Add Coupon Form Panel */
              <div className="product-form-box animate-slide-up">
                <h3>Create New Promotional Coupon</h3>
                
                <form onSubmit={handleCouponSubmit} className="admin-product-form">
                  <div className="form-grid-2">
                    <div className="form-input-group">
                      <label>Promo Code (e.g. MONSOON30) *</label>
                      <input
                        type="text"
                        placeholder="MONSOON30"
                        value={couponFields.code}
                        onChange={(e) => setCouponFields(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        required
                      />
                    </div>
                    <div className="form-input-group">
                      <label>Discount Percentage (%) *</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="15"
                        value={couponFields.discountPercent}
                        onChange={(e) => setCouponFields(prev => ({ ...prev, discountPercent: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-input-group">
                      <label>Minimum Purchase (₹)</label>
                      <input
                        type="number"
                        placeholder="999"
                        value={couponFields.minPurchase}
                        onChange={(e) => setCouponFields(prev => ({ ...prev, minPurchase: e.target.value }))}
                      />
                    </div>
                    <div className="form-input-group">
                      <label>Free Shipping Coupon?</label>
                      <div className="checkboxes-row">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={couponFields.freeShipping}
                            onChange={(e) => setCouponFields(prev => ({ ...prev, freeShipping: e.target.checked }))}
                          />
                          <span>Yes, grants Free Shipping</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-input-group">
                      <label>Start Date (Active from) *</label>
                      <input
                        type="date"
                        value={couponFields.startDate}
                        onChange={(e) => setCouponFields(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-input-group">
                      <label>End Date (Expires on) *</label>
                      <input
                        type="date"
                        value={couponFields.endDate}
                        onChange={(e) => setCouponFields(prev => ({ ...prev, endDate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions-row">
                    <button type="submit" className="btn-primary">
                      <Check size={16} /> Save Coupon
                    </button>
                    <button type="button" className="btn-outline" onClick={() => setIsCouponFormOpen(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        .admin-page {
          padding-top: 40px;
        }

        .admin-header {
          margin-bottom: 30px;
        }

        .admin-header h1 {
          font-family: var(--font-serif);
          font-size: 32px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .inline-icon {
          color: var(--color-primary);
        }

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background-color: white;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .stat-icon-box {
          width: 45px;
          height: 45px;
          border-radius: var(--border-radius-sm);
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
        }

        .stat-label {
          display: block;
          font-size: 11px;
          color: var(--color-body);
          text-transform: uppercase;
          font-weight: 700;
        }

        .stat-card h4 {
          font-size: 18px;
          color: var(--color-heading);
        }

        .admin-tabs {
          display: flex;
          border-bottom: 2px solid var(--color-border);
          margin-bottom: 30px;
          gap: 5px;
        }

        .admin-tabs button {
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 700;
          color: var(--color-body);
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          transition: var(--transition-fast);
        }

        .admin-tabs button.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        .pane-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .table-responsive {
          overflow-x: auto;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          background: white;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th, .admin-table td {
          padding: 15px 20px;
          border-bottom: 1px solid var(--color-border);
          font-size: 13px;
        }

        .admin-table th {
          background-color: var(--color-bg-light);
          color: var(--color-heading);
          font-weight: 700;
          text-transform: uppercase;
        }

        .admin-prod-preview-cell {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .admin-table-thumb {
          width: 50px;
          height: 50px;
          border-radius: var(--border-radius-sm);
          object-fit: cover;
          background-color: var(--color-bg-light);
        }

        .admin-prod-id {
          font-size: 10px;
          color: #aaa;
          display: block;
        }

        .admin-cat-badge {
          background-color: #f0f0f0;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .instock-text { color: var(--color-success); font-weight: 600; }
        .outstock-text { color: var(--color-danger); font-weight: 600; }

        .admin-actions-row {
          display: flex;
          gap: 10px;
        }

        .edit-action-btn, .delete-action-btn {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-bg-light);
          transition: var(--transition-fast);
        }

        .edit-action-btn { color: var(--color-primary); }
        .edit-action-btn:hover { background-color: var(--color-primary); color: white; }

        .delete-action-btn { color: var(--color-danger); }
        .delete-action-btn:hover { background-color: var(--color-danger); color: white; }

        /* Product Form styles */
        .product-form-box {
          background-color: var(--color-bg-light);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          padding: 30px;
        }

        .admin-product-form {
          margin-top: 20px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .form-input-group {
          margin-bottom: 20px;
        }

        .form-input-group label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-heading);
          margin-bottom: 8px;
        }

        .form-input-group input, .form-input-group select, .form-input-group textarea {
          width: 100%;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          padding: 10px 12px;
          font-size: 13px;
          background-color: white;
        }

        .checkboxes-row {
          display: flex;
          gap: 15px;
          height: 42px;
          align-items: center;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .form-actions-row {
          display: flex;
          gap: 15px;
          border-top: 1px solid var(--color-border);
          padding-top: 20px;
        }

        /* Admin Orders Pane */
        .admin-order-card {
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          background-color: white;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .admin-order-header {
          background-color: var(--color-bg-light);
          padding: 15px 20px;
          border-bottom: 1px solid var(--color-border);
          display: grid;
          grid-template-columns: 2fr 1fr 1.2fr 1.5fr;
          gap: 15px;
          align-items: center;
        }

        .order-user-name {
          font-size: 12px;
          color: var(--color-body);
          margin-top: 3px;
        }

        .status-selector-block {
          text-align: left;
        }

        .admin-status-dropdown {
          border: 1px solid var(--color-border);
          padding: 6px 12px;
          border-radius: var(--border-radius-sm);
          font-size: 12px;
          font-weight: 700;
          background: white;
        }

        .admin-status-dropdown.status-processing {
          border-color: var(--color-accent-orange);
          color: var(--color-accent-orange);
        }

        .admin-status-dropdown.status-shipped {
          border-color: #1890ff;
          color: #1890ff;
        }

        .admin-status-dropdown.status-delivered {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .admin-order-body {
          padding: 20px;
        }

        .admin-ordered-item {
          font-size: 13px;
          color: var(--color-body-dark);
          margin-bottom: 6px;
        }

        .admin-order-address-box {
          border-top: 1px dashed var(--color-border);
          padding-top: 15px;
          margin-top: 15px;
          font-size: 12px;
        }

        /* Responsive admin */
        @media (max-width: 768px) {
          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .admin-order-header {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .form-grid-2, .form-grid-3 {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

        /* Low Stock Alert Styling */
        .low-stock-alert-banner {
          background-color: #fff1f0;
          border: 1px solid #ffa39e;
          border-radius: var(--border-radius-md);
          padding: 15px 20px;
          margin-bottom: 30px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          animation: borderPulse 2s infinite ease-in-out;
        }

        .blinking-warning-dot {
          width: 8px;
          height: 8px;
          background-color: var(--color-danger);
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
          box-shadow: 0 0 8px var(--color-danger);
          animation: blink 1s infinite alternate;
        }

        .low-stock-items-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .low-stock-item-tag {
          background-color: #fff;
          border: 1px solid #ffccc7;
          color: var(--color-danger);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .lowstock-text {
          color: var(--color-danger);
          font-weight: 700;
          animation: textFlash 1.5s infinite alternate;
        }

        @keyframes borderPulse {
          0% { border-color: #ffa39e; box-shadow: 0 0 4px rgba(255, 77, 79, 0.1); }
          50% { border-color: var(--color-danger); box-shadow: 0 0 12px rgba(255, 77, 79, 0.2); }
          100% { border-color: #ffa39e; box-shadow: 0 0 4px rgba(255, 77, 79, 0.1); }
        }

        @keyframes blink {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }

        @keyframes textFlash {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
