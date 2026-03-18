import React, { useState } from 'react';

const BASE = 'http://127.0.0.1:8000/api';
const authHeader = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
});

const REPORTS = [
  {
    id: 'order_summary',
    icon: '📦',
    title: 'Order Summary',
    description: 'Full details of a single order: customer, items, amounts, and key dates.',
    color: '#6366f1',
    bg: '#eef2ff',
    requiresOrderId: true,
  },
  {
    id: 'users_list',
    icon: '👥',
    title: 'Customers List',
    description: 'All registered customer accounts with name, email, join date, and order count.',
    color: '#0ea5e9',
    bg: '#e0f2fe',
  },
  {
    id: 'sales_report',
    icon: '📊',
    title: 'Sales Report',
    description: 'Overview of orders in a date range: ID, customer, amount, status, and date.',
    color: '#10b981',
    bg: '#d1fae5',
    requiresDates: true,
  },
  {
    id: 'stock_status',
    icon: '🗂️',
    title: 'Stock Status',
    description: 'All products with stock levels, category, price, and sales count.',
    color: '#f59e0b',
    bg: '#fef3c7',
  },
  {
    id: 'revenue_report',
    icon: '💰',
    title: 'Revenue Report',
    description: 'Revenue breakdown by category and product, with totals and averages.',
    color: '#8b5cf6',
    bg: '#ede9fe',
    requiresDates: true,
  },
  {
    id: 'returns_report',
    icon: '↩️',
    title: 'Returns Report',
    description: 'All return requests with reasons, refund amounts, and statuses.',
    color: '#ef4444',
    bg: '#fee2e2',
  },
];

