import React, { useState, useRef, useEffect } from 'react';

export default function Header({ 
  user, 
  cart, 
  favorites, 
  isAdmin, 
  onLoginClick, 
  onFavoritesClick, 
  onCartClick, 
  onAdminClick,
  onProductsClick,
  onHomeClick,
  onProfileClick,  // Add this new prop
  logoUrl="public/images/logoStore.jpeg"
}) {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowAdminMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUserButtonClick = () => {
    if (isAdmin && user) {
      setShowAdminMenu(!showAdminMenu);
    } else {
      onLoginClick();
    }
  };

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      scrollToSection('home');
    }
  };

  const handleCollectionsClick = () => {
    if (onProductsClick) {
      onProductsClick();
    } else {
      scrollToSection('products');
    }
  };

  return (
    <header style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(89, 11, 11, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      borderBottom: '1px solid rgba(127, 29, 29, 0.3)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ 
        maxWidth: '1280px', 
        width: '100%',
        margin: '0 auto', 
        padding: '0 16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: '80px',
        boxSizing: 'border-box',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {/* Left Section - Logo + Help Text */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          fontSize: '14px',
          flexShrink: 1,
          minWidth: '0',
          alignItems: 'center'
        }}>
          {/* Logo (Top Left) */}
          {logoUrl ? (
            <div 
              onClick={handleHomeClick}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.3s ease',
                padding: '4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src={logoUrl} 
                alt="RARE STORE Logo" 
                style={{
                  height: '110px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'brightness(1.2)'
                }}
              />
            </div>
          ) : (
            <div 
              onClick={handleHomeClick}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 12px rgba(127, 29, 29, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(127, 29, 29, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(127, 29, 29, 0.4)';
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          )}
          
          <button 
            onClick={() => scrollToSection('contact')}
            style={{ 
              color: '#9ca3af', 
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '14px',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            Can we help you?
          </button>
        </div>
        
        {/* Center Section - Logo & Title */}
        <h1 
          onClick={handleHomeClick}
          style={{ 
            fontSize: 'clamp(20px, 4vw, 28px)', 
            letterSpacing: '0.3em', 
            fontWeight: 300,
            margin: 0,
            flexShrink: 0,
            cursor: 'pointer',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
        >
          RARE STORE
        </h1>
        
        {/* Right Section - Actions */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center',
          flexShrink: 1,
          minWidth: '0',
          position: 'relative'
        }}>
          {/* Profile Icon - Only show if user is logged in */}
          {user && (
            <button 
              onClick={onProfileClick}
              
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '14px', 
                cursor: 'pointer', 
                padding: '8px',
                whiteSpace: 'nowrap',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
              title="View Profile"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span>PROFILE</span>
            </button>
          )}
          
          {/* User Login Button */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button 
              onClick={handleUserButtonClick}
              style={{
                backgroundColor: '#991b1b',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '12px 32px',
                border: 'none',
                borderRadius: '999px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(153, 27, 27, 0.4)',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7f1d1d';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(153, 27, 27, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#991b1b';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(153, 27, 27, 0.4)';
              }}
            >
              {user ? (
                <>
                  <span>👤</span>
                  {user.name.toUpperCase()}
                  {isAdmin && <span style={{ fontSize: '10px' }}>▼</span>}
                </>
              ) : 'LOGIN'}
            </button>

            {/* Admin Dropdown Menu */}
            {isAdmin && user && showAdminMenu && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                minWidth: '200px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                zIndex: 10000,
                animation: 'slideDown 0.2s ease-out'
              }}>
                <button
                  onClick={() => {
                    onAdminClick();
                    setShowAdminMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'background 0.2s',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <span style={{ fontSize: '16px' }}>⚙️</span>
                  Admin Panel
                </button>
                <button
                  onClick={() => {
                    onLoginClick();
                    setShowAdminMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: 'none',
                    border: 'none',
                    color: '#fca5a5',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <span style={{ fontSize: '16px' }}>🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
          
          {/* Favorites Button */}
          <button onClick={onFavoritesClick} style={{ 
            background: 'none', 
            border: 'none', 
            color: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '14px', 
            cursor: 'pointer', 
            position: 'relative', 
            padding: '8px',
            whiteSpace: 'nowrap',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>FAVORITES</span>
            {favorites.length > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '-8px', 
                right: '-8px', 
                background: '#ef4444', 
                borderRadius: '50%', 
                minWidth: '20px', 
                height: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '12px',
                fontWeight: 600
              }}>
                {favorites.length}
              </span>
            )}
          </button>
          
          {/* Cart Button */}
          <button onClick={onCartClick} style={{ 
            background: 'none', 
            border: 'none', 
            color: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '14px', 
            cursor: 'pointer', 
            position: 'relative', 
            padding: '8px',
            whiteSpace: 'nowrap',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span>CART</span>
            {cart.length > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '-8px', 
                right: '-8px', 
                background: '#ef4444', 
                borderRadius: '50%', 
                minWidth: '20px', 
                height: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '12px',
                fontWeight: 600
              }}>
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '48px', 
        padding: '16px', 
        fontSize: '14px', 
        letterSpacing: '1.5px',
        width: '100%',
        boxSizing: 'border-box',
        flexWrap: 'wrap',
        borderTop: '1px solid rgba(127, 29, 29, 0.2)'
      }}>
        <button 
          onClick={handleHomeClick}
          style={{ 
            color: '#fff', 
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap', 
            transition: 'color 0.3s',
            fontSize: '14px',
            letterSpacing: '1.5px',
            fontWeight: 400
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
        >
          HOME
        </button>
        <button 
          onClick={handleCollectionsClick}
          style={{ 
            color: '#fff', 
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap', 
            transition: 'color 0.3s',
            fontSize: '14px',
            letterSpacing: '1.5px',
            fontWeight: 400
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
        >
          COLLECTIONS
        </button>
        <button 
          onClick={() => scrollToSection('about')}
          style={{ 
            color: '#fff', 
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap', 
            transition: 'color 0.3s',
            fontSize: '14px',
            letterSpacing: '1.5px',
            fontWeight: 400
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
        >
          ABOUT
        </button>
        <button 
          onClick={() => scrollToSection('contact')}
          style={{ 
            color: '#fff', 
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap', 
            transition: 'color 0.3s',
            fontSize: '14px',
            letterSpacing: '1.5px',
            fontWeight: 400
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
        >
          CONTACT
        </button>
      </nav>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}