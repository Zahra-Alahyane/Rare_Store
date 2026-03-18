import React from 'react';

const Sidebar = ({ currentTab, setCurrentTab, onBackToStore, onLogout }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '🏷️' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'coupons', label: 'Coupons', icon: '🏷️' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'returns', label: 'Returns', icon: '↩️' },
    { id: 'reports', label: 'Rapports', icon: '📄' },
  ];

  return (
    <div style={{
      width: '280px',
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      padding: '32px 0',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      boxShadow: '4px 0 30px rgba(0,0,0,0.2)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      overflowY:'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 24px', marginBottom: '48px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '12px',
          boxShadow: '0 8px 20px rgba(127,29,29,0.3)'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '0.15em', color: 'white', marginBottom: '4px' }}>
            RARE
          </h1>
          <p style={{ fontSize: '11px', color: '#fca5a5', letterSpacing: '2px', fontWeight: 600 }}>ADMIN PORTAL</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            style={{
              width: '100%',
              padding: '16px 20px',
              marginBottom: '8px',
              background: currentTab === tab.id
                ? 'linear-gradient(135deg, rgba(127,29,29,0.2) 0%, rgba(153,27,27,0.3) 100%)'
                : 'transparent',
              border: 'none',
              borderRadius: '12px',
              color: currentTab === tab.id ? '#fff' : '#94a3b8',
              fontSize: '15px',
              fontWeight: currentTab === tab.id ? 600 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (currentTab !== tab.id) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (currentTab !== tab.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }
            }}
          >
            {currentTab === tab.id && (
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                background: 'linear-gradient(180deg, #7f1d1d 0%, #991b1b 100%)',
                borderRadius: '0 4px 4px 0'
              }} />
            )}
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
      

      {/* Footer Buttons */}
      <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={onBackToStore} style={{
          width: '100%', padding: '14px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(37,99,235,0.3) 100%)',
          border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd', borderRadius: '12px',
          fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s',
          marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
          🏠 Back to Store
        </button>
        <button onClick={onLogout} style={{
          width: '100%', padding: '14px',
          background: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(220,38,38,0.3) 100%)',
          border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: '12px',
          fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;