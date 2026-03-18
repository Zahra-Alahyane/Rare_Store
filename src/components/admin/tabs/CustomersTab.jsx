import React, { useState } from 'react';

const statusStyle = (status) => {
  if (status === 'completed') return { background: '#d1fae5', color: '#065f46' };
  if (status === 'shipped') return { background: '#dbeafe', color: '#1e40af' };
  if (status === 'cancelled') return { background: '#fee2e2', color: '#991b1b' };
  return { background: '#fef3c7', color: '#92400e' };
};

const CustomerModal = ({ customer, onClose, onSaveNotes, onToggleBan }) => {
  const [notes, setNotes] = useState(customer.notes || '');
  const [tab, setTab] = useState('info'); // 'info' | 'orders'

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '560px', maxWidth: '95%', maxHeight: '85vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #7f1d1d, #991b1b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 700 }}>
              {customer.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{customer.name}</div>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>{customer.email}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total Orders', value: customer.orders || 0, icon: '📦' },
            { label: 'Total Spent', value: `$${(customer.total_spent || 0).toFixed(2)}`, icon: '💰' },
            { label: 'Member Since', value: customer.joinDate, icon: '📅' },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#f9fafb', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{stat.icon}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>{stat.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
          {[{ key: 'info', label: '📝 Notes' }, { key: 'orders', label: '📦 Order History' }].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              background: tab === key ? 'white' : 'transparent',
              color: tab === key ? '#1e293b' : '#6b7280',
              boxShadow: tab === key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s'
            }}>{label}</button>
          ))}
        </div>

        {/* Notes Tab */}
        {tab === 'info' && (
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Admin Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
              placeholder="Add internal notes about this customer..."
              style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => onToggleBan(customer)} style={{
                flex: 1, padding: '12px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                background: customer.is_banned ? '#d1fae5' : '#fee2e2',
                color: customer.is_banned ? '#065f46' : '#991b1b'
              }}>
                {customer.is_banned ? '✅ Unban Customer' : '🚫 Ban Customer'}
              </button>
              <button onClick={() => { onSaveNotes(customer.id, notes); onClose(); }} style={{
                flex: 1, padding: '12px', background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
                border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'white'
              }}>Save Notes</button>
            </div>
          </div>
        )}

        {/* Order History Tab */}
        {tab === 'orders' && (
          <div>
            {!customer.order_history || customer.order_history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
                <div style={{ fontWeight: 600 }}>No orders yet</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {customer.order_history.map((order, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#7f1d1d', fontFamily: 'monospace' }}>{order.id}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{order.date} · {order.items} item{order.items !== 1 ? 's' : ''}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#10b981' }}>${order.total.toFixed(2)}</div>
                      <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, ...statusStyle(order.status) }}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CustomersTab = ({ customers, isInitialLoading, onUpdateCustomer }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const filtered = customers.filter(c => {
    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'banned' && c.is_banned) ||
      (statusFilter === 'active' && !c.is_banned);
    return matchesSearch && matchesStatus;
  });

  const handleSaveNotes = (id, notes) => {
    onUpdateCustomer(id, { notes });
  };

  const handleToggleBan = (customer) => {
    onUpdateCustomer(customer.id, { is_banned: !customer.is_banned });
    // Update selected customer state to reflect change instantly
    setSelectedCustomer(prev => prev ? { ...prev, is_banned: !prev.is_banned } : null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1e293b' }}>Customers ({customers.length})</h1>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Customers', value: customers.length, icon: '👥', color: '#8b5cf6' },
          { label: 'Active', value: customers.filter(c => !c.is_banned).length, icon: '✅', color: '#10b981' },
          { label: 'Banned', value: customers.filter(c => c.is_banned).length, icon: '🚫', color: '#ef4444' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'white', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af' }}>{stat.label.toUpperCase()}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search by name or email..."
          style={{ flex: 1, padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#1e293b' }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{
          padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px',
          fontSize: '14px', color: '#1e293b', background: 'white', cursor: 'pointer', outline: 'none'
        }}>
          <option value="all">All Customers</option>
          <option value="active">Active Only</option>
          <option value="banned">Banned Only</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {isInitialLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>No customers found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                {['NAME', 'EMAIL', 'JOIN DATE', 'ORDERS', 'TOTAL SPENT', 'STATUS', 'NOTES', 'ACTIONS'].map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer, i) => (
                <tr key={i}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ borderBottom: '1px solid #f3f4f6', background: customer.is_banned ? '#fff5f5' : hoveredRow === i ? '#f9fafb' : 'white', transition: 'background 0.15s' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #7f1d1d, #991b1b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                        {customer.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                        {customer.is_banned && <span title="Banned" style={{ marginRight: '4px' }}>🚫</span>}
                        {customer.name}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>{customer.email}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>{customer.joinDate}</td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{customer.orders || 0}</td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 700, color: '#10b981' }}>${(customer.total_spent || 0).toFixed(2)}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                      background: customer.is_banned ? '#fee2e2' : '#d1fae5',
                      color: customer.is_banned ? '#991b1b' : '#065f46'
                    }}>
                      {customer.is_banned ? 'BANNED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px', color: '#6b7280', maxWidth: '140px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {customer.notes || <span style={{ fontStyle: 'italic', color: '#d1d5db' }}>No notes</span>}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button onClick={() => setSelectedCustomer(customer)}
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
          Showing {filtered.length} of {customers.length} customers
        </div>
      )}

      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onSaveNotes={handleSaveNotes}
          onToggleBan={handleToggleBan}
        />
      )}
    </div>
  );
};

export default CustomersTab;