const buildHTML = ({ reportId, orders, products, customers, returns = [], orderId, dateFrom, dateTo }) => {
  const now = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
  const styles = `
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; padding: 40px; font-size: 13px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th { background: #f3f4f6; padding: 10px 12px; text-align: left; font-size: 12px; color: #374151; border-bottom: 2px solid #e5e7eb; }
      td { padding: 9px 12px; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
      .badge { display:inline-block; padding: 2px 8px; border-radius:99px; font-size:11px; font-weight:600; }
      .badge-green { background:#dcfce7; color:#15803d; }
      .badge-yellow { background:#fef9c3; color:#854d0e; }
      .badge-red { background:#fee2e2; color:#b91c1c; }
      .badge-blue { background:#dbeafe; color:#1d4ed8; }
      .badge-purple { background:#ede9fe; color:#6d28d9; }
      .header-bar { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; border-bottom:2px solid #e5e7eb; padding-bottom:20px; }
      .logo { font-size:20px; font-weight:800; color:#7f1d1d; }
      .section { margin-bottom: 28px; }
      .section-title { font-size:14px; font-weight:700; color:#374151; margin-bottom:10px; border-left:4px solid #7f1d1d; padding-left:10px; }
      .kv { display:flex; gap:8px; margin-bottom:6px; }
      .kv-key { color:#6b7280; min-width:160px; }
      .kv-val { font-weight:600; }
      .stat-box { background:#f3f4f6; border-radius:10px; padding:16px 24px; display:inline-block; min-width:150px; margin-right:16px; margin-bottom:16px; }
      .stat-label { font-size:11px; color:#6b7280; margin-bottom:4px; }
      .stat-value { font-size:24px; font-weight:800; }
      .total-row td { font-weight:700; background:#f9fafb; }
      @media print { body { padding: 20px; } }
    </style>`;

  const header = (subtitle) => `
    <div class="header-bar">
      <div><div class="logo">🛍️ RARE STORE</div><div style="color:#6b7280;font-size:12px;">${subtitle}</div></div>
      <div style="text-align:right;font-size:12px;color:#6b7280;">Generated on ${now}</div>
    </div>`;

  if (reportId === 'order_summary') {
    const order = orders.find(o => o.id === orderId || o.order_id === orderId);
    if (!order) return null;
    const items = Array.isArray(order.items) ? order.items : [];
    return `${styles}${header('Order Summary')}
      <div class="section"><div class="section-title">Customer Info</div>
        <div class="kv"><span class="kv-key">Name:</span><span class="kv-val">${order.customer || '—'}</span></div>
        <div class="kv"><span class="kv-key">Email:</span><span class="kv-val">${order.email || '—'}</span></div>
      </div>
      <div class="section"><div class="section-title">Order #${order.id}</div>
        <div class="kv"><span class="kv-key">Date:</span><span class="kv-val">${order.date || '—'}</span></div>
        <div class="kv"><span class="kv-key">Status:</span><span class="kv-val">${order.status || '—'}</span></div>
        <div class="kv"><span class="kv-key">Items:</span><span class="kv-val">${typeof order.items === 'number' ? order.items : items.length}</span></div>
      </div>
      <div class="section"><div class="section-title">Items Ordered</div>
        <table><thead><tr><th>Product</th><th>Size</th><th>Color</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
        <tbody>${items.length > 0
          ? items.map(i => `<tr>
              <td>${i.name || i.product?.name || '—'}</td>
              <td>${i.size || '—'}</td><td>${i.color || '—'}</td>
              <td>${i.quantity || 1}</td>
              <td>$${parseFloat(i.price || 0).toFixed(2)}</td>
              <td>$${(parseFloat(i.price || 0) * (i.quantity || 1)).toFixed(2)}</td>
            </tr>`).join('')
          : `<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:20px">${typeof order.items === 'number' && order.items > 0 ? `${order.items} item(s) — details not available` : 'No items'}</td></tr>`
        }</tbody></table>
      </div>
      <div class="section"><div class="section-title">Amounts</div>
        <table style="max-width:360px;margin-left:auto;"><tbody>
          <tr><td>Subtotal</td><td style="text-align:right">$${parseFloat(order.subtotal || 0).toFixed(2)}</td></tr>
          <tr><td>Shipping</td><td style="text-align:right">$${parseFloat(order.shipping || 0).toFixed(2)}</td></tr>
          <tr><td>Tax</td><td style="text-align:right">$${parseFloat(order.tax || 0).toFixed(2)}</td></tr>
          <tr class="total-row"><td style="padding:10px 12px">TOTAL</td><td style="text-align:right;padding:10px 12px">$${parseFloat(order.total || 0).toFixed(2)}</td></tr>
        </tbody></table>
      </div>`;
  }

  if (reportId === 'users_list') {
    return `${styles}${header(`Customers List — ${customers.length} accounts`)}
      <table><thead><tr><th>#</th><th>Name</th><th>Email</th><th>Join Date</th><th>Orders</th><th>Total Spent</th><th>Status</th></tr></thead>
      <tbody>${customers.length > 0
        ? customers.map((c, i) => `<tr>
            <td>${i + 1}</td><td>${c.name || '—'}</td><td>${c.email || '—'}</td>
            <td>${c.joinDate || '—'}</td>
            <td>${c.orders || 0}</td>
            <td>$${parseFloat(c.total_spent || 0).toFixed(2)}</td>
            <td><span class="badge ${c.is_banned ? 'badge-red' : 'badge-green'}">${c.is_banned ? 'BANNED' : 'ACTIVE'}</span></td>
          </tr>`).join('')
        : '<tr><td colspan="7" style="text-align:center;color:#9ca3af;padding:20px">No customers</td></tr>'
      }</tbody></table>`;
  }

  if (reportId === 'sales_report') {
    const filtered = orders.filter(o => {
      const d = new Date(o.date || o.created_at);
      return d >= new Date(dateFrom) && d <= new Date(dateTo + 'T23:59:59');
    });
    const totalRevenue = filtered.reduce((s, o) => s + parseFloat(o.total || 0), 0);
    const completed = filtered.filter(o => o.status === 'completed').length;
    return `${styles}${header(`Sales Report — ${new Date(dateFrom).toLocaleDateString('en-US')} to ${new Date(dateTo).toLocaleDateString('en-US')}`)}
      <div style="margin-bottom:28px;">
        <div class="stat-box"><div class="stat-label">ORDERS</div><div class="stat-value">${filtered.length}</div></div>
        <div class="stat-box"><div class="stat-label">REVENUE</div><div class="stat-value">$${totalRevenue.toFixed(2)}</div></div>
        <div class="stat-box"><div class="stat-label">AVG ORDER</div><div class="stat-value">$${filtered.length ? (totalRevenue / filtered.length).toFixed(2) : '0.00'}</div></div>
        <div class="stat-box"><div class="stat-label">COMPLETED</div><div class="stat-value">${completed}</div></div>
      </div>
      <table><thead><tr><th>Order ID</th><th>Customer</th><th>Email</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>${filtered.length > 0
        ? filtered.map(o => `<tr>
            <td style="font-weight:600;font-family:monospace">${o.id}</td>
            <td>${o.customer || '—'}</td><td>${o.email || '—'}</td>
            <td style="font-weight:600">$${parseFloat(o.total || 0).toFixed(2)}</td>
            <td><span class="badge ${o.status === 'completed' ? 'badge-green' : o.status === 'cancelled' ? 'badge-red' : o.status === 'shipped' ? 'badge-blue' : 'badge-yellow'}">${o.status || '—'}</span></td>
            <td>${o.date ? new Date(o.date).toLocaleDateString('en-US') : '—'}</td>
          </tr>`).join('')
        : '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:20px">No orders in this period</td></tr>'
      }</tbody></table>`;
  }

  if (reportId === 'stock_status') {
    const outOfStock = products.filter(p => (p.stock || 0) === 0).length;
    const lowStock = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).length;
    return `${styles}${header(`Stock Status — ${products.length} products`)}
      <div style="margin-bottom:28px;">
        <div class="stat-box"><div class="stat-label">TOTAL PRODUCTS</div><div class="stat-value">${products.length}</div></div>
        <div class="stat-box"><div class="stat-label">OUT OF STOCK</div><div class="stat-value" style="color:#b91c1c">${outOfStock}</div></div>
        <div class="stat-box"><div class="stat-label">LOW STOCK</div><div class="stat-value" style="color:#d97706">${lowStock}</div></div>
      </div>
      <table><thead><tr><th>#</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Sales</th><th>Status</th></tr></thead>
      <tbody>${products.length > 0
        ? products.map((p, i) => `<tr>
            <td>${i + 1}</td><td>${p.name || '—'}</td><td>${p.category || '—'}</td>
            <td style="font-weight:600">$${parseFloat(p.price || 0).toFixed(2)}</td>
            <td style="font-weight:700;color:${(p.stock || 0) === 0 ? '#b91c1c' : (p.stock || 0) < 10 ? '#d97706' : '#15803d'}">${p.stock || 0}</td>
            <td>${p.sales || 0}</td>
            <td><span class="badge ${(p.stock || 0) === 0 ? 'badge-red' : (p.stock || 0) < 10 ? 'badge-yellow' : 'badge-green'}">${(p.stock || 0) === 0 ? 'OUT OF STOCK' : (p.stock || 0) < 10 ? 'LOW' : 'IN STOCK'}</span></td>
          </tr>`).join('')
        : '<tr><td colspan="7" style="text-align:center;color:#9ca3af;padding:20px">No products</td></tr>'
      }</tbody></table>`;
  }

  if (reportId === 'revenue_report') {
    const filtered = orders.filter(o => {
      const d = new Date(o.date || o.created_at);
      return d >= new Date(dateFrom) && d <= new Date(dateTo + 'T23:59:59') && o.status === 'completed';
    });
    const totalRevenue = filtered.reduce((s, o) => s + parseFloat(o.total || 0), 0);
    const byCategory = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + (p.sales || 0) * parseFloat(p.price || 0);
      return acc;
    }, {});
    return `${styles}${header(`Revenue Report — ${new Date(dateFrom).toLocaleDateString('en-US')} to ${new Date(dateTo).toLocaleDateString('en-US')}`)}
      <div style="margin-bottom:28px;">
        <div class="stat-box"><div class="stat-label">TOTAL REVENUE</div><div class="stat-value">$${totalRevenue.toFixed(2)}</div></div>
        <div class="stat-box"><div class="stat-label">COMPLETED ORDERS</div><div class="stat-value">${filtered.length}</div></div>
        <div class="stat-box"><div class="stat-label">AVG ORDER VALUE</div><div class="stat-value">$${filtered.length ? (totalRevenue / filtered.length).toFixed(2) : '0.00'}</div></div>
      </div>
      <div class="section"><div class="section-title">Revenue by Category</div>
        <table><thead><tr><th>Category</th><th>Est. Revenue</th></tr></thead>
        <tbody>${Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, rev]) => `
          <tr><td style="text-transform:capitalize">${cat}</td><td style="font-weight:700">$${rev.toFixed(2)}</td></tr>`).join('')}
        </tbody></table>
      </div>`;
  }

  if (reportId === 'returns_report') {
    const totalRefunded = returns.filter(r => r.status === 'refunded').reduce((s, r) => s + parseFloat(r.refund_amount || 0), 0);
    return `${styles}${header(`Returns Report — ${returns.length} requests`)}
      <div style="margin-bottom:28px;">
        <div class="stat-box"><div class="stat-label">TOTAL RETURNS</div><div class="stat-value">${returns.length}</div></div>
        <div class="stat-box"><div class="stat-label">PENDING</div><div class="stat-value" style="color:#d97706">${returns.filter(r => r.status === 'pending').length}</div></div>
        <div class="stat-box"><div class="stat-label">REFUNDED</div><div class="stat-value" style="color:#15803d">$${totalRefunded.toFixed(2)}</div></div>
      </div>
      <table><thead><tr><th>Order ID</th><th>Customer</th><th>Reason</th><th>Refund</th><th>Status</th></tr></thead>
      <tbody>${returns.length > 0
        ? returns.map(r => `<tr>
            <td style="font-weight:700;font-family:monospace">#${r.order?.order_id || r.order_id || '—'}</td>
            <td>${r.order?.customer?.name || '—'}</td>
            <td style="max-width:200px">${r.reason || '—'}</td>
            <td>${r.refund_amount > 0 ? `$${parseFloat(r.refund_amount).toFixed(2)}` : '—'}</td>
            <td><span class="badge ${r.status === 'refunded' ? 'badge-green' : r.status === 'rejected' ? 'badge-red' : r.status === 'approved' ? 'badge-blue' : 'badge-yellow'}">${(r.status || 'pending').toUpperCase()}</span></td>
          </tr>`).join('')
        : '<tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:20px">No returns</td></tr>'
      }</tbody></table>`;
  }

  return null;
};

const PreviewModal = ({ html, title, onClose, onDownload }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
    onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', width: '800px', maxWidth: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Modal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>📄 Preview — {title}</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onDownload} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #7f1d1d, #991b1b)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
            ⬇️ Download PDF
          </button>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
        </div>
      </div>
      {/* Preview iframe */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px', background: '#f8fafc' }}>
        <div style={{ background: 'white', borderRadius: '8px', padding: '32px', minHeight: '500px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  </div>
);

const ReportsTab = ({ orders = [], products = [], customers = [], returns = [], showNotification }) => {
  const [orderId, setOrderId] = useState('');
  const [dateFrom, setDateFrom] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10); });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [preview, setPreview] = useState(null); // { html, reportId, title }
  const [history, setHistory] = useState([]);

  const getPreviewHTML = (reportId) => buildHTML({ reportId, orders, products, customers, returns, orderId, dateFrom, dateTo });

  const handlePreview = (report) => {
    if (report.requiresOrderId && !orderId.trim()) {
      showNotification('Please enter an Order ID first', 'error'); return;
    }
    if (report.requiresOrderId && !orders.find(o => o.id === orderId || o.order_id === orderId)) {
      showNotification(`Order "${orderId}" not found`, 'error'); return;
    }
    const html = getPreviewHTML(report.id);
    if (!html) { showNotification('Could not generate preview', 'error'); return; }
    setPreview({ html, reportId: report.id, title: report.title });
  };

  const downloadPDF = (reportId, title) => {
    const html = getPreviewHTML(reportId);
    if (!html) { showNotification('Could not generate report', 'error'); return; }
    const win = window.open('', '_blank');
    if (!win) { showNotification('Popup blocked — please allow popups', 'error'); return; }
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title} — RARE STORE</title></head><body>${html}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 600);
    // Add to history
    setHistory(prev => [{ title, reportId, time: new Date().toLocaleTimeString(), date: new Date().toLocaleDateString() }, ...prev.slice(0, 9)]);
    showNotification(`${title} opened — use "Save as PDF" in the print dialog`);
    setPreview(null);
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 }}>Reports & Exports</h1>
        <p style={{ color: '#6b7280', marginTop: 4, fontSize: 14 }}>Preview and download PDF reports for your store data.</p>
      </div>

      {/* Settings Card */}
      <div style={{ background: 'white', borderRadius: 16, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 28 }}>
        <p style={{ fontWeight: 700, marginBottom: 16, color: '#374151', fontSize: 14 }}>⚙️ Report Parameters</p>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Order ID (for Order Summary)</label>
            <input value={orderId} onChange={e => setOrderId(e.target.value.toUpperCase())}
              placeholder="e.g. ORDMIYQNZBV"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, width: 220 }} />
            {orderId && (
              <div style={{ fontSize: 11, marginTop: 4, color: orders.find(o => o.id === orderId) ? '#15803d' : '#b91c1c' }}>
                {orders.find(o => o.id === orderId) ? '✓ Order found' : '✗ Order not found'}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Date Range — From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14 }} />
          </div>
        </div>

        {/* Order suggestions */}
        {orderId && orders.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Matching orders:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {orders.filter(o => o.id?.includes(orderId)).slice(0, 5).map(o => (
                <button key={o.id} onClick={() => setOrderId(o.id)}
                  style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                  {o.id} — {o.customer}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Report Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 32 }}>
        {REPORTS.map(r => {
          const infoText = {
            order_summary: orderId ? (orders.find(o => o.id === orderId) ? `✓ Order ${orderId} — ${orders.find(o => o.id === orderId).customer}` : `✗ "${orderId}" not found`) : 'Enter an Order ID above',
            users_list: `${customers.length} registered customers`,
            sales_report: `${orders.filter(o => { const d = new Date(o.date); return d >= new Date(dateFrom) && d <= new Date(dateTo + 'T23:59:59'); }).length} orders in period`,
            stock_status: `${products.length} products — ${products.filter(p => (p.stock || 0) === 0).length} out of stock`,
            revenue_report: `${orders.filter(o => o.status === 'completed').length} completed orders`,
            returns_report: `${returns.length} return requests`,
          };

          return (
            <div key={r.id} style={{
              background: '#fff', borderRadius: 16, padding: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,.08)', borderTop: `4px solid ${r.color}`,
              display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 32, lineHeight: 1 }}>{r.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4, lineHeight: 1.5 }}>{r.description}</div>
                </div>
              </div>

              <div style={{ background: r.bg, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: r.color, fontWeight: 600 }}>
                {infoText[r.id]}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handlePreview(r)}
                  style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: `1.5px solid ${r.color}`, background: 'white', color: r.color, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  👁 Preview
                </button>
                <button onClick={() => downloadPDF(r.id, r.title)}
                  style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', background: r.color, color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                  ⬇️ Download
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Download History */}
      {history.length > 0 && (
        <div style={{ background: 'white', borderRadius: 16, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontWeight: 700, color: '#374151', fontSize: 14 }}>🕐 Download History</p>
            <button onClick={() => setHistory([])} style={{ background: 'none', border: 'none', fontSize: 12, color: '#9ca3af', cursor: 'pointer' }}>Clear</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((h, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f9fafb', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{REPORTS.find(r => r.id === h.reportId)?.icon || '📄'}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{h.title}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{h.date}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{h.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {preview && (
        <PreviewModal
          html={preview.html}
          title={preview.title}
          onClose={() => setPreview(null)}
          onDownload={() => downloadPDF(preview.reportId, preview.title)}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ReportsTab;