import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function TermsOfService() {
  return (
    <div className="app-wrapper">
      <Helmet>
        <title>Terms of Service — ÀṢHÍRÍ</title>
      </Helmet>
      <Navbar cartCount={0} onOpenCart={() => { window.location.href = '/'; }} />
      <main style={{ padding: '120px 20px 60px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-dark)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: 700 }}>Terms of Service</h1>
        <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 style={{ marginTop: '24px', fontSize: '1.2rem', fontWeight: 600 }}>1. Agreement to Terms</h2>
        <p style={{ marginTop: '8px', lineHeight: 1.6 }}>By accessing or using ÀṢHÍRÍ's website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.</p>
        
        <h2 style={{ marginTop: '24px', fontSize: '1.2rem', fontWeight: 600 }}>2. Intellectual Property</h2>
        <p style={{ marginTop: '8px', lineHeight: 1.6 }}>All content on this website, including but not limited to text, graphics, logos, images, and clothing designs is the exclusive property of ÀṢHÍRÍ and is protected by copyright laws.</p>
        
        <h2 style={{ marginTop: '24px', fontSize: '1.2rem', fontWeight: 600 }}>3. Purchases and Payment</h2>
        <p style={{ marginTop: '8px', lineHeight: 1.6 }}>We accept payments securely via Flutterwave. By providing payment information, you represent and warrant that the information is accurate and you are authorized to use the designated payment method.</p>

        <h2 style={{ marginTop: '24px', fontSize: '1.2rem', fontWeight: 600 }}>4. Shipping and Returns</h2>
        <p style={{ marginTop: '8px', lineHeight: 1.6 }}>All artisanal pieces are made with care. Shipping costs vary by location and will be calculated at checkout. For returns, please contact our support team within 7 days of receiving your order.</p>

        <h2 style={{ marginTop: '24px', fontSize: '1.2rem', fontWeight: 600 }}>5. Guest Orders and Tracking</h2>
        <p style={{ marginTop: '8px', lineHeight: 1.6 }}>ÀṢHÍRÍ operates without traditional user accounts to provide a seamless checkout experience. Your order history and tracking capabilities are linked directly to the device and browser you used to make the purchase. If you clear your browser history or use a different device, you will need to rely on your email receipts for order information.</p>
      </main>
      <Footer />
    </div>
  );
}
