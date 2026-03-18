import React, { useState } from 'react';

const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`;

const inputStyle = {
  padding: '16px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  fontSize: '15px',
  background: '#fff',
  color: '#1e293b',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s'
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function placeOrderAPI({ cart, subtotal, shipping, tax, total, token }) {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      cart: cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        selectedSize: item.selectedSize || null,
        selectedColor: item.selectedColor || null,
      })),
      subtotal,
      shipping,
      tax,
      total,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to place order');
  return data;
}

async function generateInvoicePDF({
  cart, subtotal, shipping, tax, discount, appliedPromo,
  finalTotal, shippingInfo, shippingMethod, shippingOptions, paymentMethod, orderId
}) {
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = 210, margin = 20, col2 = 120;
  let y = 0;

  doc.setFillColor(127, 29, 29);
  doc.rect(0, 0, pageW, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('RARE STORE', margin, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Luxury Fashion', margin, 26);
  doc.text('rare-store.com  |  support@rare-store.com', margin, 33);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageW - margin, 18, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const invoiceNum = orderId ? `#${String(orderId).padStart(6, '0')}` : `#${Date.now().toString().slice(-6)}`;
  doc.text(`Invoice No: ${invoiceNum}`, pageW - margin, 26, { align: 'right' });
  doc.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageW - margin, 33, { align: 'right' });

  y = 50;
  doc.setTextColor(127, 29, 29);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO', margin, y);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  y += 6;
  doc.text(shippingInfo.fullName || '—', margin, y); y += 5;
  doc.text(shippingInfo.email || '—', margin, y); y += 5;
  doc.text(shippingInfo.phone || '—', margin, y); y += 5;
  doc.text(shippingInfo.address || '—', margin, y); y += 5;
  const cityLine = [shippingInfo.city, shippingInfo.state, shippingInfo.zipCode].filter(Boolean).join(', ');
  doc.text(cityLine || '—', margin, y);

  doc.setFillColor(254, 242, 242);
  doc.roundedRect(col2, 50, pageW - col2 - margin, 32, 3, 3, 'F');
  doc.setTextColor(127, 29, 29);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DELIVERY METHOD', col2 + 5, 57);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(shippingOptions[shippingMethod]?.name || '—', col2 + 5, 64);
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(shippingOptions[shippingMethod]?.days || '—', col2 + 5, 70);
  doc.setTextColor(127, 29, 29);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PAYMENT METHOD', col2 + 5, 78);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const payLabel = paymentMethod === 'card' ? 'Credit / Debit Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery';
  doc.text(payLabel, col2 + 5, 84);

  y = 100;
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, pageW - margin * 2, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ITEM', margin + 2, y + 6);
  doc.text('QTY', 120, y + 6);
  doc.text('UNIT PRICE', 145, y + 6);
  doc.text('TOTAL', 170, y + 6);
  y += 9;

  cart.forEach((item, i) => {
    const rowH = 12;
    if (i % 2 === 0) { doc.setFillColor(249, 250, 251); doc.rect(margin, y, pageW - margin * 2, rowH, 'F'); }
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    let itemName = item.name || 'Product';
    if (item.selectedSize) itemName += ` (${item.selectedSize})`;
    if (item.selectedColor) itemName += ` / ${item.selectedColor}`;
    if (itemName.length > 42) itemName = itemName.slice(0, 40) + '…';
    doc.text(itemName, margin + 2, y + 8);
    doc.text(String(item.quantity || 1), 120, y + 8);
    doc.text(formatPrice(item.price), 145, y + 8);
    doc.text(formatPrice((item.price || 0) * (item.quantity || 1)), 170, y + 8);
    y += rowH;
  });

  doc.setDrawColor(209, 213, 219);
  doc.line(margin, y + 2, pageW - margin, y + 2);
  y += 8;

  const totalsX = 130, totalsValX = pageW - margin;
  const addTotalRow = (label, value, bold = false, color = null) => {
    doc.setTextColor(...(color || [107, 114, 128]));
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(9);
    doc.text(label, totalsX, y);
    doc.setTextColor(...(color || [30, 41, 59]));
    doc.text(value, totalsValX, y, { align: 'right' });
    y += 6;
  };

  addTotalRow('Subtotal', formatPrice(subtotal));
  addTotalRow('Shipping', shipping === 0 ? 'FREE' : formatPrice(shipping));
  addTotalRow('Tax (8%)', formatPrice(tax));
  if (discount > 0) addTotalRow(`Discount (${appliedPromo?.code || ''})`, `-${formatPrice(discount)}`, false, [16, 185, 129]);

  y += 2;
  doc.setFillColor(127, 29, 29);
  doc.roundedRect(totalsX - 5, y - 1, pageW - margin - totalsX + 5, 11, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL', totalsX, y + 7);
  doc.text(formatPrice(finalTotal), totalsValX, y + 7, { align: 'right' });
  y += 20;

  doc.setDrawColor(229, 231, 235);
  doc.line(margin, y, pageW - margin, y);
  y += 8;
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text('Thank you for shopping with RARE STORE. For any questions, contact support@rare-store.com', pageW / 2, y, { align: 'center' });

  doc.setFillColor(30, 41, 59);
  doc.rect(0, 287, pageW, 10, 'F');
  doc.setTextColor(156, 163, 175);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('RARE STORE  ·  Luxury Fashion  ·  rare-store.com', pageW / 2, 293, { align: 'center' });

  doc.save(`RARE-Invoice-${invoiceNum}.pdf`);
}

