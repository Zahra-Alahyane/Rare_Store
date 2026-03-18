import React, { useState } from 'react';

const CouponsTab = ({ coupons, isInitialLoading, onAdd, onToggle, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', min_order: '', usage_limit: '', expiry_date: '' });

  const handleAdd = () => {
    onAdd(form);
    setForm({ code: '', type: 'percentage', value: '', min_order: '', usage_limit: '', expiry_date: '' });
    setShowModal(false);
  };

  const statusBadge = (coupon) => {
    if (!coupon.is_active) return { label: 'DISABLED', bg: '#fee2e2', color: '#991b1b' };
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) return { label: 'EXPIRED', bg: '#f3f4f6', color: '#6b7280' };
    return { label: 'ACTIVE', bg: '#d1fae5', color: '#065f46' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1e293b' }}>Coupons ({coupons.length})</h1>
        <button onClick={() => setShowModal(true)} style={{
          background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)', color: 'white', border: 'none',
          padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
        }}>+ Add Coupon</button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {isInitialLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏷️</div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>No coupons yet</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                {['CODE', 'TYPE', 'VALUE', 'MIN ORDER', 'USAGE', 'EXPIRY', 'STATUS', 'ACTIONS'].map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, i) => {
                const badge = statusBadge(coupon);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#1e293b', fontFamily: 'monospace', fontSize: '15px' }}>{coupon.code}</td>
                    <td style={{ padding: '16px', color: '#6b7280', textTransform: 'capitalize' }}>{coupon.type}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#1e293b' }}>
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>${coupon.min_order || 0}</td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>
                      {coupon.times_used}{coupon.usage_limit ? `/${coupon.usage_limit}` : ' uses'}
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>
                      {coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: badge.bg, color: badge.color }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button onClick={() => onToggle(coupon.id)} title={coupon.is_active ? 'Disable' : 'Enable'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', marginRight: '8px' }}>
                        {coupon.is_active ? '🔴' : '🟢'}
                      </button>
                      <button onClick={() => onDelete(coupon.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: '#1e293b' }}>Add Coupon</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input placeholder="Coupon Code (e.g. SAVE20)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace' }} />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
              <input type="number" placeholder={form.type === 'percentage' ? 'Discount % (e.g. 20)' : 'Discount $ (e.g. 10)'} value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              <input type="number" placeholder="Minimum order amount (optional)" value={form.min_order}
                onChange={(e) => setForm({ ...form, min_order: e.target.value })}
                style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              <input type="number" placeholder="Usage limit (optional)" value={form.usage_limit}
                onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              <input type="date" placeholder="Expiry date (optional)" value={form.expiry_date}
                onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#6b7280' }}>Cancel</button>
                <button onClick={handleAdd} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'white' }}>Create Coupon</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsTab;