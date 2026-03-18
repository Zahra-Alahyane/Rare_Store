import React, { useState } from 'react';

const MODAL_CONTENT = {
  'Shipping & Returns': {
    title: 'Shipping & Returns',
    body: `SHIPPING
━━━━━━━━
• Standard Delivery (5–7 business days): Free on orders over $400
• Express Delivery (2–3 business days): $25
• Overnight (next business day): $45
• All orders are dispatched from our warehouse within 2 business days.
• You will receive a tracking link via email once your order ships.

RETURNS
━━━━━━━━
• Returns accepted within 30 days of delivery.
• Items must be unworn, unwashed, and in original condition with all tags attached.
• To initiate a return, email returns@rarestore.com with your order number.
• Once we receive and inspect your return, a refund will be issued within 5–7 business days.
• Sale items are final sale and cannot be returned.

EXCHANGES
━━━━━━━━
• We offer free exchanges for a different size or color within 30 days.
• Contact clientservices@rarestore.com to arrange an exchange.`
  },
  'Privacy Policy': {
    title: 'Privacy Policy',
    body: `Last updated: January 2025

INFORMATION WE COLLECT
━━━━━━━━
We collect information you provide directly to us, such as your name, email address, shipping address, and payment details when you make a purchase or create an account.

HOW WE USE YOUR INFORMATION
━━━━━━━━
• To process and fulfill your orders
• To send order confirmations and shipping updates
• To respond to your questions and provide customer support
• To send promotional communications (only if you opt in)
• To improve our website and services

DATA SHARING
━━━━━━━━
We do not sell your personal data. We share information only with trusted service providers who assist in operating our business, and only as necessary.

YOUR RIGHTS
━━━━━━━━
You may request access to, correction of, or deletion of your personal data at any time by emailing privacy@rarestore.com.

COOKIES
━━━━━━━━
We use essential cookies for site functionality and optional analytics cookies to understand how visitors use our site.`
  },
  'Terms of Service': {
    title: 'Terms of Service',
    body: `Last updated: January 2025

ACCEPTANCE OF TERMS
━━━━━━━━
By accessing or purchasing from RARE Store, you agree to these terms.

PURCHASES & PAYMENT
━━━━━━━━
• All prices are listed in USD and include applicable taxes.
• Payment is due at the time of order. We accept all major credit cards and PayPal.
• We reserve the right to cancel orders that appear fraudulent or that contain pricing errors.

INTELLECTUAL PROPERTY
━━━━━━━━
All content on this site is the property of RARE Store and may not be reproduced without written permission.

CONTACT
━━━━━━━━
For questions about these terms, contact legal@rarestore.com.`
  },
  'Accessibility': {
    title: 'Accessibility',
    body: `RARE Store is committed to making our website accessible to everyone.

OUR COMMITMENT
━━━━━━━━
We strive to meet WCAG 2.1 Level AA accessibility standards. This includes:
• Sufficient color contrast throughout the site
• Keyboard navigability for all interactive elements
• Alt text for all product images
• Screen reader compatibility

GET IN TOUCH
━━━━━━━━
Email: accessibility@rarestore.com
We aim to respond within 2 business days.`
  },
  'Contact Us': {
    title: 'Contact Us',
    body: `We're here to help.

CLIENT SERVICES
━━━━━━━━
Email: clientservices@rarestore.com
Phone: +1 (212) 000-0000
Hours: Monday–Friday, 9am–6pm EST

RETURNS & EXCHANGES
━━━━━━━━
Email: returns@rarestore.com
Please include your order number in your message.

PRESS & PARTNERSHIPS
━━━━━━━━
Email: press@rarestore.com

We aim to respond to all messages within one business day.`
  },
};

