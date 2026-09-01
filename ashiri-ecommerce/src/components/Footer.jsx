import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

const Footer = ({ onPageChange }) => {
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

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    if (onPageChange) {
      onPageChange('shop');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
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
            <h3
              onClick={(e) => handleLinkClick(e, 'collection')}
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
                color: 'var(--text-dark)',
                cursor: 'pointer'
              }}
            >
              ASHIRI
            </h3>
            <p style={{
              fontSize: '0.85rem',
              lineHeight: 1.7,
              marginBottom: '20px',
              maxWidth: '300px'
            }}>
              Ashiri is just about sharing beautiful designs with the world.
            </p>
            {/* Socials */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://www.instagram.com/ashiri.ng?igsi=MWNoODlieGozMnI0Mw%3D%3D" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon-link">
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
              <a href="https://www.tiktok.com/@weloveashiri?_r=1&_t=ZS-99NAsIuX2M1" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="social-icon-link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                >
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
                </svg>
              </a>
            </div>
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
