import React, { useState, useEffect, useRef } from 'react';

const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`;

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

export default function ProductsPage({ addToCart, toggleFavorite, isFavorite, user, onLoginRedirect }) {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [reviews, setReviews] = useState([]);

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { const style = document.createElement('style'); style.textContent = FONTS; document.head.appendChild(style); return () => document.head.removeChild(style); }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/products');
      const data = await response.json();
      if (data.success) {
        setAllProducts(data.products.map(p => ({
          ...p,
          stock: Math.max(0, p.stock ?? 0), // FIX: clamp negative stock to 0
          sizes: p.sizes || ['XS', 'S', 'M', 'L', 'XL'],
          colors: p.colors || [{ name: 'Noir', hex: '#1a1a1a' }, { name: 'Ivory', hex: '#f5f0e8' }],
          rating: p.rating || 5,
          reviews: p.reviews || 0,
          isNew: p.is_new || false,
          onSale: p.on_sale || false,
          originalPrice: p.original_price || null,
        })));
      }
    } catch (error) { console.error('Error fetching products:', error); }
    finally { setIsLoading(false); }
  };

  const fetchReviews = async (productId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reviews?product_id=${productId}`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews || []);
    } catch { setReviews([]); }
  };

  const validateCoupon = async () => {
    setCouponError(''); setCouponData(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/coupons/validate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      });
      const data = await res.json();
      if (data.success) setCouponData(data.coupon);
      else setCouponError(data.message || 'Invalid coupon');
    } catch { setCouponError('Could not validate coupon'); }
  };

  const getDiscountedPrice = (price) => {
    if (!couponData) return price;
    if (couponData.type === 'percentage') return price * (1 - couponData.value / 100);
    return Math.max(0, price - couponData.value);
  };

  const categories = ['all', ...new Set(allProducts.map(p => p.category))];
  const allSizes = [...new Set(allProducts.flatMap(p => p.sizes || []))];
  const allColors = [...new Map(allProducts.flatMap(p => p.colors || []).map(c => [c.name, c])).values()];
  const activeFilterCount = [
    selectedCategory !== 'all' ? 1 : 0,
    selectedSizes.length,
    selectedColors.length,
    priceRange[1] < 1000 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  let filteredProducts = allProducts.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    if (selectedSizes.length > 0 && !product.sizes?.some(s => selectedSizes.includes(s))) return false;
    if (selectedColors.length > 0 && !product.colors?.some(c => selectedColors.includes(c.name))) return false;
    return true;
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'newest': return b.isNew - a.isNew;
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      default: return 0;
    }
  });

  const toggleSize = (size) => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  const toggleColorFilter = (colorName) => setSelectedColors(prev => prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]);
  const clearFilters = () => { setSelectedCategory('all'); setPriceRange([0, 1000]); setSelectedSizes([]); setSelectedColors([]); setSortBy('featured'); };
  const resetSelections = () => { setSelectedSize(''); setSelectedColor(null); setQuantity(1); setCouponCode(''); setCouponData(null); setCouponError(''); setActiveTab('details'); };

  const openQuickView = (product) => {
    setQuickViewProduct(product);
    resetSelections();
    fetchReviews(product.id);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 4);
    });
  };

  const handleAddToCart = (product) => {
    if (!user) { onLoginRedirect(); return; }
    if (!selectedSize || !selectedColor) { alert('Please select a size and color'); return; }
    if (product.stock <= 0) { alert('This item is out of stock'); return; } // FIX: block add if no stock
    const finalPrice = getDiscountedPrice(product.price);
    addToCart({ ...product, selectedSize, selectedColor: selectedColor.name, quantity, price: finalPrice });
    resetSelections();
    setQuickViewProduct(null);
  };

  const handleToggleFavorite = (product, e) => {
    e.stopPropagation();
    if (!user) { onLoginRedirect(); return; }
    toggleFavorite(product);
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes shimmer { 0%,100% { opacity: 0.3 } 50% { opacity: 1 } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>Curating Collection</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', paddingTop: '100px', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        ${FONTS}
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .filter-chip:hover { background: rgba(255,255,255,0.15) !important; }
        .product-card { animation: fadeUp 0.5s ease forwards; opacity: 0; }
        .product-card:nth-child(1) { animation-delay: 0.05s; }
        .product-card:nth-child(2) { animation-delay: 0.1s; }
        .product-card:nth-child(3) { animation-delay: 0.15s; }
        .product-card:nth-child(4) { animation-delay: 0.2s; }
        .product-card:nth-child(5) { animation-delay: 0.25s; }
        .product-card:nth-child(6) { animation-delay: 0.3s; }
        .low-stock-pulse { animation: pulse 1.5s ease-in-out infinite; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 2px; background: rgba(255,255,255,0.15); outline: none; border-radius: 1px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #fff; cursor: pointer; }
        select option { background: #1a1a1a; color: #fff; }
      `}</style>

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '64px', animation: 'fadeUp 0.6s ease forwards' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', letterSpacing: '4px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: '12px' }}>
                The Collection
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 0.9, color: '#fff' }}>
                All Pieces
              </h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: 300, color: 'rgba(255,255,255,0.12)', lineHeight: 1 }}>{filteredProducts.length.toString().padStart(2, '0')}</p>
              <p style={{ fontSize: '12px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Items Found</p>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '24px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginRight: '4px' }}>Active:</span>
              {selectedCategory !== 'all' && (
                <button className="filter-chip" onClick={() => setSelectedCategory('all')} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', color: '#fff', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', textTransform: 'capitalize' }}>
                  {selectedCategory} <span style={{ color: 'rgba(255,255,255,0.4)' }}>✕</span>
                </button>
              )}
              {selectedSizes.map(s => (
                <button key={s} className="filter-chip" onClick={() => toggleSize(s)} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', color: '#fff', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                  {s} <span style={{ color: 'rgba(255,255,255,0.4)' }}>✕</span>
                </button>
              ))}
              {selectedColors.map(c => (
                <button key={c} className="filter-chip" onClick={() => toggleColorFilter(c)} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', color: '#fff', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                  {c} <span style={{ color: 'rgba(255,255,255,0.4)' }}>✕</span>
                </button>
              ))}
              {priceRange[1] < 1000 && (
                <button className="filter-chip" onClick={() => setPriceRange([0, 1000])} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', color: '#fff', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                  Under ${priceRange[1]} <span style={{ color: 'rgba(255,255,255,0.4)' }}>✕</span>
                </button>
              )}
              <button onClick={clearFilters} style={{ padding: '6px 14px', background: 'transparent', border: 'none', color: 'rgba(255,100,100,0.7)', fontSize: '12px', cursor: 'pointer', letterSpacing: '1px' }}>Clear all</button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>

          {/* Sidebar */}
          {showFilters && (
            <aside style={{ flex: '0 0 260px', position: 'sticky', top: '120px', animation: 'fadeUp 0.5s ease forwards' }}>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '32px' }}>

                {/* Category */}
                <div style={{ marginBottom: '40px' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '20px' }}>Category</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {categories.map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        color: selectedCategory === cat ? '#fff' : 'rgba(255,255,255,0.35)',
                        fontFamily: selectedCategory === cat ? "'Cormorant Garamond', serif" : "'DM Sans', sans-serif",
                        fontSize: selectedCategory === cat ? '20px' : '14px',
                        fontWeight: selectedCategory === cat ? 400 : 300,
                        transition: 'all 0.3s',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        textTransform: 'capitalize',
                      }}>
                        {cat}
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Sans', sans-serif" }}>
                          {cat === 'all' ? allProducts.length : allProducts.filter(p => p.category === cat).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div style={{ marginBottom: '40px' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '20px' }}>Price</p>
                  <input type="range" min="0" max="1000" step="25" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} style={{ width: '100%', marginBottom: '12px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>$0</span>
                    <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Size */}
                {allSizes.length > 0 && (
                  <div style={{ marginBottom: '40px' }}>
                    <p style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '20px' }}>Size</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {allSizes.map(size => (
                        <button key={size} onClick={() => toggleSize(size)} style={{
                          width: '44px', height: '44px', background: selectedSizes.includes(size) ? '#fff' : 'transparent',
                          color: selectedSizes.includes(size) ? '#000' : 'rgba(255,255,255,0.4)',
                          border: `1px solid ${selectedSizes.includes(size) ? '#fff' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.5px'
                        }}>{size}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color */}
                {allColors.length > 0 && (
                  <div style={{ marginBottom: '40px' }}>
                    <p style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '20px' }}>Color</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {allColors.map(color => (
                        <button key={color.name} onClick={() => toggleColorFilter(color.name)} title={color.name} style={{
                          width: '32px', height: '32px', borderRadius: '50%', background: color.hex,
                          border: selectedColors.includes(color.name) ? '2px solid #fff' : '2px solid transparent',
                          outline: selectedColors.includes(color.name) ? '2px solid rgba(255,255,255,0.3)' : 'none',
                          outlineOffset: '2px',
                          cursor: 'pointer', transition: 'all 0.2s'
                        }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* Main */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <button onClick={() => setShowFilters(!showFilters)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s', padding: 0 }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <line x1="0" y1="1" x2="16" y2="1" stroke="currentColor" strokeWidth="1.5"/>
                  <line x1="3" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5"/>
                  <line x1="6" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                {showFilters ? 'Hide' : 'Show'} Filters
                {activeFilterCount > 0 && <span style={{ background: '#fff', color: '#000', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeFilterCount}</span>}
              </button>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 0', fontSize: '13px', letterSpacing: '1px', cursor: 'pointer', outline: 'none', textTransform: 'uppercase' }}>
                <option value="featured">Featured</option>
                <option value="price-low">Price ↑</option>
                <option value="price-high">Price ↓</option>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '120px 40px' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: 300, color: 'rgba(255,255,255,0.1)', marginBottom: '16px' }}>No results</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', marginBottom: '32px' }}>Try adjusting your filters</p>
                <button onClick={clearFilters} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '12px 32px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#fff'; }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${showFilters ? '260px' : '300px'}, 1fr))`, gap: '2px' }}>
                {filteredProducts.map((product, idx) => (
                  <article key={product.id} className="product-card" style={{ animationDelay: `${idx * 0.05}s`, position: 'relative', background: '#111', overflow: 'hidden', cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredCard(product.id)}
                    onMouseLeave={() => setHoveredCard(null)}>

                    {/* Image */}
                    <div style={{ position: 'relative', paddingBottom: '125%', overflow: 'hidden' }} onClick={() => openQuickView(product)}>
                      <img src={product.image} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)', transform: hoveredCard === product.id ? 'scale(1.08)' : 'scale(1)' }} />
                      
                      {/* Gradient overlay */}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)', opacity: hoveredCard === product.id ? 1 : 0, transition: 'opacity 0.4s' }} />

                      {/* Badges */}
                      <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {product.isNew && <span style={{ background: '#fff', color: '#000', padding: '4px 10px', fontSize: '9px', fontWeight: 700, letterSpacing: '2px' }}>NEW</span>}
                        {product.onSale && <span style={{ background: '#7f1d1d', color: '#fff', padding: '4px 10px', fontSize: '9px', fontWeight: 700, letterSpacing: '2px' }}>SALE</span>}
                        {product.stock < 10 && product.stock > 0 && <span className="low-stock-pulse" style={{ background: 'rgba(239,68,68,0.9)', color: '#fff', padding: '4px 10px', fontSize: '9px', fontWeight: 700, letterSpacing: '1px' }}>ONLY {product.stock} LEFT</span>}
                        {product.stock === 0 && <span style={{ background: 'rgba(0,0,0,0.8)', color: 'rgba(255,255,255,0.5)', padding: '4px 10px', fontSize: '9px', fontWeight: 700, letterSpacing: '1px' }}>SOLD OUT</span>}
                      </div>

                      {/* Favorite */}
                      <button onClick={(e) => handleToggleFavorite(product, e)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', opacity: hoveredCard === product.id || isFavorite(product.id) ? 1 : 0, transition: 'opacity 0.3s' }}>
                        <svg width="22" height="22" fill={isFavorite(product.id) ? '#ef4444' : 'none'} stroke={isFavorite(product.id) ? '#ef4444' : '#fff'} strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </button>

                      {/* Quick view overlay text */}
                      <div style={{ position: 'absolute', bottom: '16px', left: 0, right: 0, textAlign: 'center', opacity: hoveredCard === product.id ? 1 : 0, transition: 'opacity 0.3s', transform: hoveredCard === product.id ? 'translateY(0)' : 'translateY(8px)', transitionProperty: 'opacity, transform' }}>
                        <span style={{ fontSize: '11px', letterSpacing: '3px', color: '#fff', textTransform: 'uppercase' }}>Quick View</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '20px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div style={{ flex: 1, marginRight: '12px' }}>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>{product.category}</p>
                          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 400, color: '#fff', lineHeight: 1.2, marginBottom: '0' }}>{product.name}</h3>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: '18px', fontWeight: 500, color: '#fff' }}>{formatPrice(product.price)}</p>
                          {product.originalPrice && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</p>}
                        </div>
                      </div>

                      {/* Stars */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px' }}>
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="12" height="12" fill={i < (product.rating || 0) ? '#c9a84c' : 'rgba(255,255,255,0.1)'} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                        {product.reviews > 0 && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginLeft: '4px' }}>({product.reviews})</span>}
                      </div>

                      <button onClick={() => openQuickView(product)} style={{ width: '100%', marginTop: '16px', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s', fontFamily: "'DM Sans', sans-serif" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                        Select Options
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <div style={{ marginTop: '80px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '48px' }}>
                <p style={{ fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '24px' }}>Recently Viewed</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
                  {recentlyViewed.map(product => (
                    <div key={product.id} onClick={() => openQuickView(product)} style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                      onMouseEnter={(e) => e.currentTarget.querySelector('img').style.transform = 'scale(1.06)'}
                      onMouseLeave={(e) => e.currentTarget.querySelector('img').style.transform = 'scale(1)'}>
                      <div style={{ paddingBottom: '130%', position: 'relative', overflow: 'hidden', background: '#111' }}>
                        <img src={product.image} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                      </div>
                      <div style={{ padding: '12px 8px' }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>{product.name}</p>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (() => {
        const productStock = Math.max(0, quickViewProduct.stock ?? 0); // FIX: clamp for modal use
        return (
          <div onClick={() => { setQuickViewProduct(null); resetSelections(); }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div onClick={(e) => e.stopPropagation()}
              style={{ background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.07)', maxWidth: '960px', width: '100%', maxHeight: '90vh', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', animation: 'fadeUp 0.3s ease' }}>

              {/* Image side */}
              <div style={{ position: 'relative', overflow: 'hidden', background: '#111', minHeight: '500px' }}>
                <img src={quickViewProduct.image} alt={quickViewProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {quickViewProduct.isNew && <span style={{ background: '#fff', color: '#000', padding: '4px 10px', fontSize: '9px', fontWeight: 700, letterSpacing: '2px' }}>NEW</span>}
                  {quickViewProduct.onSale && <span style={{ background: '#7f1d1d', color: '#fff', padding: '4px 10px', fontSize: '9px', fontWeight: 700, letterSpacing: '2px' }}>SALE</span>}
                </div>
                <button onClick={(e) => handleToggleFavorite(quickViewProduct, e)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', padding: '10px', backdropFilter: 'blur(8px)', borderRadius: '2px' }}>
                  <svg width="20" height="20" fill={isFavorite(quickViewProduct.id) ? '#ef4444' : 'none'} stroke={isFavorite(quickViewProduct.id) ? '#ef4444' : '#fff'} strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>

              {/* Info side */}
              <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                {/* Close */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 24px 0' }}>
                  <button onClick={() => { setQuickViewProduct(null); resetSelections(); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '4px' }}>✕</button>
                </div>

                <div style={{ padding: '16px 32px 32px', flex: 1 }}>
                  {/* Name & Price */}
                  <p style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '8px' }}>{quickViewProduct.category}</p>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: '20px' }}>{quickViewProduct.name}</h2>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    {couponData ? (
                      <>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: '#c9a84c' }}>{formatPrice(getDiscountedPrice(quickViewProduct.price))}</span>
                        <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>{formatPrice(quickViewProduct.price)}</span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: '#fff' }}>{formatPrice(quickViewProduct.price)}</span>
                        {quickViewProduct.originalPrice && <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>{formatPrice(quickViewProduct.originalPrice)}</span>}
                      </>
                    )}
                  </div>

                  {/* Stars */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="14" height="14" fill={i < quickViewProduct.rating ? '#c9a84c' : 'rgba(255,255,255,0.1)'} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginLeft: '4px' }}>({quickViewProduct.reviews} reviews)</span>
                  </div>

                  {/* Tabs */}
                  <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['details', 'reviews'].map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.3)', borderBottom: activeTab === tab ? '1px solid #fff' : '1px solid transparent', marginBottom: '-1px', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>{tab}</button>
                    ))}
                  </div>

                  {activeTab === 'details' ? (
                    <div>
                      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '24px' }}>{quickViewProduct.description}</p>

                      {/* Size */}
                      {quickViewProduct.sizes?.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                          <p style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '12px' }}>
                            Size — <span style={{ color: selectedSize ? '#fff' : 'rgba(255,255,255,0.2)' }}>{selectedSize || 'Select'}</span>
                          </p>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {quickViewProduct.sizes.map(size => (
                              <button key={size} onClick={() => setSelectedSize(size)} style={{ width: '48px', height: '48px', background: selectedSize === size ? '#fff' : 'transparent', color: selectedSize === size ? '#000' : 'rgba(255,255,255,0.5)', border: `1px solid ${selectedSize === size ? '#fff' : 'rgba(255,255,255,0.15)'}`, fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.5px' }}>{size}</button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Color */}
                      {quickViewProduct.colors?.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                          <p style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '12px' }}>
                            Color — <span style={{ color: selectedColor ? '#fff' : 'rgba(255,255,255,0.2)' }}>{selectedColor?.name || 'Select'}</span>
                          </p>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            {quickViewProduct.colors.map(color => (
                              <button key={color.name} onClick={() => setSelectedColor(color)} title={color.name} style={{ width: '32px', height: '32px', borderRadius: '50%', background: color.hex, border: selectedColor?.name === color.name ? '2px solid #fff' : '2px solid transparent', outline: selectedColor?.name === color.name ? '1px solid rgba(255,255,255,0.4)' : 'none', outlineOffset: '2px', cursor: 'pointer', transition: 'all 0.2s' }} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quantity */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <p style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Qty</p>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', color: '#fff', width: '40px', height: '40px', fontSize: '18px', cursor: 'pointer' }}>−</button>
                          <span style={{ width: '40px', textAlign: 'center', fontSize: '14px', color: '#fff' }}>{quantity}</span>
                          <button
                            onClick={() => setQuantity(Math.min(productStock, quantity + 1))}
                            disabled={productStock === 0 || quantity >= productStock}
                            style={{ background: 'none', border: 'none', color: '#fff', width: '40px', height: '40px', fontSize: '18px', cursor: (productStock === 0 || quantity >= productStock) ? 'not-allowed' : 'pointer', opacity: (productStock === 0 || quantity >= productStock) ? 0.3 : 1 }}
                          >+</button>
                        </div>
                        {productStock < 10 && productStock > 0 && (
                          <span className="low-stock-pulse" style={{ fontSize: '12px', color: '#ef4444', letterSpacing: '1px' }}>Only {productStock} left</span>
                        )}
                      </div>

                      {/* Coupon */}
                      <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '10px' }}>Coupon Code</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter code..." style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 12px', fontSize: '13px', outline: 'none', letterSpacing: '1px', fontFamily: "'DM Sans', sans-serif" }} />
                          <button onClick={validateCoupon} style={{ background: '#fff', color: '#000', border: 'none', padding: '10px 16px', fontSize: '11px', letterSpacing: '1.5px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>Apply</button>
                        </div>
                        {couponData && <p style={{ fontSize: '12px', color: '#c9a84c', marginTop: '8px', letterSpacing: '0.5px' }}>✓ {couponData.type === 'percentage' ? `${couponData.value}% off` : `$${couponData.value} off`} applied</p>}
                        {couponError && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '8px' }}>{couponError}</p>}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {reviews.filter(r => r.status === 'approved').length === 0 ? (
                        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px', padding: '24px 0', textAlign: 'center', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>No reviews yet for this piece</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {reviews.filter(r => r.status === 'approved').map((review, i) => (
                            <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div>
                                  <p style={{ fontSize: '14px', color: '#fff', fontWeight: 500, marginBottom: '4px' }}>{review.customer?.name || 'Customer'}</p>
                                  <div style={{ display: 'flex', gap: '3px' }}>
                                    {[...Array(5)].map((_, j) => (
                                      <svg key={j} width="12" height="12" fill={j < review.rating ? '#c9a84c' : 'rgba(255,255,255,0.1)'} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>{new Date(review.created_at).toLocaleDateString()}</span>
                              </div>
                              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{review.body}</p>
                              {review.reply && (
                                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>From RARE</p>
                                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{review.reply}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add to Cart */}
                  <button onClick={() => handleAddToCart(quickViewProduct)}
                    disabled={productStock === 0}
                    style={{ width: '100%', padding: '16px', background: productStock === 0 ? 'rgba(255,255,255,0.05)' : '#fff', color: productStock === 0 ? 'rgba(255,255,255,0.2)' : '#000', border: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: productStock === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.3s', fontFamily: "'DM Sans', sans-serif", marginTop: activeTab === 'reviews' ? '24px' : '0' }}
                    onMouseEnter={(e) => { if (productStock > 0) { e.currentTarget.style.background = '#7f1d1d'; e.currentTarget.style.color = '#fff'; }}}
                    onMouseLeave={(e) => { if (productStock > 0) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}}>
                    {productStock === 0 ? 'Sold Out' : `Add to Cart — ${formatPrice(getDiscountedPrice(quickViewProduct.price) * quantity)}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}