const SOCIALS = [
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
      </svg>
    ),
  },
  {
    name: 'Twitter / X',
    url: 'https://x.com',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

export default function Footer({ showNotification, setCurrentPage }) {
  const [modal, setModal] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Welcome to the inner circle! Check your email.');
        e.target.reset();
      } else {
        showNotification(data.message || 'Something went wrong.', 'error');
      }
    } catch {
      showNotification('Could not subscribe. Please try again.', 'error');
    }
  };

  const goToAbout = () => {
    if (!setCurrentPage) return;
    setCurrentPage('home');
    // Give the home page time to mount before scrolling
    setTimeout(() => {
      const section = document.getElementById('about');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const goToProducts = () => {
    if (setCurrentPage) setCurrentPage('products');
  };

  return (
    <>
      {/* Info Modal */}
      {modal && (
        <div
          onClick={() => setModal(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '580px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', borderRadius: '2px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '1px', color: '#fff', margin: 0 }}>{modal.title.toUpperCase()}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '22px', lineHeight: 1, padding: '0 0 0 16px' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', padding: '28px 32px' }}>
              <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.9, whiteSpace: 'pre-line', margin: 0 }}>{modal.body}</p>
            </div>
          </div>
        </div>
      )}

      <footer id="contact" style={{ padding: '60px 16px 40px', background: '#000', margin: 0 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', marginBottom: '48px' }}>

          {/* About */}
          <div>
            <h3 style={{ fontSize: '20px', letterSpacing: '1.5px', fontWeight: 600, marginBottom: '24px' }}>ABOUT US</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.75 }}>
              RARE STORE is your destination for luxury fashion. We curate the finest designer collections from around the world.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h3 style={{ fontSize: '20px', letterSpacing: '1.5px', fontWeight: 600, marginBottom: '24px' }}>COLLECTIONS</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Dresses', 'Coats & Jackets', 'Accessories', 'Handbags', 'Shoes', 'Jewelry'].map(name => (
                <li key={name} style={{ marginBottom: '12px' }}>
                  <button
                    onClick={goToProducts}
                    style={{ color: '#9ca3af', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', transition: 'color 0.3s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = '#9ca3af'}
                  >{name}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Service */}
          <div>
            <h3 style={{ fontSize: '20px', letterSpacing: '1.5px', fontWeight: 600, marginBottom: '24px' }}>CLIENT SERVICE</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { name: 'About Us', action: goToAbout },
                { name: 'Contact Us', action: () => setModal(MODAL_CONTENT['Contact Us']) },
                { name: 'Shipping & Returns', action: () => setModal(MODAL_CONTENT['Shipping & Returns']) },
                { name: 'Privacy Policy', action: () => setModal(MODAL_CONTENT['Privacy Policy']) },
              ].map(item => (
                <li key={item.name} style={{ marginBottom: '12px' }}>
                  <button
                    onClick={item.action}
                    style={{ color: '#9ca3af', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', transition: 'color 0.3s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = '#9ca3af'}
                  >{item.name}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 style={{ fontSize: '20px', letterSpacing: '1.5px', fontWeight: 600, marginBottom: '24px' }}>NEWSLETTER</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>Subscribe to receive exclusive offers</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '24px' }}>
              <input
                type="email"
                placeholder="Email"
                required
                style={{ flex: 1, background: '#1f2937', border: '1px solid #374151', padding: '12px 16px', color: '#fff', fontSize: '14px', borderRadius: '4px 0 0 4px', outline: 'none' }}
              />
              <button
                type="submit"
                style={{ background: '#7f1d1d', border: 'none', padding: '12px 16px', color: '#fff', cursor: 'pointer', borderRadius: '0 4px 4px 0', transition: 'background 0.3s' }}
                onMouseEnter={e => e.target.style.background = '#991b1b'}
                onMouseLeave={e => e.target.style.background = '#7f1d1d'}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </button>
            </form>

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              {SOCIALS.map(social => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#7f1d1d'; e.currentTarget.style.borderColor = '#7f1d1d'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #374151', paddingTop: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
          <p style={{ margin: 0 }}>Copyright © 2025, RARE USA. All rights reserved</p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Terms of Service', key: 'Terms of Service' },
              { label: 'Privacy Policy', key: 'Privacy Policy' },
              { label: 'Accessibility', key: 'Accessibility' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => setModal(MODAL_CONTENT[item.key])}
                style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', padding: 0, transition: 'color 0.3s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#9ca3af'}
              >{item.label}</button>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}