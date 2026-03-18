import React, { useState } from 'react';
import ReviewForm from './ReviewForm';

const API_URL = 'http://localhost:8000/api';

export default function UserProfile({ user, onBack, orders = [] }) {
  const [activeTab, setActiveTab] = useState('info');
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [loadingReview, setLoadingReview] = useState(null);
  const [returningOrder, setReturningOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [returnForm, setReturnForm] = useState({ reason: '', notes: '', refund_amount: '', partial_refund: false });
  const [returnLoading, setReturnLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!user) return null;

  const handleLeaveReview = async (orderId) => {
    setLoadingReview(orderId);
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      const data = await res.json();
      const fullOrder = data.order;
      setReviewingOrder({
        orderId: fullOrder.id,
        productId: fullOrder.items[0].product_id,
        productName: fullOrder.items[0].product.name,
      });
    } catch (err) {
      alert('Could not load order details. Please try again.');
    } finally {
      setLoadingReview(null);
    }
  };

  const handleReturnSubmit = async () => {
    if (!returnForm.reason.trim()) { alert('Please provide a reason for the return.'); return; }
    setReturnLoading(true);
    try {
      const payload = {
        order_id: returningOrder.id,
        reason: returnForm.reason,
        notes: returnForm.notes || null,
        partial_refund: returnForm.partial_refund,
        refund_amount: returnForm.partial_refund && returnForm.refund_amount ? parseFloat(returnForm.refund_amount) : null,
      };
      console.log('Return payload:', payload); // helpful for debugging
      const res = await fetch(`${API_URL}/returns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        alert(errData?.message || `Server error: ${res.status}`);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setReturningOrder(null);
        setReturnForm({ reason: '', notes: '', refund_amount: '', partial_refund: false });
        setSuccessMsg('Return request submitted successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.message || 'Could not submit return request.');
      }
    } catch (err) {
      console.error('Return error:', err);
      alert('Could not submit return request. Please try again.');
    } finally {
      setReturnLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setCancelLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders/${cancellingOrder.id}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setCancellingOrder(null);
        setSuccessMsg('Order cancelled successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.message || 'Could not cancel order.');
      }
    } catch {
      alert('Could not cancel order. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  const returnReasons = [
    'Wrong size or fit',
    'Item not as described',
    'Damaged or defective',
    'Changed my mind',
    'Received wrong item',
    'Other',
  ];

  return (
    <>
      {/* ── Review Modal ── */}
      {reviewingOrder && (
        <div onClick={() => setReviewingOrder(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'popIn 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Leave a Review</h2>
              <button onClick={() => setReviewingOrder(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>×</button>
            </div>
            <ReviewForm
              productId={reviewingOrder.productId}
              productName={reviewingOrder.productName}
              orderId={reviewingOrder.orderId}
              onSuccess={() => setReviewingOrder(null)}
              onCancel={() => setReviewingOrder(null)}
            />
          </div>
        </div>
      )}

      {/* ── Return Modal ── */}
      {returningOrder && (
        <div onClick={() => setReturningOrder(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'popIn 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Request a Return</h2>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>Order #{returningOrder.id}</p>
              </div>
              <button onClick={() => setReturningOrder(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: '8px' }}>Reason for Return *</label>
                <select
                  value={returnForm.reason}
                  onChange={e => setReturnForm(f => ({ ...f, reason: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', color: '#1e293b', background: '#fff', outline: 'none' }}
                >
                  <option value="">Select a reason...</option>
                  {returnReasons.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: '8px' }}>Additional Notes</label>
                <textarea
                  value={returnForm.notes}
                  onChange={e => setReturnForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Describe the issue in more detail..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', color: '#1e293b', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="partial_refund"
                  checked={returnForm.partial_refund}
                  onChange={e => setReturnForm(f => ({ ...f, partial_refund: e.target.checked }))}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="partial_refund" style={{ fontSize: '13px', color: '#1e293b', cursor: 'pointer' }}>Request partial refund only</label>
              </div>

              {returnForm.partial_refund && (
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: '8px' }}>Refund Amount ($)</label>
                  <input
                    type="number"
                    value={returnForm.refund_amount}
                    onChange={e => setReturnForm(f => ({ ...f, refund_amount: e.target.value }))}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', color: '#1e293b', outline: 'none' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button onClick={() => setReturningOrder(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#6b7280', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={handleReturnSubmit}
                  disabled={returnLoading}
                  style={{ flex: 1, padding: '12px', background: '#7f1d1d', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#fff', cursor: returnLoading ? 'not-allowed' : 'pointer', opacity: returnLoading ? 0.7 : 1 }}
                >
                  {returnLoading ? 'Submitting...' : 'Submit Return'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel Confirmation Modal ── */}
      {cancellingOrder && (
        <div onClick={() => setCancellingOrder(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'popIn 0.2s ease', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: '0 0 8px 0' }}>Cancel Order?</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>
              Are you sure you want to cancel <strong>Order #{cancellingOrder.id}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setCancellingOrder(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#6b7280', cursor: 'pointer' }}>
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                style={{ flex: 1, padding: '12px', background: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#fff', cursor: cancelLoading ? 'not-allowed' : 'pointer', opacity: cancelLoading ? 0.7 : 1 }}
              >
                {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

        {/* Left Panel */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 24px', paddingTop: '200px', background: '#fff', color: '#1e293b', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>

            <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px' }}
              onMouseEnter={e => e.currentTarget.style.color = '#1e293b'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Back to Store
            </button>

            <div style={{ fontSize: '24px', fontWeight: 300, letterSpacing: '0.5em', color: '#1e293b', marginBottom: '32px' }}>RARE STORE</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#7f1d1d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', color: '#fff', flexShrink: 0 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: 0, lineHeight: 1.2 }}>{user.name}</h1>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>{user.email}</p>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #d1d5db', textAlign: 'center' }}>My Account</p>

            {/* Success message */}
            {successMsg && (
              <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '8px', color: '#065f46', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                {successMsg}
              </div>
            )}

            <div style={{ display: 'flex', marginBottom: '32px', borderBottom: '1px solid #d1d5db' }}>
              {[{ key: 'info', label: 'Personal Info' }, { key: 'orders', label: 'Order History' }].map(({ key, label }) => (
                <button key={key} onClick={() => setActiveTab(key)} style={{ flex: 1, padding: '12px 16px', background: 'none', border: 'none', borderBottom: activeTab === key ? '2px solid #7f1d1d' : '2px solid transparent', color: activeTab === key ? '#7f1d1d' : '#6b7280', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.5px' }}
                  onMouseEnter={e => { if (activeTab !== key) e.currentTarget.style.color = '#1e293b'; }}
                  onMouseLeave={e => { if (activeTab !== key) e.currentTarget.style.color = '#6b7280'; }}
                >{label}</button>
              ))}
            </div>

            {activeTab === 'info' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { label: 'Full Name', value: user.name },
                  { label: 'Email Address', value: user.email },
                  ...(user.phone ? [{ label: 'Phone Number', value: user.phone }] : []),
                  ...(user.address ? [{ label: 'Address', value: user.address }] : []),
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{label}</label>
                    <div style={{ padding: '16px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '16px', background: '#f9fafb', color: '#1e293b' }}>{value}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Account Status</label>
                  <div style={{ padding: '16px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                    <span style={{ fontSize: '16px', color: '#1e293b' }}>Active</span>
                  </div>
                </div>
                {user.memberSince && (
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                    Member since: {new Date(user.memberSince).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders && orders.length > 0 ? orders.map((order, index) => {
                  const isDelivered = order.status === 'delivered' || order.status === 'completed';
                  const isShipped = order.status === 'shipped';
                  const isProcessing = order.status === 'processing' || order.status === 'pending';
                  const isLoadingThis = loadingReview === order.id;

                  return (
                    <div key={index} style={{ padding: '16px', border: '1px solid #d1d5db', borderRadius: '8px', background: '#f9fafb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Order #{order.id}</p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <span style={{
                          padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 600,
                          background: isDelivered ? '#d1fae5' : isShipped ? '#dbeafe' : isProcessing ? '#fef3c7' : '#f3f4f6',
                          color: isDelivered ? '#065f46' : isShipped ? '#1e40af' : isProcessing ? '#92400e' : '#6b7280',
                        }}>{order.status}</span>
                      </div>

                      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>Total</span>
                        <span style={{ fontSize: '18px', fontWeight: 600, color: '#7f1d1d' }}>${parseFloat(order.total).toFixed(2)}</span>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>

                        {/* Cancel button — processing/pending only */}
                        {isProcessing && (
                          <button
                            onClick={() => setCancellingOrder(order)}
                            style={{
                              width: '100%', padding: '10px', background: 'none',
                              border: '1.5px dashed #ef4444', borderRadius: '8px',
                              color: '#ef4444', fontSize: '13px', fontWeight: 600,
                              cursor: 'pointer', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            ✕ Cancel Order
                          </button>
                        )}

                        {/* Return button — shipped or delivered */}
                        {(isShipped || isDelivered) && (
                          <button
                            onClick={() => setReturningOrder(order)}
                            style={{
                              width: '100%', padding: '10px', background: 'none',
                              border: '1.5px dashed #7f1d1d', borderRadius: '8px',
                              color: '#7f1d1d', fontSize: '13px', fontWeight: 600,
                              cursor: 'pointer', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            ↩ Request Return
                          </button>
                        )}

                        {/* Review button — delivered/completed only */}
                        {isDelivered && (
                          <button
                            onClick={() => handleLeaveReview(order.id)}
                            disabled={isLoadingThis}
                            style={{
                              width: '100%', padding: '10px', background: 'none',
                              border: '1.5px dashed #7f1d1d', borderRadius: '8px',
                              color: '#7f1d1d', fontSize: '13px', fontWeight: 600,
                              cursor: isLoadingThis ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s', opacity: isLoadingThis ? 0.6 : 1,
                            }}
                            onMouseEnter={e => { if (!isLoadingThis) e.currentTarget.style.background = '#fef2f2'; }}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            {isLoadingThis ? 'Loading...' : '⭐ Leave a Review'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block', opacity: 0.4 }}>
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <p style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#1e293b' }}>No orders yet</p>
                    <p style={{ fontSize: '14px', margin: 0 }}>Start shopping to see your order history here</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right Panel */}
        <div style={{ position: 'fixed', top: 0, right: 0, width: '50%', height: '100vh', backgroundImage: 'url(https://images.unsplash.com/photo-1617897903246-719242758050?w=1200&h=1600&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(127,29,29,0.7), rgba(0,0,0,0.6))' }} />
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff', padding: '48px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 300, letterSpacing: '0.2em', marginBottom: '16px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Your Style</h2>
            <p style={{ fontSize: '20px', color: '#d1d5db', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Curated exclusively for you</p>
          </div>
        </div>

      </div>
    </>
  );
}