import React, { useState } from 'react';

const BASE = 'http://127.0.0.1:8000/api';
const authHeader = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
});

const statusStyle = (status) => {
  if (status === 'completed') return { background: '#d1fae5', color: '#065f46' };
  if (status === 'shipped') return { background: '#dbeafe', color: '#1e40af' };
  if (status === 'cancelled') return { background: '#fee2e2', color: '#991b1b' };
  return { background: '#fef3c7', color: '#92400e' };
};

const OrderDetailsModal = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${BASE}/admin/orders/${orderId}`, { headers: authHeader() });
        const data = await res.json();
        if (data.success) setOrder(data.order);
        else setError(data.message || 'Failed to load order');
      } catch {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '600px', maxWidth: '95%', maxHeight: '85vh', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading order details...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>{error}</div>
        ) : (
          <>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Order Details</h2>
                <div style={{ fontSize: '14px', color: '#7f1d1d', fontWeight: 700, fontFamily: 'monospace' }}>{order.order_id}</div>
              </div>
              <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            {/* Order Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Customer', value: order.customer?.name || '—' },
                { label: 'Email', value: order.customer?.email || '—' },
                { label: 'Date', value: new Date(order.created_at).toLocaleDateString() },
                { label: 'Status', value: order.status?.toUpperCase() },
              ].map((item, i) => (
                <div key={i} style={{ background: '#f9fafb', padding: '14px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '4px' }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Items */}
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Items Ordered</h3>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: i < order.items.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <img src={item.product?.image || 'https://via.placeholder.com/48'} alt={item.product?.name}
                    style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                    onError={e => { e.target.src = 'https://via.placeholder.com/48'; }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{item.product?.name || 'Unknown Product'}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                      {item.size && `Size: ${item.size}`}{item.size && item.color && ' · '}{item.color && `Color: ${item.color}`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>${parseFloat(item.price).toFixed(2)}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
              {[
                { label: 'Subtotal', value: `$${parseFloat(order.subtotal || 0).toFixed(2)}` },
                { label: 'Shipping', value: `$${parseFloat(order.shipping || 0).toFixed(2)}` },
                { label: 'Tax', value: `$${parseFloat(order.tax || 0).toFixed(2)}` },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                  <span>{row.label}</span><span>{row.value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                <span>Total</span>
                <span style={{ color: '#10b981' }}>${parseFloat(order.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const OrdersTab = ({ orders, isInitialLoading, onUpdateOrderStatus }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const getDateThreshold = () => {
    if (dateFilter === 'today') { const d = new Date(); d.setHours(0,0,0,0); return d; }
    if (dateFilter === '7days') return new Date(Date.now() - 7 * 86400000);
    if (dateFilter === '30days') return new Date(Date.now() - 30 * 86400000);
    return null;
  };

  const filtered = orders.filter(o => {
    const matchesSearch =
      o.id?.toString().toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const threshold = getDateThreshold();
    const matchesDate = !threshold || new Date(o.date) >= threshold;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalRevenue = filtered
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const statusCounts = {
    all: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1e293b' }}>Orders ({orders.length})</h1>
      </div>

      {/* Revenue Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Filtered Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: '💰', color: '#10b981' },
          { label: 'Processing', value: statusCounts.processing, icon: '⏳', color: '#f59e0b' },
          { label: 'Shipped', value: statusCounts.shipped, icon: '🚚', color: '#3b82f6' },
          { label: 'Completed', value: statusCounts.completed, icon: '✅', color: '#10b981' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af' }}>{stat.label.toUpperCase()}</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'processing', label: '⏳ Processing' },
          { key: 'shipped', label: '🚚 Shipped' },
          { key: 'completed', label: '✅ Completed' },
          { key: 'cancelled', label: '❌ Cancelled' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setStatusFilter(key)} style={{
            padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', border: '2px solid',
            borderColor: statusFilter === key ? '#991b1b' : '#e5e7eb',
            background: statusFilter === key ? '#fef2f2' : 'white',
            color: statusFilter === key ? '#991b1b' : '#6b7280',
            transition: 'all 0.2s'
          }}>
            {label} ({statusCounts[key] || 0})
          </button>
        ))}
      </div>

      {/* Search & Date Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search by order ID or customer name..."
          style={{ flex: 1, padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#1e293b' }} />
        <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{
          padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px',
          fontSize: '14px', color: '#1e293b', background: 'white', cursor: 'pointer', outline: 'none'
        }}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {isInitialLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>No orders found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                {['ORDER ID', 'CUSTOMER', 'DATE', 'ITEMS', 'TOTAL', 'STATUS', ''].map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <tr key={i}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ borderBottom: '1px solid #f3f4f6', background: hoveredRow === i ? '#f9fafb' : 'white', transition: 'background 0.15s' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 700, color: '#7f1d1d', fontFamily: 'monospace' }}>{order.id}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{order.customer}</div>
                    {order.email && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{order.email}</div>}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>{order.date}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ background: '#f3f4f6', padding: '2px 10px', borderRadius: '12px', fontWeight: 600, fontSize: '14px' }}>{order.items}</span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '15px', fontWeight: 700, color: '#10b981' }}>${order.total.toFixed(2)}</td>
                  <td style={{ padding: '16px' }}>
                    <select value={order.status} onChange={e => onUpdateOrderStatus(order.id, e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', outline: 'none', ...statusStyle(order.status) }}>
                      <option value="processing">PROCESSING</option>
                      <option value="shipped">SHIPPED</option>
                      <option value="completed">COMPLETED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button onClick={() => setSelectedOrderId(order.dbId || order.id)}
                      style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
                      👁 View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 0 && (
        <div style={{ marginTop: '12px', fontSize: '13px', color: '#9ca3af', textAlign: 'right' }}>
          Showing {filtered.length} of {orders.length} orders
        </div>
      )}

      {selectedOrderId && (
        <OrderDetailsModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
      )}
    </div>
  );
};

export default OrdersTab;