import React, { useState, useEffect } from 'react';
import { auth, favorites as favoritesAPI, orders as ordersAPI } from './services/api';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import VideoSection from './components/VideoSection';
import BestSellersCarousel from './components/BestSellersCarousel';
import Footer from './components/Footer';
import FavoritesPopup from './components/FavoritesPopup';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductsPage from './pages/ProductsPage';
import Notification from './components/Notification';
import AboutSection from './components/AboutSection';
import UserProfile from './components/UserProfile';

const API_URL = 'http://127.0.0.1:8000/api';
const authHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json',
});

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; }
    catch { return []; }
  });
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('currentPage') || 'home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token'));
  const [storeProducts, setStoreProducts] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [registeredCustomers, setRegisteredCustomers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ revenue: 0, orders: 0, customers: 0, products: 0 });
  const [isRestoring, setIsRestoring] = useState(true);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => { localStorage.setItem('currentPage', currentPage); }, [currentPage]);

  // Bootstrap: restore session
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) { setIsRestoring(false); return; }
      try {
        const data = await auth.me();
        const userData = data.user ?? data.customer ?? data;
        const isAdminUser = userData.role === 'admin' || userData.isAdmin === true;
        setUser(userData);
        setIsAdmin(isAdminUser);
        setAuthToken(token);
        if (isAdminUser) {
          fetchDashboardStats();
          fetchOrders();
        } else {
          fetchUserOrders(token);
          fetchFavorites(token);
        }
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('currentPage');
        setCurrentPage('home');
      } finally {
        setIsRestoring(false);
      }
    };
    restoreSession();
  }, []);

  useEffect(() => { fetchProducts(); }, []);

  // ── Fetch dashboard stats from API ─────────────────────────────────────────
  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/dashboard`, { headers: authHeader() });
      const data = await res.json();
      if (data.success) {
        setDashboardStats({
          revenue:   data.stats.revenue   || 0,
          orders:    data.stats.orders    || 0,
          customers: data.stats.customers || 0,
          products:  data.stats.products  || 0,
        });
        // Also populate recent orders if available
        if (data.recentOrders) {
          setCompletedOrders(prev => {
            // Only set if completedOrders is empty (full fetch hasn't happened yet)
            return prev.length === 0 ? data.recentOrders : prev;
          });
        }
      }
    } catch (err) { console.error('Dashboard fetch error:', err); }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (data.success) setStoreProducts(data.products);
    } catch (err) { console.error('Error fetching products:', err); }
  };

  // Fetch customer's own orders from DB
  const fetchUserOrders = async (token) => {
    const t = token || authToken;
    if (!t) return;
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) setUserOrders(data.orders || []);
    } catch (err) { console.error('Error fetching user orders:', err); }
  };

  // Fetch favorites from DB
  const fetchFavorites = async (token) => {
    const t = token || authToken;
    if (!t) return;
    try {
      const res = await fetch(`${API_URL}/favorites`, {
        headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) setFavorites(data.favorites || data.products || []);
    } catch (err) { console.error('Error fetching favorites:', err); }
  };

  const fetchOrders = async () => {
    if (!localStorage.getItem('auth_token')) return;
    try {
      const res = await fetch(`${API_URL}/admin/orders`, { headers: authHeader() });
      const data = await res.json();
      if (data.success) setCompletedOrders(data.orders || []);
    } catch (err) { console.error('Error fetching orders:', err); }
  };

  const showNotification = (message, type = 'success') => setNotification({ message, type });

  const handleLogin = async (userData, token) => {
    const isAdminUser = userData.role === 'admin' || userData.isAdmin === true;
    setUser({ email: userData.email, name: userData.name, role: userData.role || (isAdminUser ? 'admin' : 'customer'), loginTime: new Date().toISOString(), ...userData });
    setIsAdmin(isAdminUser);
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('auth_token', token);
    if (isAdminUser) localStorage.setItem('isAdmin', 'true');
    if (isAdminUser) {
      fetchDashboardStats();
      fetchOrders();
      showNotification(`Welcome Admin ${userData.name || ''}!`);
      setCurrentPage('admin');
    } else {
      fetchUserOrders(token);
      fetchFavorites(token);
      showNotification(`Welcome back ${userData.name || ''}!`);
      setCurrentPage('home');
    }
  };

  const handleRegister = (userData) => {
    const token = localStorage.getItem('auth_token');
    setUser({ email: userData.email, name: userData.name, role: 'customer', loginTime: new Date().toISOString(), ...userData });
    setIsAdmin(false);
    setAuthToken(token);
    setUserOrders([]);
    setFavorites([]);
    showNotification('Account created successfully! Welcome to RARE!', 'success');
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try { await auth.logout(); } catch (err) { console.error('Logout error:', err); }
      setUser(null); setIsAdmin(false); setCart([]); setFavorites([]);
      setAuthToken(null); setUserOrders([]);
      setDashboardStats({ revenue: 0, orders: 0, customers: 0, products: 0 });
      setCompletedOrders([]);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('currentPage');
      localStorage.removeItem('cart');
      showNotification('Logged out successfully');
      setCurrentPage('home');
    }
  };

  const navigateToLogin = () => setCurrentPage('login');
  const navigateToHome = () => setCurrentPage('home');
  const navigateToCart = () => setCurrentPage('cart');
  const navigateToProducts = () => setCurrentPage('products');
  const navigateToProfile = () => isAdmin ? setCurrentPage('admin') : setCurrentPage('profile');

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor);
    if (existing) {
      setCart(cart.map(item => item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor
        ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item));
      showNotification('Quantity updated in cart!');
    } else {
      setCart([...cart, { ...product, quantity: product.quantity || 1 }]);
      showNotification('Added to cart!');
    }
  };

  const toggleFavorite = async (product) => {
    const isCurrentlyFavorite = favorites.some(item => item.id === product.id);
    if (isCurrentlyFavorite) {
      setFavorites(prev => prev.filter(item => item.id !== product.id));
      showNotification('Removed from favorites');
    } else {
      setFavorites(prev => [...prev, product]);
      showNotification('Added to favorites!');
    }
    if (authToken) {
      try {
        await fetch(`${API_URL}/favorites/toggle`, {
          method: 'POST',
          headers: authHeader(),
          body: JSON.stringify({ product_id: product.id }),
        });
      } catch (err) {
        console.error('Failed to sync favorite:', err);
        if (isCurrentlyFavorite) {
          setFavorites(prev => [...prev, product]);
        } else {
          setFavorites(prev => prev.filter(item => item.id !== product.id));
        }
      }
    }
  };

  const updateQuantity = (productId, change) =>
    setCart(cart.map(item => item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item));

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    showNotification('Removed from cart');
  };

  const isFavorite = (productId) => favorites.some(item => item.id === productId);

  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    if (!user) { showNotification('Please login to checkout', 'error'); return; }
    try {
      await ordersAPI.place({ cart, subtotal, shipping, tax, total });
      setCart([]);
      localStorage.removeItem('cart');
      showNotification('Order placed successfully! 🎉', 'success');
      await fetchUserOrders();
      setCurrentPage('home');
    } catch (err) {
      console.error('Checkout error:', err);
      showNotification(err.message || 'Failed to place order', 'error');
    }
  };

  const addProduct = (productData) => {
    setStoreProducts(prev => [...prev, { ...productData, id: Date.now(), sales: 0, status: 'active' }]);
    showNotification('Product added successfully!');
  };

  const updateProduct = (productId, updatedData) => {
    setStoreProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updatedData } : p));
    showNotification('Product updated successfully!');
  };

  const deleteProduct = (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setStoreProducts(prev => prev.filter(p => p.id !== productId));
      showNotification('Product deleted successfully!');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setCompletedOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    // Refresh dashboard stats when an order is marked completed
    if (newStatus === 'completed') fetchDashboardStats();
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT', headers: authHeader(),
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        fetchOrders();
        showNotification(data.message || 'Failed to update status', 'error');
      } else {
        showNotification(`Order updated to ${newStatus}!`);
        // Refresh stats to reflect latest revenue
        fetchDashboardStats();
      }
    } catch {
      fetchOrders();
      showNotification('Failed to update order status', 'error');
    }
  };

  const headerProps = {
    user, cart, favorites, isAdmin,
    onLoginClick: user ? handleLogout : navigateToLogin,
    onFavoritesClick: () => setShowFavorites(!showFavorites),
    onCartClick: navigateToCart,
    onAdminClick: () => setCurrentPage('admin'),
    onHomeClick: navigateToHome,
    onProductsClick: navigateToProducts,
    onProfileClick: navigateToProfile,
  };

  const NotificationBar = () => notification ? (
    <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
  ) : null;

  if (isRestoring) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid rgba(127,29,29,0.3)', borderTopColor: '#7f1d1d', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
          <p style={{ fontSize: '14px', color: '#6b7280', letterSpacing: '1px' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (currentPage === 'profile') {
    return (
      <>
        <NotificationBar />
        <div style={{ fontFamily: 'system-ui, sans-serif', background: '#000', color: '#fff', minHeight: '100vh' }}>
          <Header {...headerProps} />
          {showFavorites && <FavoritesPopup favorites={favorites} onClose={() => setShowFavorites(false)} onRemove={toggleFavorite} />}
          <UserProfile user={user} onBack={navigateToHome} orders={userOrders} />
        </div>
      </>
    );
  }

  if (currentPage === 'admin' && isAdmin) {
    return (
      <>
        <NotificationBar />
        <AdminDashboard
          onLogout={handleLogout} onBackToStore={() => setCurrentPage('home')}
          products={storeProducts} orders={completedOrders} customers={registeredCustomers}
          dashboardStats={dashboardStats}
          onAddProduct={addProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct}
          onUpdateOrderStatus={updateOrderStatus} showNotification={showNotification}
          onRefreshStats={fetchDashboardStats}
        />
      </>
    );
  }

  if (currentPage === 'login') {
    return (
      <>
        <NotificationBar />
        <LoginPage onLogin={handleLogin} onBack={navigateToHome} onRegister={() => setCurrentPage('register')} showNotification={showNotification} />
      </>
    );
  }

  if (currentPage === 'register') {
    return (
      <>
        <NotificationBar />
        <RegisterPage onRegister={handleRegister} onBack={() => setCurrentPage('login')} showNotification={showNotification} />
      </>
    );
  }

  if (currentPage === 'cart') {
    return (
      <>
        <NotificationBar />
        <CartPage
          cart={cart} user={user} onBack={navigateToHome} onLogout={handleLogout} onLogin={navigateToLogin}
          updateQuantity={updateQuantity} removeFromCart={removeFromCart}
          subtotal={subtotal} shipping={shipping} tax={tax} total={total}
          showNotification={showNotification} onCheckout={handleCheckout}
        />
      </>
    );
  }

  if (currentPage === 'products') {
    return (
      <>
        <NotificationBar />
        <div style={{ fontFamily: 'system-ui, sans-serif', background: '#000', color: '#fff', minHeight: '100vh' }}>
          <Header {...headerProps} />
          {showFavorites && <FavoritesPopup favorites={favorites} onClose={() => setShowFavorites(false)} onRemove={toggleFavorite} />}
          <ProductsPage products={storeProducts} addToCart={addToCart} toggleFavorite={toggleFavorite} isFavorite={isFavorite} user={user} onLoginRedirect={navigateToLogin} />
          <Footer showNotification={showNotification} setCurrentPage={setCurrentPage} />
        </div>
      </>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#000', color: '#fff', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <NotificationBar />
      <Header {...headerProps} />
      {showFavorites && <FavoritesPopup favorites={favorites} onClose={() => setShowFavorites(false)} onRemove={toggleFavorite} />}
      <div style={{ paddingTop: '160px' }}>
        <HeroCarousel onShopNowClick={navigateToProducts} />
        <VideoSection />
        <AboutSection onExploreClick={navigateToProducts} />
        <BestSellersCarousel
  products={storeProducts}
  toggleFavorite={toggleFavorite}
  isFavorite={isFavorite}
  user={user}
  onLoginRedirect={navigateToLogin}
  addToCart={addToCart}
/>
        <Footer showNotification={showNotification} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
}