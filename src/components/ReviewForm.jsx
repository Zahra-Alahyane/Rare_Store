import React, { useState } from 'react';

const API_URL = 'http://127.0.0.1:8000/api';

const ReviewForm = ({ productId, productName, orderId, onSuccess, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { alert('Please select a star rating'); return; }
    if (body.trim().length < 10) { alert('Please write at least 10 characters'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ product_id: productId, order_id: orderId, rating, body }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        onSuccess && onSuccess();
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (err) {
  alert('Error: ' + err.message);
} finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
        border: '1px solid #6ee7b7',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        marginTop: '12px',
      }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>✅</div>
        <p style={{ color: '#065f46', fontWeight: 700, margin: 0, fontSize: '14px' }}>
          Review submitted! It will appear after admin approval.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '12px',
    }}>
      <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px', marginBottom: '12px' }}>
        ✍️ Review: <span style={{ color: '#7f1d1d' }}>{productName}</span>
      </p>

      {/* Star Rating */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
              fontSize: '28px', lineHeight: 1,
              color: star <= (hovered || rating) ? '#f59e0b' : '#d1d5db',
              transform: star <= (hovered || rating) ? 'scale(1.15)' : 'scale(1)',
              transition: 'all 0.15s',
            }}
          >★</button>
        ))}
        {rating > 0 && (
          <span style={{ fontSize: '13px', color: '#6b7280', alignSelf: 'center', marginLeft: '6px' }}>
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </span>
        )}
      </div>

      {/* Text */}
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={3}
        placeholder="Share your experience with this product..."
        style={{
          width: '100%', padding: '12px', border: '1px solid #e2e8f0',
          borderRadius: '8px', fontSize: '14px', resize: 'vertical',
          boxSizing: 'border-box', fontFamily: 'inherit', color: '#1e293b',
          background: '#fff', outline: 'none',
        }}
      />
      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', marginBottom: '12px' }}>
        {body.length}/500 characters
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: '10px', background: '#f1f5f9', border: 'none',
          borderRadius: '8px', fontSize: '13px', fontWeight: 600,
          cursor: 'pointer', color: '#64748b',
        }}>Cancel</button>
        <button onClick={handleSubmit} disabled={loading} style={{
          flex: 2, padding: '10px',
          background: loading ? '#9ca3af' : 'linear-gradient(135deg, #7f1d1d, #991b1b)',
          border: 'none', borderRadius: '8px', fontSize: '13px',
          fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', color: '#fff',
          letterSpacing: '0.5px',
        }}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;