import React, { useState } from 'react';

const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`;

const RANK_STYLES = [
  { label: '#1', bg: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: 'rgba(245,158,11,0.4)' },
  { label: '#2', bg: 'linear-gradient(135deg, #9ca3af, #6b7280)', shadow: 'rgba(156,163,175,0.3)' },
  { label: '#3', bg: 'linear-gradient(135deg, #cd7c4a, #a0522d)', shadow: 'rgba(205,124,74,0.3)' },
];

export default function BestSellersCarousel({ products = [], toggleFavorite, isFavorite, user, onLoginRedirect, addToCart }) {
  const [modalProduct, setModalProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Top 3 by sales
  const top3 = [...products]
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 3);

  const openModal = (product) => {
    setModalProduct(product);
    setSelectedSize('');
    setSelectedColor(null);
    setQuantity(1);
  };

  const closeModal = () => {
    setModalProduct(null);
    setSelectedSize('');
    setSelectedColor(null);
    setQuantity(1);
  };

  const handleToggleFavorite = (product, e) => {
    e.stopPropagation();
    if (!user) { onLoginRedirect(); return; }
    toggleFavorite(product);
  };

  const handleAddToCart = () => {
    if (!user) { onLoginRedirect(); return; }
    const hasSizes = modalProduct.sizes?.length > 0;
    const hasColors = modalProduct.colors?.length > 0;
    if (hasSizes && !selectedSize) { alert('Please select a size'); return; }
    if (hasColors && !selectedColor) { alert('Please select a color'); return; }
    addToCart({ ...modalProduct, selectedSize, selectedColor: selectedColor?.name || selectedColor, quantity });
    closeModal();
  };

  if (top3.length === 0) return null;

  return (
    <>
      <section
        id="best-sellers"
        style={{
          padding: '120px 32px',
          background: 'linear-gradient(180deg, #000 0%, #0a0a0a 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(127,29,29,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{
              display: 'inline-block', padding: '8px 24px',
              background: 'rgba(127,29,29,0.2)', border: '1px solid rgba(127,29,29,0.3)',
              borderRadius: '50px', fontSize: '12px', letterSpacing: '2px',
              marginBottom: '24px', color: '#ef4444', fontWeight: 600
            }}>
              BEST SELLERS
            </div>
            <h2 style={{
              fontSize: 'clamp(40px, 7vw, 64px)', fontWeight: 700,
              letterSpacing: '-0.02em', marginBottom: '16px',
              background: 'linear-gradient(135deg, #fff 0%, #999 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              Top 3 Most Loved
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              Our best-selling pieces, ranked by real customer purchases
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {top3.map((product, idx) => {
              const rank = RANK_STYLES[idx];
              return (
                <div
                  key={product.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${idx === 0 ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '24px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    boxShadow: idx === 0 ? `0 0 40px ${rank.shadow}` : 'none',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = `0 20px 60px ${rank.shadow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = idx === 0 ? `0 0 40px ${rank.shadow}` : 'none';
                  }}
                >
                  {/* Rank Badge */}
                  <div style={{
                    position: 'absolute', top: '16px', left: '16px', zIndex: 10,
                    background: rank.bg, color: '#fff',
                    width: '40px', height: '40px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 800,
                    boxShadow: `0 4px 15px ${rank.shadow}`
                  }}>
                    {rank.label}
                  </div>

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: '16px', left: '64px', zIndex: 10, display: 'flex', gap: '6px' }}>
                    {product.is_new && <span style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', padding: '5px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, letterSpacing: '1px' }}>NEW</span>}
                    {product.on_sale && <span style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', padding: '5px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, letterSpacing: '1px' }}>SALE</span>}
                  </div>

                  {/* Favorite */}
                  <button
                    onClick={(e) => handleToggleFavorite(product, e)}
                    style={{
                      position: 'absolute', top: '16px', right: '16px', zIndex: 10,
                      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      width: '40px', height: '40px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(127,29,29,0.9)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; }}
                  >
                    <svg width="18" height="18" fill={isFavorite(product.id) ? '#ef4444' : 'none'} stroke={isFavorite(product.id) ? '#ef4444' : '#fff'} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </button>

                  {/* Image */}
                  <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#1a1a1a' }}>
                    <img
                      src={product.image} alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="14" height="14" fill={i < (product.rating || 0) ? '#fbbf24' : '#374151'} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                      <span style={{ color: '#9ca3af', fontSize: '12px', marginLeft: '4px' }}>({product.reviews || 0})</span>
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '6px', color: '#fff' }}>{product.name}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '14px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '26px', fontWeight: 700, color: '#fff' }}>{formatPrice(product.price)}</div>
                        {product.original_price && <div style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'line-through' }}>{formatPrice(product.original_price)}</div>}
                      </div>
                      {product.sales > 0 && (
                        <div style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'right' }}>
                          <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '16px' }}>{product.sales}</span><br />sold
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => openModal(product)}
                      style={{
                        width: '100%', padding: '13px',
                        background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
                        color: '#fff', border: 'none', borderRadius: '10px',
                        fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                        transition: 'all 0.3s', letterSpacing: '1px', textTransform: 'uppercase'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal — same style as ProductsPage quick view */}
      {modalProduct && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(20px)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.07)',
              maxWidth: '960px', width: '100%', maxHeight: '90vh',
              overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr',
              borderRadius: '4px'
            }}
          >
            {/* Image side */}
            <div style={{ position: 'relative', overflow: 'hidden', background: '#111', minHeight: '500px' }}>
              <img
                src={modalProduct.image} alt={modalProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {modalProduct.is_new && <span style={{ background: '#fff', color: '#000', padding: '4px 10px', fontSize: '9px', fontWeight: 700, letterSpacing: '2px' }}>NEW</span>}
                {modalProduct.on_sale && <span style={{ background: '#7f1d1d', color: '#fff', padding: '4px 10px', fontSize: '9px', fontWeight: 700, letterSpacing: '2px' }}>SALE</span>}
              </div>
              <button
                onClick={(e) => handleToggleFavorite(modalProduct, e)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', padding: '10px', backdropFilter: 'blur(8px)', borderRadius: '2px' }}
              >
                <svg width="20" height="20" fill={isFavorite(modalProduct.id) ? '#ef4444' : 'none'} stroke={isFavorite(modalProduct.id) ? '#ef4444' : '#fff'} strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
            </div>

            {/* Info side */}
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 24px 0' }}>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '4px' }}>✕</button>
              </div>

              <div style={{ padding: '16px 32px 32px', flex: 1, color: '#fff' }}>
                <p style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '8px' }}>{modalProduct.category}</p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: '20px' }}>{modalProduct.name}</h2>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#fff' }}>{formatPrice(modalProduct.price)}</span>
                  {modalProduct.original_price && (
                    <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>{formatPrice(modalProduct.original_price)}</span>
                  )}
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" fill={i < (modalProduct.rating || 0) ? '#c9a84c' : 'rgba(255,255,255,0.1)'} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginLeft: '4px' }}>({modalProduct.reviews || 0} reviews)</span>
                </div>

                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '24px' }}>{modalProduct.description}</p>

                {/* Size */}
                {modalProduct.sizes?.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '12px' }}>
                      Size — <span style={{ color: selectedSize ? '#fff' : 'rgba(255,255,255,0.2)' }}>{selectedSize || 'Select'}</span>
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {modalProduct.sizes.map(size => (
                        <button key={size} onClick={() => setSelectedSize(size)} style={{
                          width: '48px', height: '48px',
                          background: selectedSize === size ? '#fff' : 'transparent',
                          color: selectedSize === size ? '#000' : 'rgba(255,255,255,0.5)',
                          border: `1px solid ${selectedSize === size ? '#fff' : 'rgba(255,255,255,0.15)'}`,
                          fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                        }}>{size}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color */}
                {modalProduct.colors?.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '12px' }}>
                      Color — <span style={{ color: selectedColor ? '#fff' : 'rgba(255,255,255,0.2)' }}>{selectedColor?.name || 'Select'}</span>
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {modalProduct.colors.map(color => (
                        <button key={color.name} onClick={() => setSelectedColor(color)} title={color.name} style={{
                          width: '32px', height: '32px', borderRadius: '50%', background: color.hex,
                          border: selectedColor?.name === color.name ? '2px solid #fff' : '2px solid transparent',
                          outline: selectedColor?.name === color.name ? '1px solid rgba(255,255,255,0.4)' : 'none',
                          outlineOffset: '2px', cursor: 'pointer', transition: 'all 0.2s'
                        }} />
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
// TO:
<button 
  onClick={() => setQuantity(Math.min(modalProduct.stock, quantity + 1))}
  disabled={!modalProduct.stock || quantity >= modalProduct.stock}
  style={{ background: 'none', border: 'none', color: '#fff', width: '40px', height: '40px', fontSize: '18px', cursor: modalProduct.stock === 0 || quantity >= modalProduct.stock ? 'not-allowed' : 'pointer', opacity: (!modalProduct.stock || quantity >= modalProduct.stock) ? 0.3 : 1 }}
>+</button>                  </div>
                  {modalProduct.stock > 0 && modalProduct.stock < 10 && (
                    <span style={{ fontSize: '12px', color: '#ef4444', letterSpacing: '1px' }}>Only {modalProduct.stock} left</span>
                  )}
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={modalProduct.stock === 0}
                  style={{
                    width: '100%', padding: '16px',
                    background: modalProduct.stock === 0 ? 'rgba(255,255,255,0.05)' : '#fff',
                    color: modalProduct.stock === 0 ? 'rgba(255,255,255,0.2)' : '#000',
                    border: 'none', fontSize: '11px', fontWeight: 700,
                    letterSpacing: '3px', textTransform: 'uppercase',
                    cursor: modalProduct.stock === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => { if (modalProduct.stock > 0) { e.currentTarget.style.background = '#7f1d1d'; e.currentTarget.style.color = '#fff'; }}}
                  onMouseLeave={(e) => { if (modalProduct.stock > 0) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}}
                >
                  {modalProduct.stock === 0 ? 'Sold Out' : `Add to Cart — ${formatPrice(modalProduct.price * quantity)}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}