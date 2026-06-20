import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid var(--color-border)',
      padding: '60px 0 30px 0',
      color: 'var(--text-muted)'
    }} id="about">
      <div className="container">

        {/* Columns Grid */}
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 2fr',
          gap: '40px',
          marginBottom: '40px'
        }}>

          {/* Brand Column */}
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              color: 'var(--text-dark)'
            }}>
              ASHIRI
            </h3>
            <p style={{
              fontSize: '0.85rem',
              lineHeight: 1.7,
              marginBottom: '20px',
              maxWidth: '300px'
            }}>
              Ashiri celebrating historical West African artisanal patterns blended with sophisticated modern luxury tank tops. Designed in London, handcrafted in Lagos.
            </p>
            {/* Socials */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" aria-label="Instagram" className="social-icon-link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" aria-label="Whatsapp" className="social-icon-link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.618-4.934c-.198-.1-1.17-.578-1.353-.646-.182-.068-.315-.1-.447.1-.132.2-.512.647-.628.78-.114.132-.23.149-.427.05a5.4 5.4 0 0 1-1.583-1.007 5.7 5.7 0 0 1-1.096-1.365c-.114-.197-.012-.305.087-.404.089-.09.197-.23.297-.346a1.2 1.2 0 0 0 .198-.33c.066-.134.034-.251-.017-.35-.052-.1-.447-1.077-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column 1: Shop */}
          <div>
            <h4 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-dark)',
              marginBottom: '16px'
            }}>
              Collections
            </h4>
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.85rem'
            }} className="footer-list">
              <li><a href="#collection">All Collection</a></li>
              <li><a href="#collection">Ribbed Collection</a></li>
              <li><a href="#collection">Indigo Silk Camis</a></li>
              <li><a href="#collection">Heritage Knitwear</a></li>
              <li><a href="#collection">Belgian Linen</a></li>
            </ul>
          </div>

          {/* Links Column 2: Service */}


          {/* Newsletter Column */}
          <div>
            <h4 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-dark)',
              marginBottom: '16px'
            }}>
              Ashiri Newsletter
            </h4>
            <p style={{
              fontSize: '0.85rem',
              lineHeight: 1.6,
              marginBottom: '16px'
            }}>
              Subscribe for private event invites, capsule launches, and design updates.
            </p>

            <form onSubmit={handleSubscribe} style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-premium"
                style={{
                  width: '100%',
                  paddingRight: '50px',
                  height: '42px',
                  fontSize: '0.85rem',
                  borderRadius: 'var(--radius-pill)',
                  background: '#f3f4f6'
                }}
                required
              />
              <button
                type="submit"
                aria-label="Subscribe"
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '4px',
                  height: '34px',
                  width: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  background: 'var(--text-dark)',
                  borderRadius: '50%',
                  transition: 'var(--transition-fast)'
                }}
                className="subscribe-btn"
              >
                <ArrowRight size={14} />
              </button>
            </form>

            {subscribed && (
              <span style={{
                display: 'block',
                marginTop: '8px',
                fontSize: '0.8rem',
                color: '#10b981',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                Welcome to Ashiri.
              </span>
            )}
          </div>

        </div>

        {/* Separator */}
        <div style={{
          width: '100%',
          height: '1px',
          background: 'var(--color-border)',
          marginBottom: '20px'
        }} />

        {/* Bottom footer bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.75rem'
        }}>
          <span>&copy; {new Date().getFullYear()} ASHIRI.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" className="bottom-link">Privacy</a>
            <a href="#" className="bottom-link">Terms</a>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .footer-list a:hover {
          color: var(--text-dark) !important;
          padding-left: 2px;
        }
        .footer-list a {
          transition: var(--transition-smooth);
        }
        .social-icon-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 1px solid var(--color-border);
          border-radius: 50%;
          color: var(--text-muted);
          transition: var(--transition-smooth);
        }
        .social-icon-link:hover {
          color: var(--text-dark) !important;
          border-color: var(--text-dark) !important;
          background: #f9fafb;
        }
        .subscribe-btn:hover {
          background: #1f2937 !important;
        }
        .bottom-link:hover {
          color: var(--text-dark) !important;
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 30px;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 20px;
          }
        }
      `}} />
    </footer>
  );
};

export default Footer;