export default function CartPage({
  cart,
  user,
  onBack,
  onLogout,
  onLogin,
  updateQuantity,
  removeFromCart,
  subtotal,
  shipping,
  tax,
  total,
  showNotification,
  onCheckout
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '', email: '', phone: '', address: '',
    city: '', state: '', zipCode: '', country: 'United States'
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });

  const promoCodes = {
    'LUXURY10': { discount: 10, type: 'percentage' },
    'RARE20':   { discount: 20, type: 'percentage' },
    'VIP50':    { discount: 50, type: 'fixed' }
  };

  const shippingOptions = {
    standard: { name: 'Standard Delivery', price: 15.99, days: '5-7 business days', icon: '📦' },
    express:  { name: 'Express Delivery',  price: 29.99, days: '2-3 business days',  icon: '⚡' },
    overnight:{ name: 'Overnight Express', price: 49.99, days: 'Next business day',  icon: '🚀' }
  };

  const selectedShippingPrice = subtotal > 200 ? 0 : shippingOptions[shippingMethod].price;

  let discount = 0;
  if (appliedPromo) {
    discount = appliedPromo.type === 'percentage'
      ? subtotal * (appliedPromo.discount / 100)
      : Math.min(appliedPromo.discount, subtotal); // can't discount more than subtotal
  }
  const finalTotal = Math.max(0, subtotal + selectedShippingPrice + tax - discount);

  const applyPromoCode = () => {
    const promo = promoCodes[promoCode.toUpperCase()];
    if (promo) {
      setAppliedPromo({ code: promoCode.toUpperCase(), ...promo });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      showNotification(`Promo code ${promoCode.toUpperCase()} applied!`, 'success');
    } else {
      showNotification('Invalid promo code', 'error');
    }
  };

  const removePromo = () => { setAppliedPromo(null); setPromoCode(''); };

  const handleShippingSubmit = () => {
    const { fullName, email, phone, address, city, zipCode } = shippingInfo;
    if (fullName && email && phone && address && city && zipCode) {
      setCurrentStep(3);
    } else {
      showNotification('Please fill in all required fields', 'error');
    }
  };

  const handleDownloadInvoice = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateInvoicePDF({
        cart, subtotal, shipping: selectedShippingPrice, tax,
        discount, appliedPromo, finalTotal, shippingInfo,
        shippingMethod, shippingOptions, paymentMethod, orderId: placedOrderId,
      });
      showNotification('Invoice downloaded!', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to generate invoice. Please try again.', 'error');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) { setShowLoginModal(true); return; }
    if (cart.length === 0) { showNotification('Your cart is empty!', 'error'); return; }

    // Validate card info if card payment selected
    if (paymentMethod === 'card') {
      if (!cardInfo.cardNumber || !cardInfo.cardName || !cardInfo.expiryDate || !cardInfo.cvv) {
        showNotification('Please fill in all card details', 'error');
        return;
      }
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('auth_token');
      const result = await placeOrderAPI({
        cart, subtotal, shipping: selectedShippingPrice, tax, total: finalTotal, token,
      });

      if (result?.order?.id) setPlacedOrderId(result.order.id);
      setOrderPlaced(true);
      if (onCheckout) onCheckout();
      showNotification('Order placed successfully! 🎉', 'success');

      setTimeout(() => {
        setCurrentStep(1);
        setShippingInfo({ fullName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', country: 'United States' });
        setCardInfo({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
        setAppliedPromo(null);
        setPromoCode('');
        onBack();
      }, 4000);

    } catch (error) {
      console.error('Order error:', error);
      showNotification(error.message || 'Error processing order. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { num: 1, label: 'Cart' },
    { num: 2, label: 'Shipping' },
    { num: 3, label: 'Payment' },
    { num: 4, label: 'Review' }
  ];

  const stepTitles    = { 1: 'Your Cart', 2: 'Shipping Details', 3: 'Payment Method', 4: 'Review Order' };
  const stepSubtitles = {
    1: `${cart.length} item${cart.length !== 1 ? 's' : ''} in your cart`,
    2: 'Enter your delivery information',
    3: 'Choose how you want to pay',
    4: 'Confirm your order details'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

      {/* Login Modal */}
      {showLoginModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '8px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 300, color: '#1e293b', marginBottom: '12px' }}>Login Required</h3>
            <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '14px' }}>Please sign in to complete your purchase.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setShowLoginModal(false); if (onLogin) onLogin(); }}
                style={{ flex: 1, background: '#7f1d1d', color: '#fff', border: 'none', padding: '14px', borderRadius: '50px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Sign In
              </button>
              <button onClick={() => setShowLoginModal(false)}
                style={{ flex: 1, background: 'none', border: '1px solid #d1d5db', color: '#6b7280', padding: '14px', borderRadius: '50px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', color: '#1e293b', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ padding: '24px 48px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1e293b'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Store
          </button>
          <div style={{ fontSize: '20px', fontWeight: 300, letterSpacing: '0.5em', color: '#1e293b' }}>RARE STORE</div>
        </div>

        {/* Step Progress */}
        <div style={{ padding: '24px 48px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {steps.map((step, i) => (
              <React.Fragment key={step.num}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700,
                    background: currentStep >= step.num ? '#7f1d1d' : '#f3f4f6',
                    color: currentStep >= step.num ? '#fff' : '#9ca3af',
                    border: currentStep === step.num ? '2px solid #7f1d1d' : '2px solid transparent',
                    transition: 'all 0.3s'
                  }}>
                    {currentStep > step.num ? '✓' : step.num}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', color: currentStep >= step.num ? '#7f1d1d' : '#9ca3af' }}>
                    {step.label.toUpperCase()}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: '1px', margin: '0 12px', background: currentStep > step.num ? '#7f1d1d' : '#e5e7eb', transition: 'background 0.3s' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 300, color: '#1e293b', marginBottom: '8px' }}>{stepTitles[currentStep]}</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #d1d5db' }}>
            {stepSubtitles[currentStep]}
          </p>

          {/* STEP 1 – CART */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>🛒</div>
                  <p style={{ fontSize: '18px', color: '#1e293b', marginBottom: '8px' }}>Your cart is empty</p>
                  <p style={{ fontSize: '14px' }}>Discover our exclusive collections</p>
                  <button onClick={onBack} style={{ marginTop: '24px', background: '#7f1d1d', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '50px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                    Continue Shopping
                  </button>
                </div>
              ) : cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f9fafb' }}>
                  <img src={item.image || '/placeholder.svg'} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '15px', color: '#1e293b', margin: '0 0 4px 0' }}>{item.name}</p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{formatPrice(item.price)}</p>
                    {item.selectedSize  && <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>Size: {item.selectedSize}</p>}
                    {item.selectedColor && <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>Color: {item.selectedColor}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ width: '28px', height: '28px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '16px', color: '#1e293b' }}>−</button>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ width: '28px', height: '28px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '16px', color: '#1e293b' }}>+</button>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <p style={{ fontWeight: 700, fontSize: '16px', color: '#1e293b', margin: '0 0 8px 0' }}>{formatPrice((item.price || 0) * (item.quantity || 1))}</p>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#7f1d1d', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Remove</button>
                  </div>
                </div>
              ))}

              {cart.length > 0 && (
                <>
                  <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                    <input type="text" placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                      onFocus={(e) => e.target.style.borderColor = '#7f1d1d'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                      onKeyDown={(e) => e.key === 'Enter' && applyPromoCode()} />
                    <button onClick={applyPromoCode} style={{ background: '#7f1d1d', color: '#fff', border: 'none', padding: '0 24px', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Apply</button>
                  </div>
                  {showSuccess && <p style={{ color: '#10b981', fontSize: '13px', margin: '4px 0 0 0' }}>✓ Code {appliedPromo?.code} applied!</p>}
                  {appliedPromo && (
                    <button onClick={removePromo} style={{ background: 'none', border: 'none', color: '#7f1d1d', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', textAlign: 'left', padding: 0 }}>
                      Remove promo code ({appliedPromo.code})
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* STEP 2 – SHIPPING */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Full Name *</label>
                <input type="text" placeholder="John Doe" value={shippingInfo.fullName} onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#7f1d1d'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Email *</label>
                  <input type="email" placeholder="your@email.com" value={shippingInfo.email} onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#7f1d1d'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Phone *</label>
                  <input type="tel" placeholder="+1 234 567 890" value={shippingInfo.phone} onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#7f1d1d'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Street Address *</label>
                <input type="text" placeholder="123 Main St" value={shippingInfo.address} onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#7f1d1d'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                {[
                  { key: 'city',    label: 'City *',  placeholder: 'New York' },
                  { key: 'state',   label: 'State',   placeholder: 'NY'       },
                  { key: 'zipCode', label: 'ZIP *',   placeholder: '10001'    },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{label}</label>
                    <input type="text" placeholder={placeholder} value={shippingInfo[key]} onChange={(e) => setShippingInfo({ ...shippingInfo, [key]: e.target.value })} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#7f1d1d'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: '12px' }}>Delivery Method</label>
                {Object.entries(shippingOptions).map(([key, opt]) => (
                  <label key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', marginBottom: '8px', cursor: 'pointer', border: `1px solid ${shippingMethod === key ? '#7f1d1d' : '#d1d5db'}`, borderRadius: '4px', background: shippingMethod === key ? '#fef2f2' : '#f9fafb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="radio" name="shipping" value={key} checked={shippingMethod === key} onChange={(e) => setShippingMethod(e.target.value)} style={{ accentColor: '#7f1d1d' }} />
                      <span style={{ fontSize: '16px' }}>{opt.icon}</span>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b', margin: 0 }}>{opt.name}</p>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{opt.days}</p>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: subtotal > 200 && key === 'standard' ? '#10b981' : '#7f1d1d' }}>
                      {subtotal > 200 && key === 'standard' ? 'FREE' : formatPrice(opt.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 – PAYMENT */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: '4px' }}>Payment Method</label>
              {['card', 'paypal', 'cash'].map((method) => (
                <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: `1px solid ${paymentMethod === method ? '#7f1d1d' : '#d1d5db'}`, borderRadius: '4px', background: paymentMethod === method ? '#fef2f2' : '#f9fafb', cursor: 'pointer' }}>
                  <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} style={{ accentColor: '#7f1d1d' }} />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>
                    {method === 'card' ? '💳 Credit / Debit Card' : method === 'paypal' ? '💰 PayPal' : '💵 Cash on Delivery'}
                  </span>
                </label>
              ))}

              {paymentMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  {[
                    { key: 'cardNumber', label: 'Card Number',     placeholder: '1234 5678 9012 3456', maxLength: 16 },
                    { key: 'cardName',   label: 'Cardholder Name', placeholder: 'John Doe' },
                  ].map(({ key, label, placeholder, maxLength }) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{label}</label>
                      <input type="text" placeholder={placeholder} value={cardInfo[key]} maxLength={maxLength}
                        onChange={(e) => setCardInfo({ ...cardInfo, [key]: e.target.value })} style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = '#7f1d1d'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
                    </div>
                  ))}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                      { key: 'expiryDate', label: 'Expiry', placeholder: 'MM/YY', maxLength: 5 },
                      { key: 'cvv',        label: 'CVV',    placeholder: '123',   maxLength: 4 },
                    ].map(({ key, label, placeholder, maxLength }) => (
                      <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{label}</label>
                        <input type={key === 'cvv' ? 'password' : 'text'} placeholder={placeholder} value={cardInfo[key]} maxLength={maxLength}
                          onChange={(e) => setCardInfo({ ...cardInfo, [key]: e.target.value })} style={inputStyle}
                          onFocus={(e) => e.target.style.borderColor = '#7f1d1d'} onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4 – REVIEW */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Order placed success banner */}
              {orderPlaced && (
                <div style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
                  <p style={{ color: '#065f46', fontWeight: 700, margin: 0, fontSize: '16px' }}>Order placed successfully!</p>
                  <p style={{ color: '#047857', margin: '4px 0 0 0', fontSize: '13px' }}>Redirecting you back to the store...</p>
                </div>
              )}

              {[
                { title: '📍 Shipping Address', content: (
                  <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.8 }}>
                    <p style={{ fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{shippingInfo.fullName}</p>
                    <p style={{ margin: 0 }}>{shippingInfo.email}</p>
                    <p style={{ margin: 0 }}>{shippingInfo.phone}</p>
                    <p style={{ margin: 0 }}>{shippingInfo.address}</p>
                    <p style={{ margin: 0 }}>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p style={{ margin: '8px 0 0 0', color: '#7f1d1d', fontWeight: 600 }}>
                      {shippingOptions[shippingMethod].name} — {shippingOptions[shippingMethod].days}
                    </p>
                  </div>
                )},
                { title: '💳 Payment Method', content: (
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    {paymentMethod === 'card' ? '💳 Credit / Debit Card' : paymentMethod === 'paypal' ? '💰 PayPal' : '💵 Cash on Delivery'}
                  </p>
                )},
                { title: `🛍️ Order Items (${cart.length})`, content: (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cart.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280' }}>
                        <span>
                          {item.name} × {item.quantity}
                          {item.selectedSize  && <span style={{ color: '#9ca3af' }}> · {item.selectedSize}</span>}
                          {item.selectedColor && <span style={{ color: '#9ca3af' }}> · {item.selectedColor}</span>}
                        </span>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                      </div>
                    ))}
                  </div>
                )},
              ].map(({ title, content }) => (
                <div key={title} style={{ padding: '20px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#f9fafb' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: '12px' }}>{title}</label>
                  {content}
                </div>
              ))}

              {cart.length > 0 && (
                <button onClick={handleDownloadInvoice} disabled={isGeneratingPDF}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '14px 24px', background: isGeneratingPDF ? '#f3f4f6' : '#fff', border: '1.5px dashed #7f1d1d', borderRadius: '8px', color: isGeneratingPDF ? '#9ca3af' : '#7f1d1d', fontSize: '14px', fontWeight: 600, cursor: isGeneratingPDF ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { if (!isGeneratingPDF) e.currentTarget.style.background = '#fef2f2'; }}
                  onMouseLeave={(e) => { if (!isGeneratingPDF) e.currentTarget.style.background = '#fff'; }}>
                  {isGeneratingPDF ? (
                    <><div style={{ width: '16px', height: '16px', border: '2px solid #d1d5db', borderTopColor: '#7f1d1d', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Generating Invoice...</>
                  ) : (
                    <><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg> Download Invoice (PDF)</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div style={{ padding: '24px 48px', borderTop: '1px solid #e5e7eb', background: '#fff' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {currentStep > 1 && !orderPlaced && (
              <button onClick={() => setCurrentStep(currentStep - 1)}
                style={{ flex: 1, background: 'none', border: '1px solid #d1d5db', color: '#6b7280', padding: '16px', borderRadius: '50px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#1e293b'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#6b7280'; }}>
                ← Back
              </button>
            )}
            {currentStep < 4 ? (
              <button
                onClick={currentStep === 1 ? () => { if (cart.length === 0) { showNotification('Your cart is empty!', 'error'); return; } setCurrentStep(2); } : currentStep === 2 ? handleShippingSubmit : () => setCurrentStep(4)}
                style={{ flex: 2, background: '#7f1d1d', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: '50px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#991b1b'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#7f1d1d'}>
                {currentStep === 1 ? 'Continue to Shipping' : currentStep === 2 ? 'Continue to Payment' : 'Review Order'}
              </button>
            ) : (
              <button onClick={handlePlaceOrder} disabled={isProcessing || orderPlaced}
                style={{ flex: 2, background: isProcessing || orderPlaced ? '#d1d5db' : '#7f1d1d', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: '50px', fontSize: '16px', fontWeight: 600, cursor: isProcessing || orderPlaced ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {isProcessing ? (
                  <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Processing...</>
                ) : orderPlaced ? '✓ Order Placed' : '🔒 Place Order'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — fixed so it never goes black ──────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, right: 0, width: '50%', height: '100vh',
        backgroundImage: 'url(https://images.unsplash.com/photo-1617897903246-719242758050?w=1200&h=1600&fit=crop)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(127,29,29,0.7), rgba(0,0,0,0.6))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff', padding: '48px' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '32px', marginBottom: '32px', maxWidth: '320px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '2px', marginBottom: '20px', color: '#fff' }}>ORDER SUMMARY</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: `Subtotal (${cart.length} item${cart.length !== 1 ? 's' : ''})`, value: formatPrice(subtotal), highlight: false },
                { label: 'Shipping', value: selectedShippingPrice === 0 ? 'FREE' : formatPrice(selectedShippingPrice), highlight: selectedShippingPrice === 0 },
                { label: 'Tax (8%)', value: formatPrice(tax), highlight: false },
                ...(discount > 0 ? [{ label: `Discount (${appliedPromo?.code})`, value: `-${formatPrice(discount)}`, highlight: true }] : []),
              ].map(({ label, value, highlight }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                  <span>{label}</span>
                  <span style={{ color: highlight ? '#10b981' : '#fff', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px', fontSize: '20px', fontWeight: 700, color: '#fff' }}>
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
            {subtotal > 0 && subtotal < 200 && (
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '12px' }}>
                💡 Add {formatPrice(200 - subtotal)} more for FREE shipping!
              </p>
            )}
          </div>
          <h2 style={{ fontSize: '40px', fontWeight: 300, letterSpacing: '0.2em', marginBottom: '12px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Luxury Fashion</h2>
          <p style={{ fontSize: '18px', color: '#d1d5db', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Discover exclusive designer collections</p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}