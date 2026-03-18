import React from 'react';

const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`;

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
  overflow: 'hidden'
};

const hoverStyle = {
  transition: 'all 0.3s ease',
};

export default function FavoritesPopup({ favorites, onClose, onRemove }) {
  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '32px',
      width: '380px',
      maxHeight: '600px',
      ...cardStyle,
      boxShadow: '0 20px 60px rgba(127, 29, 29, 0.3)',
      zIndex: 9999
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 600,
          letterSpacing: '1px',
          background: 'linear-gradient(135deg, #fff 0%, #ef4444 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          FAVORITES ({favorites.length})
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '20px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.3)'}
          onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
        >
          ✕
        </button>
      </div>

      <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '16px' }}>
        {favorites.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '60px 20px', fontSize: '16px' }}>
            Your favorites list is empty
          </p>
        ) : (
          favorites.map(item => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '16px',
                borderRadius: '16px',
                marginBottom: '12px',
                background: 'rgba(255,255,255,0.02)',
                ...hoverStyle
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>
                  {item.name}
                </h4>
                <div style={{ fontSize: '18px', color: '#ef4444', fontWeight: 700 }}>
                  {formatPrice(item.price)}
                </div>
              </div>
              <button
                onClick={() => onRemove(item)}
                style={{
                  color: '#9ca3af',
                  background: 'none',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(239,68,68,0.2)';
                  e.target.style.color = '#ef4444';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#9ca3af';
                }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}