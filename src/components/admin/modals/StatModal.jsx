import React from 'react';

const StatModal = ({ type, onClose, orders, products, customers }) => {
  const completedOrders = orders.filter(o => o.status === 'completed');
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const thisMonthRevenue = completedOrders.filter(o => new Date(o.date) >= thisMonthStart).reduce((s, o) => s + o.total, 0);
  const lastMonthRevenue = completedOrders.filter(o => new Date(o.date) >= lastMonthStart && new Date(o.date) < thisMonthStart).reduce((s, o) => s + o.total, 0);
  const revenueGrowth = lastMonthRevenue === 0 ? (thisMonthRevenue > 0 ? 100 : 0) : (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1);
  const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0);

  const thisMonthOrders = orders.filter(o => new Date(o.date) >= thisMonthStart).length;
  const lastMonthOrders = orders.filter(o => new Date(o.date) >= lastMonthStart && new Date(o.date) < thisMonthStart).length;
  const ordersGrowth = lastMonthOrders === 0 ? (thisMonthOrders > 0 ? 100 : 0) : (((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(1);

  const thisMonthCustomers = customers.filter(c => new Date(c.joinDate) >= thisMonthStart).length;
  const lastMonthCustomers = customers.filter(c => new Date(c.joinDate) >= lastMonthStart && new Date(c.joinDate) < thisMonthStart).length;
  const customersGrowth = lastMonthCustomers === 0 ? (thisMonthCustomers > 0 ? 100 : 0) : (((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100).toFixed(1);

  const lowStock = products.filter(p => p.stock < 10 && p.stock > 0);
  const outOfStock = products.filter(p => p.stock === 0);
  const activeProducts = products.filter(p => p.status === 'active');

  const byCategory = products.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + (p.sales || 0); return acc; }, {});
  const categoryEntries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxSales = Math.max(...categoryEntries.map(([, v]) => v), 1);
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  const recentCompleted = [...completedOrders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const configs = {
    revenue: {
      title: '💰 Revenue Breakdown',
      subtitle: 'Based on completed orders',
      stats: [
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: '#10b981', icon: '💰' },
        { label: 'This Month', value: `$${thisMonthRevenue.toFixed(2)}`, color: '#3b82f6', icon: '📅' },
        { label: 'vs Last Month', value: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth}%`, color: parseFloat(revenueGrowth) >= 0 ? '#10b981' : '#ef4444', icon: parseFloat(revenueGrowth) >= 0 ? '📈' : '📉' },
      ],
      content: (
        <>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Revenue by Category</h3>
          {categoryEntries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>No category data yet</div>
          ) : categoryEntries.map(([cat, sales], i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>{cat}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: colors[i % colors.length] }}>{sales} sales</span>
              </div>
              <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(sales / maxSales) * 100}%`, background: colors[i % colors.length], borderRadius: '4px' }} />
              </div>
            </div>
          ))}
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: '24px 0 16px' }}>Recent Completed Orders</h3>
          {recentCompleted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>No completed orders yet</div>
          ) : recentCompleted.map((order, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#7f1d1d' }}>#{order.id}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{order.customer} · {order.date}</div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>${order.total.toFixed(2)}</div>
            </div>
          ))}
        </>
      ),
    },

    orders: {
      title: '📦 Orders Breakdown',
      subtitle: 'All order activity',
      stats: [
        { label: 'Total Orders', value: orders.length, color: '#3b82f6', icon: '📦' },
        { label: 'This Month', value: thisMonthOrders, color: '#8b5cf6', icon: '📅' },
        { label: 'vs Last Month', value: `${ordersGrowth >= 0 ? '+' : ''}${ordersGrowth}%`, color: parseFloat(ordersGrowth) >= 0 ? '#10b981' : '#ef4444', icon: parseFloat(ordersGrowth) >= 0 ? '📈' : '📉' },
      ],
      content: (
        <>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>By Status</h3>
          {[
            { label: 'Processing', count: orders.filter(o => o.status === 'processing').length, color: '#f59e0b', icon: '⏳' },
            { label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length, color: '#3b82f6', icon: '🚚' },
            { label: 'Completed', count: orders.filter(o => o.status === 'completed').length, color: '#10b981', icon: '✅' },
            { label: 'Returned', count: orders.filter(o => o.status === 'returned').length, color: '#ef4444', icon: '↩️' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: `${s.color}10`, borderRadius: '12px', border: `1px solid ${s.color}20`, marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{s.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{s.label}</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.count}</span>
            </div>
          ))}
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: '24px 0 16px' }}>Recent Orders</h3>
          {[...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((order, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#7f1d1d' }}>#{order.id}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{order.customer} · {order.date}</div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: order.status === 'completed' ? '#d1fae5' : order.status === 'processing' ? '#fef3c7' : '#dbeafe', color: order.status === 'completed' ? '#065f46' : order.status === 'processing' ? '#92400e' : '#1e40af' }}>
                {order.status.toUpperCase()}
              </span>
            </div>
          ))}
        </>
      ),
    },

    customers: {
      title: '👥 Customers Breakdown',
      subtitle: 'Customer base overview',
      stats: [
        { label: 'Total Customers', value: customers.length, color: '#8b5cf6', icon: '👥' },
        { label: 'This Month', value: thisMonthCustomers, color: '#3b82f6', icon: '📅' },
        { label: 'vs Last Month', value: `${customersGrowth >= 0 ? '+' : ''}${customersGrowth}%`, color: parseFloat(customersGrowth) >= 0 ? '#10b981' : '#ef4444', icon: parseFloat(customersGrowth) >= 0 ? '📈' : '📉' },
      ],
      content: (
        <>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Customer Stats</h3>
          {[
            { label: 'Active Customers', value: customers.filter(c => !c.is_banned).length, color: '#10b981', icon: '✅' },
            { label: 'Banned Customers', value: customers.filter(c => c.is_banned).length, color: '#ef4444', icon: '🚫' },
            { label: 'New This Month', value: thisMonthCustomers, color: '#3b82f6', icon: '🆕' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: `${s.color}10`, borderRadius: '12px', border: `1px solid ${s.color}20`, marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{s.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{s.label}</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.value}</span>
            </div>
          ))}
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: '24px 0 16px' }}>Recent Customers</h3>
          {[...customers].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate)).slice(0, 5).map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{c.name}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{c.email} · Joined {c.joinDate}</div>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{c.orders} orders</span>
            </div>
          ))}
        </>
      ),
    },

    products: {
      title: '🏷️ Products Breakdown',
      subtitle: 'Inventory overview',
      stats: [
        { label: 'Total Products', value: products.length, color: '#f59e0b', icon: '🏷️' },
        { label: 'Active', value: activeProducts.length, color: '#10b981', icon: '✅' },
        { label: 'Out of Stock', value: outOfStock.length, color: '#ef4444', icon: '⚠️' },
      ],
      content: (
        <>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Inventory Health</h3>
          {[
            { label: 'Active Products', value: activeProducts.length, color: '#10b981', icon: '✅' },
            { label: 'Inactive Products', value: products.filter(p => p.status !== 'active').length, color: '#6b7280', icon: '⏸️' },
            { label: 'Low Stock (< 10)', value: lowStock.length, color: '#f59e0b', icon: '⚠️' },
            { label: 'Out of Stock', value: outOfStock.length, color: '#ef4444', icon: '❌' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: `${s.color}10`, borderRadius: '12px', border: `1px solid ${s.color}20`, marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{s.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{s.label}</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.value}</span>
            </div>
          ))}
          {lowStock.length > 0 && (
            <>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: '24px 0 16px' }}>⚠️ Low Stock Alert</h3>
              {lowStock.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{p.name}</div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>{p.stock} left</span>
                </div>
              ))}
            </>
          )}
        </>
      ),
    },
  };

  const config = configs[type];
  if (!config) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px', padding: '36px', maxWidth: '620px', width: '90%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{config.title}</h2>
            <p style={{ fontSize: '14px', color: '#64748b' }}>{config.subtitle}</p>
          </div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: '10px', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', color: '#6b7280' }}>✕</button>
        </div>

        {/* Top 3 stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '28px' }}>
          {config.stats.map((stat, i) => (
            <div key={i} style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{stat.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Dynamic content */}
        {config.content}
      </div>
    </div>
  );
};

export default StatModal;