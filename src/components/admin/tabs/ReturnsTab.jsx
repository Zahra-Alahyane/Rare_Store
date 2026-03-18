import React, { useState } from 'react';

const statusBadge = (status) => {
  const map = {
    pending:  { bg: '#fef3c7', color: '#92400e' },
    approved: { bg: '#dbeafe', color: '#1e40af' },
    rejected: { bg: '#fee2e2', color: '#991b1b' },
    refunded: { bg: '#d1fae5', color: '#065f46' },
  };
  return map[status] || map.pending;
};

const ReturnModal = ({ ret, onClose, onUpdate }) => {
  const [status, setStatus] = useState(ret.status);
  const [refundAmount, setRefundAmount] = useState(ret.refund_amount || '');
  const [partialRefund, setPartialRefund] = useState(ret.partial_refund || false);

  const handleSave = () => {
    onUpdate(ret.id, { status, refund_amount: refundAmount, partial_refund: partialRefund });
    onClose();
  };

  const badge = statusBadge(status);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '520px', maxWidth: '95%', maxHeight: '85vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Return Request</h2>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#7f1d1d', fontFamily: 'monospace' }}>
              #{ret.order?.order_id || ret.order_id}
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Customer', value: ret.order?.customer?.name || '—' },
            { label: 'Email', value: ret.order?.customer?.email || '—' },
            { label: 'Order Total', value: ret.order?.total ? `$${parseFloat(ret.order.total).toFixed(2)}` : '—' },
            { label: 'Submitted', value: ret.created_at ? new Date(ret.created_at).toLocaleDateString() : '—' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#f9fafb', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', marginBottom: '4px' }}>{item.label.toUpperCase()}</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Reason */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>REASON</div>
          <div style={{ background: '#fef9f0', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px', fontSize: '14px', color: '#92400e', lineHeight: 1.6 }}>
            {ret.reason || 'No reason provided'}
          </div>
        </div>

        {/* Status */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>UPDATE STATUS</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['pending', 'approved', 'rejected', 'refunded'].map(s => {
              const b = statusBadge(s);
              return (
                <button key={s} onClick={() => setStatus(s)} style={{
                  padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  border: `2px solid ${status === s ? b.color : '#e5e7eb'}`,
                  background: status === s ? b.bg : 'white',
                  color: status === s ? b.color : '#6b7280',
                  transition: 'all 0.2s'
                }}>
                  {s.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Refund Amount */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>REFUND AMOUNT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 600 }}>$</span>
              <input type="number" value={refundAmount} onChange={e => setRefundAmount(e.target.value)}
                placeholder="0.00" min="0" step="0.01"
                style={{ width: '100%', padding: '10px 12px 10px 28px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input type="checkbox" checked={partialRefund} onChange={e => setPartialRefund(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              Partial refund
            </label>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#6b7280' }}>
            Cancel
          </button>
          <button onClick={handleSave} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'white' }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const ReturnsTab = ({ returns, isInitialLoading, onUpdate }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const filtered = returns.filter(r => {
    const orderId = (r.order?.order_id || r.order_id || '').toString().toLowerCase();
    const customer = (r.order?.customer?.name || '').toLowerCase();
    const matchesSearch = orderId.includes(search.toLowerCase()) || customer.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    pending:  returns.filter(r => r.status === 'pending').length,
    approved: returns.filter(r => r.status === 'approved').length,
    rejected: returns.filter(r => r.status === 'rejected').length,
    refunded: returns.filter(r => r.status === 'refunded').length,
  };

  const totalRefunded = returns
    .filter(r => r.status === 'refunded' && r.refund_amount)
    .reduce((sum, r) => sum + parseFloat(r.refund_amount), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1e293b' }}>Returns & Refunds ({returns.length})</h1>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Pending', value: counts.pending, icon: '⏳', color: '#f59e0b' },
          { label: 'Approved', value: counts.approved, icon: '👍', color: '#3b82f6' },
          { label: 'Refunded', value: counts.refunded, icon: '💰', color: '#10b981' },
          { label: 'Total Refunded', value: `$${totalRefunded.toFixed(2)}`, icon: '💸', color: '#8b5cf6' },
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
          { key: 'pending', label: '⏳ Pending' },
          { key: 'approved', label: '👍 Approved' },
          { key: 'rejected', label: '❌ Rejected' },
          { key: 'refunded', label: '✅ Refunded' },
        ].map(({ key, label }) => {
          const count = key === 'all' ? returns.length : counts[key] || 0;
          return (
            <button key={key} onClick={() => setStatusFilter(key)} style={{
              padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', border: '2px solid',
              borderColor: statusFilter === key ? '#991b1b' : '#e5e7eb',
              background: statusFilter === key ? '#fef2f2' : 'white',
              color: statusFilter === key ? '#991b1b' : '#6b7280',
              transition: 'all 0.2s'
            }}>
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search by order ID or customer name..."
          style={{ width: '100%', padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#1e293b', boxSizing: 'border-box' }} />
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {isInitialLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading returns...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>No returns found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                {['ORDER', 'CUSTOMER', 'REASON', 'REFUND', 'STATUS', 'ACTIONS'].map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ret, i) => {
                const badge = statusBadge(ret.status);
                return (
                  <tr key={i}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ borderBottom: '1px solid #f3f4f6', background: hoveredRow === i ? '#f9fafb' : 'white', transition: 'background 0.15s' }}>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#7f1d1d', fontFamily: 'monospace', fontSize: '14px' }}>
                      #{ret.order?.order_id || ret.order_id}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>
                      {ret.order?.customer?.name || '—'}
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280', maxWidth: '200px', fontSize: '14px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ret.reason}</div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#10b981', fontSize: '14px' }}>
                      {ret.refund_amount > 0 ? `$${parseFloat(ret.refund_amount).toFixed(2)}` : '—'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: badge.bg, color: badge.color, textTransform: 'uppercase' }}>
                        {ret.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button onClick={() => setSelectedReturn(ret)}
                        style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
                        👁 View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 0 && (
        <div style={{ marginTop: '12px', fontSize: '13px', color: '#9ca3af', textAlign: 'right' }}>
          Showing {filtered.length} of {returns.length} returns
        </div>
      )}

      {selectedReturn && (
        <ReturnModal
          ret={selectedReturn}
          onClose={() => setSelectedReturn(null)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};

export default ReturnsTab;