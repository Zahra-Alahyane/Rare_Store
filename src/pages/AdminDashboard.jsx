import React, { useState, useEffect } from 'react';
import { admin } from '../services/api';

import Sidebar from '../components/admin/Sidebar';
import DashboardTab from '../components/admin/tabs/DashboardTab';
import ProductsTab from '../components/admin/tabs/ProductsTab';
import OrdersTab from '../components/admin/tabs/OrdersTab';
import CustomersTab from '../components/admin/tabs/CustomersTab';
import CouponsTab from '../components/admin/tabs/CouponsTab';
import ReviewsTab from '../components/admin/tabs/ReviewsTab';
import ReturnsTab from '../components/admin/tabs/ReturnsTab';
import ReportsTab from '../components/admin/tabs/ReportsTab';          // ← NEW
import AddProductModal from '../components/admin/modals/AddProductModal';
import EditProductModal from '../components/admin/modals/EditProductModal';

const BASE = 'http://127.0.0.1:8000/api';
const authHeader = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` });

const AdminDashboard = ({ onLogout, onBackToStore, showNotification }) => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({ revenue: 0, orders: 0, customers: 0, products: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [returns, setReturns] = useState([]);

  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '', image: '', description: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => { 
  fetchDashboard(); 
  fetchOrders();
  fetchProducts();
  fetchCustomers();
}, []);

useEffect(() => {
  const interval = setInterval(() => {
    fetchDashboard();
    if (currentTab === 'orders') fetchOrders();
    if (currentTab === 'products') fetchProducts();
    if (currentTab === 'customers') fetchCustomers();
    if (currentTab === 'coupons') fetchCoupons();
    if (currentTab === 'reviews') fetchReviews();
    if (currentTab === 'returns') fetchReturns();
  }, 30000);
  return () => clearInterval(interval);
}, [currentTab]);

useEffect(() => {
  if (currentTab === 'dashboard') fetchDashboard();
  if (currentTab === 'products') fetchProducts();
  if (currentTab === 'orders') fetchOrders();
  if (currentTab === 'customers') fetchCustomers();
  if (currentTab === 'coupons') fetchCoupons();
  if (currentTab === 'reviews') fetchReviews();
  if (currentTab === 'returns') fetchReturns();
  if (currentTab === 'reports') {
    fetchOrders();
    fetchProducts();
    fetchCustomers();
  }
}, [currentTab]);

  const load = (hasData) => hasData ? setIsRefreshing(true) : setIsInitialLoading(true);
  const done = () => { setIsInitialLoading(false); setIsRefreshing(false); };

  const fetchDashboard = async () => {
    load(dashboardStats.revenue || dashboardStats.orders);
    try { const data = await admin.dashboard(); setDashboardStats(data.stats); setRecentOrders(data.recentOrders || []); }
    catch (err) { showNotification(err.message || 'Failed to load dashboard', 'error'); }
    finally { done(); }
  };

  const fetchProducts = async () => {
    load(products.length > 0);
    try { const res = await fetch(`${BASE}/products`); const data = await res.json(); if (data.success) setProducts(data.products); }
    catch { showNotification('Failed to load products', 'error'); }
    finally { done(); }
  };

  const fetchOrders = async () => {
    load(orders.length > 0);
    try { const data = await admin.allOrders(); setOrders(data.orders || []); }
    catch { showNotification('Failed to load orders', 'error'); }
    finally { done(); }
  };

  const fetchCustomers = async () => {
    load(customers.length > 0);
    try { const data = await admin.customers(); setCustomers(data.customers || []); }
    catch { showNotification('Failed to load customers', 'error'); }
    finally { done(); }
  };

  const fetchCoupons = async () => {
    load(coupons.length > 0);
    try { const res = await fetch(`${BASE}/admin/coupons`, { headers: authHeader() }); const data = await res.json(); if (data.success) setCoupons(data.coupons); }
    catch { showNotification('Failed to load coupons', 'error'); }
    finally { done(); }
  };

  const fetchReviews = async () => {
    load(reviews.length > 0);
    try { const res = await fetch(`${BASE}/admin/reviews`, { headers: authHeader() }); const data = await res.json(); if (data.success) setReviews(data.reviews); }
    catch { showNotification('Failed to load reviews', 'error'); }
    finally { done(); }
  };

  const fetchReturns = async () => {
    load(returns.length > 0);
    try { const res = await fetch(`${BASE}/admin/returns`, { headers: authHeader() }); const data = await res.json(); if (data.success) setReturns(data.returns); }
    catch { showNotification('Failed to load returns', 'error'); }
    finally { done(); }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) { showNotification('Please fill all required fields', 'error'); return; }
    try {
      const res = await fetch(`${BASE}/products`, { method: 'POST', headers: authHeader(), body: JSON.stringify({ ...newProduct, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock), image: newProduct.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500', status: 'active' }) });
      const data = await res.json();
      if (data.success) { showNotification('Product added!'); setNewProduct({ name: '', category: '', price: '', stock: '', image: '', description: '' }); setShowAddProduct(false); fetchProducts(); fetchDashboard(); }
      else throw new Error(data.message);
    } catch (err) { showNotification(err.message, 'error'); }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.stock) { showNotification('Please fill all required fields', 'error'); return; }
    try {
      const res = await fetch(`${BASE}/products/${editingProduct.id}`, { method: 'PUT', headers: authHeader(), body: JSON.stringify({ name: editingProduct.name, category: editingProduct.category, price: parseFloat(editingProduct.price), stock: parseInt(editingProduct.stock), description: editingProduct.description, image: editingProduct.image }) });
      const data = await res.json();
      if (data.success) { showNotification('Product updated!'); setEditingProduct(null); setShowEditProduct(false); fetchProducts(); fetchDashboard(); }
      else throw new Error(data.message);
    } catch (err) { showNotification(err.message, 'error'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`${BASE}/products/${id}`, { method: 'DELETE', headers: authHeader() });
      const data = await res.json();
      if (data.success) { setProducts(prev => prev.filter(p => p.id !== id)); showNotification('Product deleted!'); fetchDashboard(); }
      else throw new Error(data.message);
    } catch (err) { showNotification(err.message, 'error'); }
  };

  const openEditModal = (product) => {
    setEditingProduct({ id: product.id, name: product.name, category: product.category, price: product.price.toString(), stock: product.stock.toString(), image: product.image, description: product.description || '' });
    setShowEditProduct(true);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      const res = await fetch(`${BASE}/orders/${orderId}/status`, { method: 'PUT', headers: authHeader(), body: JSON.stringify({ status: newStatus }) });
      const data = await res.json();
      if (data.success) { showNotification(`Order updated to ${newStatus}!`); fetchDashboard(); }
      else { fetchOrders(); throw new Error(data.message); }
    } catch (err) { fetchOrders(); showNotification(err.message, 'error'); }
  };

  const handleUpdateCustomer = async (id, payload) => {
    try {
      const res = await fetch(`${BASE}/admin/customers/${id}`, { method: 'PUT', headers: authHeader(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...payload } : c)); showNotification('Customer updated!'); }
      else throw new Error(data.message);
    } catch (err) { showNotification(err.message, 'error'); }
  };

  const handleAddCoupon = async (form) => {
  try {
    const res = await fetch(`${BASE}/admin/coupons`, { method: 'POST', headers: authHeader(), body: JSON.stringify(form) });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
    const data = JSON.parse(text);
    if (data.success) { showNotification('Coupon created!'); fetchCoupons(); }
    else throw new Error(data.message);
  } catch (err) { showNotification(err.message, 'error'); }
};

  const handleToggleCoupon = async (id) => {
    try {
      const res = await fetch(`${BASE}/admin/coupons/${id}/toggle`, { method: 'PUT', headers: authHeader() });
      const data = await res.json();
      if (data.success) { setCoupons(prev => prev.map(c => c.id === id ? data.coupon : c)); showNotification('Coupon updated!'); }
    } catch (err) { showNotification(err.message, 'error'); }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const res = await fetch(`${BASE}/admin/coupons/${id}`, { method: 'DELETE', headers: authHeader() });
      const data = await res.json();
      if (data.success) { setCoupons(prev => prev.filter(c => c.id !== id)); showNotification('Coupon deleted!'); }
    } catch (err) { showNotification(err.message, 'error'); }
  };

  const handleApproveReview = async (id) => {
    try { await fetch(`${BASE}/admin/reviews/${id}/approve`, { method: 'PUT', headers: authHeader() }); setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r)); showNotification('Review approved!'); }
    catch (err) { showNotification(err.message, 'error'); }
  };

  const handleRejectReview = async (id) => {
    try { await fetch(`${BASE}/admin/reviews/${id}/reject`, { method: 'PUT', headers: authHeader() }); setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r)); showNotification('Review rejected!'); }
    catch (err) { showNotification(err.message, 'error'); }
  };

  const handleReplyReview = async (id, reply) => {
    try { await fetch(`${BASE}/admin/reviews/${id}/reply`, { method: 'POST', headers: authHeader(), body: JSON.stringify({ reply }) }); setReviews(prev => prev.map(r => r.id === id ? { ...r, reply } : r)); showNotification('Reply sent!'); }
    catch (err) { showNotification(err.message, 'error'); }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try { await fetch(`${BASE}/admin/reviews/${id}`, { method: 'DELETE', headers: authHeader() }); setReviews(prev => prev.filter(r => r.id !== id)); showNotification('Review deleted!'); }
    catch (err) { showNotification(err.message, 'error'); }
  };

  const handleUpdateReturn = async (id, payload) => {
    try {
      const res = await fetch(`${BASE}/admin/returns/${id}`, { method: 'PUT', headers: authHeader(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { setReturns(prev => prev.map(r => r.id === id ? { ...r, ...payload } : r)); showNotification('Return updated!'); }
    } catch (err) { showNotification(err.message, 'error'); }
  };

  const revenueGrowth = (() => {
    const today = new Date();
    const last30 = new Date(today.getTime() - 30 * 86400000);
    const last60 = new Date(today.getTime() - 60 * 86400000);
    const recent = orders.filter(o => new Date(o.date) >= last30 && o.status === 'completed').reduce((s, o) => s + o.total, 0);
    const prev = orders.filter(o => { const d = new Date(o.date); return d >= last60 && d < last30 && o.status === 'completed'; }).reduce((s, o) => s + o.total, 0);
    if (prev === 0) return recent > 0 ? '+100%' : '0%';
    const g = ((recent - prev) / prev * 100).toFixed(1);
    return `${g >= 0 ? '+' : ''}${g}%`;
  })();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} onBackToStore={onBackToStore} onLogout={onLogout} />

      <div style={{ marginLeft: '280px', flex: 1, padding: '40px', minHeight: '100vh' }}>
        {currentTab === 'dashboard' && <DashboardTab isInitialLoading={isInitialLoading} dashboardStats={dashboardStats} recentOrders={recentOrders} orders={orders} products={products} customers={customers} revenueGrowth={revenueGrowth} onAddProduct={() => setShowAddProduct(true)} />}
        {currentTab === 'products' && <ProductsTab products={products} isInitialLoading={isInitialLoading} onAddProduct={() => setShowAddProduct(true)} onEditProduct={openEditModal} onDeleteProduct={handleDeleteProduct} />}
        {currentTab === 'orders' && <OrdersTab orders={orders} isInitialLoading={isInitialLoading} onUpdateOrderStatus={handleUpdateOrderStatus} />}
        {currentTab === 'customers' && <CustomersTab customers={customers} isInitialLoading={isInitialLoading} onUpdateCustomer={handleUpdateCustomer} />}
        {currentTab === 'coupons' && <CouponsTab coupons={coupons} isInitialLoading={isInitialLoading} onAdd={handleAddCoupon} onToggle={handleToggleCoupon} onDelete={handleDeleteCoupon} />}
        {currentTab === 'reviews' && <ReviewsTab reviews={reviews} isInitialLoading={isInitialLoading} onApprove={handleApproveReview} onReject={handleRejectReview} onReply={handleReplyReview} onDelete={handleDeleteReview} />}
        {currentTab === 'returns' && <ReturnsTab returns={returns} isInitialLoading={isInitialLoading} onUpdate={handleUpdateReturn} />}
        {/* ─── NEW: Reports tab ─── */}
        {currentTab === 'reports' && (
          <ReportsTab
            orders={orders}
            products={products}
            customers={customers}
            returns={returns}
            showNotification={showNotification}
          />
        )}
      </div>

      {showAddProduct && <AddProductModal newProduct={newProduct} setNewProduct={setNewProduct} onAdd={handleAddProduct} onClose={() => setShowAddProduct(false)} />}
      {showEditProduct && editingProduct && <EditProductModal editingProduct={editingProduct} setEditingProduct={setEditingProduct} onUpdate={handleUpdateProduct} onClose={() => { setShowEditProduct(false); setEditingProduct(null); }} />}
    </div>
  );
};

export default AdminDashboard;