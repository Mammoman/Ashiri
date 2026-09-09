import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <div className="app-wrapper">
      <Helmet>
        <title>Privacy Policy — ÀṢHÍRÍ</title>
      </Helmet>
      <Navbar cartCount={0} onOpenCart={() => { window.location.href = '/'; }} />
      <main style={{ padding: '120px 20px 60px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-dark)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: 700 }}>Privacy Policy</h1>
        <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 style={{ marginTop: '24px', fontSize: '1.2rem', fontWeight: 600 }}>1. Information We Collect</h2>
        <p style={{ marginTop: '8px', lineHeight: 1.6 }}>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
        
        <h2 style={{ marginTop: '24px', fontSize: '1.2rem', fontWeight: 600 }}>2. How We Use Information</h2>
        <p style={{ marginTop: '8px', lineHeight: 1.6 }}>We may use the information we collect to provide, maintain, and improve our services, including to process transactions, send related information, and enhance the user experience on the ÀṢHÍRÍ storefront.</p>
        
        <h2 style={{ marginTop: '24px', fontSize: '1.2rem', fontWeight: 600 }}>3. Information Sharing</h2>
        <p style={{ marginTop: '8px', lineHeight: 1.6 }}>We do not share your personal information with third parties except as necessary to provide our services (e.g., payment processing via Flutterwave) or as required by law.</p>

        <h2 style={{ marginTop: '24px', fontSize: '1.2rem', fontWeight: 600 }}>4. Cookies</h2>
        <p style={{ marginTop: '8px', lineHeight: 1.6 }}>We use cookies and similar technologies to track activity on our service and hold certain information to enhance your experience. You can instruct your browser to refuse all cookies.</p>
      </main>
      <Footer />
    </div>
  );
}
