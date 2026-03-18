import React, { useState } from 'react';
import StatModal from '../modals/StatModal';

const DashboardTab = ({
  isInitialLoading,
  dashboardStats,
  recentOrders,
  orders,
  products,
  customers,
  revenueGrowth,
  onAddProduct,
}) => {
  const [statModal, setStatModal] = useState(null); // 'revenue' | 'orders' | 'customers' | 'products'

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${dashboardStats.revenue.toLocaleString()}`,
      change: revenueGrowth,
      icon: '💰',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.05) 100%)',
      clickable: 'revenue',
    },
    {
      label: 'Total Orders',
      value: dashboardStats.orders.toLocaleString(),
      change: `${orders.filter(o => o.status === 'processing').length} pending`,
      icon: '📦',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.05) 100%)',
      clickable: 'orders',
    },
    {
      label: 'Customers',
      value: dashboardStats.customers.toLocaleString(),
      change: `${customers.length} active`,
      icon: '👥',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(124,58,237,0.05) 100%)',
      clickable: 'customers',
    },
    {
      label: 'Products',
      value: dashboardStats.products,
      change: `${products.filter(p => p.stock < 10).length} low stock`,
      icon: '🏷️',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(217,119,6,0.05) 100%)',
      clickable: 'products',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Welcome back! 👋</h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Here's what's happening with your store today</p>
        </div>
        <button onClick={onAddProduct} style={{
          background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
          color: 'white', border: 'none', padding: '14px 28px', borderRadius: '12px',
          fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(127,29,29,0.3)',
          transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(127,29,29,0.4)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(127,29,29,0.3)'; }}>
          <span style={{ fontSize: '20px' }}>+</span> Add Product
        </button>
      </div>

      {isInitialLoading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <div style={{ width: '60px', height: '60px', border: '4px solid #f3f4f6', borderTopColor: '#7f1d1d', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {stats.map((stat, i) => (
              <div key={i}
                onClick={stat.clickable ? () => setStatModal(stat.clickable) : undefined}
                style={{
                  background: stat.bgGradient, padding: '28px', borderRadius: '20px',
                  border: stat.clickable ? '2px solid rgba(16,185,129,0.3)' : '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative', overflow: 'hidden',
                  cursor: stat.clickable ? 'pointer' : 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}>
                {/* Clickable hint */}
                {stat.clickable && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '11px', fontWeight: 700, color: '#64748b', background: 'rgba(255,255,255,0.8)', padding: '3px 8px', borderRadius: '6px', backdropFilter: 'blur(4px)' }}>
                    TAP FOR DETAILS
                  </div>
                )}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '120px', opacity: '0.1', transform: 'rotate(-15deg)' }}>{stat.icon}</div>
                <div style={{ width: '56px', height: '56px', background: stat.gradient, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '20px', boxShadow: '0 8px 16px rgba(0,0,0,0.12)' }}>
                  {stat.icon}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.5px' }}>{stat.label.toUpperCase()}</div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#1e293b', marginBottom: '12px', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, padding: '6px 12px', background: 'white', borderRadius: '8px', display: 'inline-block', color: '#64748b' }}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* Charts & Activity */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '40px' }}>
            {/* Sales by Category */}
            <div style={{ background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Sales by Category</h3>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>Product performance breakdown</p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                  Last 30 days
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {products.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>No sales data yet</div>
                    <div style={{ fontSize: '14px', marginTop: '8px' }}>Add products to see analytics</div>
                  </div>
                ) : (
                  Object.entries(
                    products.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + (p.sales || 0); return acc; }, {})
                  ).map(([category, sales], i) => {
                    const total = products.reduce((sum, p) => sum + (p.sales || 0), 0);
                    const percentage = total > 0 ? ((sales / total) * 100).toFixed(1) : 0;
                    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
                    const color = colors[i % colors.length];
                    return (
                      <div key={i} style={{ padding: '20px', background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)', borderRadius: '16px', border: '1px solid #f3f4f6', transition: 'all 0.3s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(8px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color, boxShadow: `0 0 0 4px ${color}20` }}></div>
                            <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>{category}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>{sales} sales</span>
                            <span style={{ fontSize: '16px', fontWeight: 700, color, minWidth: '50px', textAlign: 'right' }}>{percentage}%</span>
                          </div>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`, borderRadius: '4px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 0 8px ${color}40` }}></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Order Status */}
            <div style={{ background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>Order Status</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Real-time overview</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { name: 'Processing', count: orders.filter(o => o.status === 'processing').length, color: '#f59e0b', icon: '⏳' },
                  { name: 'Shipped', count: orders.filter(o => o.status === 'shipped').length, color: '#3b82f6', icon: '🚚' },
                  { name: 'Completed', count: orders.filter(o => o.status === 'completed').length, color: '#10b981', icon: '✅' },
                  { name: 'Total', count: orders.length, color: '#8b5cf6', icon: '📊' },
                ].map((status, i) => (
                  <div key={i} style={{ padding: '18px', background: `${status.color}10`, borderRadius: '14px', border: `2px solid ${status.color}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = status.color; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = `${status.color}20`; }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>{status.icon}</span>
                      <span style={{ color: '#1e293b', fontWeight: 600, fontSize: '15px' }}>{status.name}</span>
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: status.color }}>{status.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div style={{ background: 'white', padding: '32px', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px', color: '#1e293b' }}>Recent Orders</h3>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Latest customer purchases</p>
            </div>
            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>No orders yet</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>Orders will appear here when customers make purchases</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      {['ORDER ID', 'CUSTOMER', 'DATE', 'TOTAL', 'STATUS'].map((h, i) => (
                        <th key={i} style={{ textAlign: i === 3 ? 'right' : i === 4 ? 'center' : 'left', padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.slice(0, 5).map((order, i) => (
                      <tr key={i} style={{ background: 'white', transition: 'all 0.3s', cursor: 'pointer' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.transform = 'scale(1.01)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: 700, color: '#7f1d1d' }}>#{order.id}</td>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>{order.customer}</td>
                        <td style={{ padding: '16px', fontSize: '13px', color: '#64748b' }}>{order.date}</td>
                        <td style={{ padding: '16px', fontSize: '16px', fontWeight: 700, color: '#10b981', textAlign: 'right' }}>${order.total.toFixed(2)}</td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
                            background: order.status === 'completed' ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' : order.status === 'processing' ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                            color: order.status === 'completed' ? '#065f46' : order.status === 'processing' ? '#92400e' : '#1e40af',
                            display: 'inline-block', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Stat Modal */}
      {statModal && (
        <StatModal
          type={statModal}
          onClose={() => setStatModal(null)}
          orders={orders}
          products={products}
          customers={customers}
        />
      )}
    </div>
  );
};

export default DashboardTab;