import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ashiri_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      maxWidth: '400px',
      background: '#111827',
      color: '#ffffff',
      padding: '16px 20px',
      borderRadius: '8px',
      zIndex: 9999,
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      animation: 'slideUp 0.3s ease-out'
    }}>
      <p style={{ fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>
        We use cookies to improve your experience on our site. By continuing to use our site, you agree to our <a href="/privacy" style={{color: '#60a5fa', textDecoration: 'underline'}}>Privacy Policy</a>.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button 
          onClick={() => { localStorage.setItem('ashiri_cookie_consent', 'rejected'); setShow(false); }}
          style={{ background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Reject
        </button>
        <button 
          onClick={() => { localStorage.setItem('ashiri_cookie_consent', 'true'); setShow(false); }}
          style={{ background: '#ffffff', color: '#111827', border: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
