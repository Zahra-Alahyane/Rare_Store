import React, { useState } from 'react';

const ReviewsTab = ({ reviews, isInitialLoading, onApprove, onReject, onReply, onDelete }) => {
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

  const handleReply = () => {
    onReply(replyModal.id, replyText);
    setReplyModal(null);
    setReplyText('');
  };

  const statusBadge = (status) => {
    const map = {
      pending: { bg: '#fef3c7', color: '#92400e', label: 'PENDING' },
      approved: { bg: '#d1fae5', color: '#065f46', label: 'APPROVED' },
      rejected: { bg: '#fee2e2', color: '#991b1b', label: 'REJECTED' },
    };
    return map[status] || map.pending;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1e293b' }}>Reviews ({reviews.length})</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              background: filter === f ? '#1e293b' : '#f3f4f6',
              color: filter === f ? 'white' : '#6b7280',
              textTransform: 'capitalize'
            }}>{f}</button>
          ))}
        </div>
      </div>

      {isInitialLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading reviews...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>No reviews found</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((review, i) => {
            const badge = statusBadge(review.status);
            return (
              <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>{review.customer?.name || 'Customer'}</span>
                      <span style={{ color: '#f59e0b', fontSize: '16px' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, background: badge.bg, color: badge.color }}>{badge.label}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      {review.product?.name || 'Product'} · {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {review.status === 'pending' && (
                      <>
                        <button onClick={() => onApprove(review.id)} style={{ padding: '7px 14px', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>✓ Approve</button>
                        <button onClick={() => onReject(review.id)} style={{ padding: '7px 14px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>✕ Reject</button>
                      </>
                    )}
                    <button onClick={() => { setReplyModal(review); setReplyText(review.reply || ''); }}
                      style={{ padding: '7px 14px', background: '#dbeafe', color: '#1e40af', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>💬 Reply</button>
                    <button onClick={() => onDelete(review.id)}
                      style={{ padding: '7px 14px', background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>🗑️</button>
                  </div>
                </div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: 1.6, margin: '0 0 12px' }}>{review.body}</p>
                {review.reply && (
                  <div style={{ background: '#f8fafc', borderLeft: '3px solid #7f1d1d', padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#7f1d1d', marginBottom: '4px' }}>ADMIN REPLY</div>
                    <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>{review.reply}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {replyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setReplyModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>Reply to Review</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>"{replyModal.body}"</p>
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4}
              placeholder="Write your reply..."
              style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => setReplyModal(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#6b7280' }}>Cancel</button>
              <button onClick={handleReply} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: 'white' }}>Send Reply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;