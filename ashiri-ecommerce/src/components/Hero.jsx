import React from 'react';
import ribbedTank from '../assets/ribbed_tank.png'; // High-end model/clothing graphic

const Hero = () => {
  return (
    <section style={{ padding: '24px 0 12px 0', background: 'var(--bg-main)' }}>
      <div className="container">
        
        {/* Banner Layout */}
        <div style={{
          position: 'relative',
          width: '100%',
          minHeight: '260px',
          background: '#dbeafe', // Soft light blue-grey banner backdrop matching mockup
          borderRadius: 'var(--radius-md)',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          alignItems: 'center',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-subtle)',
          padding: '30px 40px'
        }} className="hero-banner">
          
          {/* Left Text Column */}
          <div style={{
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%'
          }}>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--text-dark)',
              marginBottom: '6px'
            }}>
              NEW COLLECTIONS
            </span>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: 'var(--text-dark)',
              marginBottom: '16px',
              letterSpacing: '-0.04em'
            }}>
              20% <span style={{ fontSize: '1.5rem', fontWeight: 600, verticalAlign: 'super' }}>OFF</span>
            </h1>
            
            <a 
              href="#collection" 
              className="btn-solid-dark" 
              style={{
                alignSelf: 'flex-start',
                background: '#000000',
                color: '#ffffff',
                padding: '10px 24px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                borderRadius: 'var(--radius-pill)',
                transition: 'var(--transition-fast)'
              }}
            >
              SHOP NOW
            </a>
          </div>

          {/* Right Image Column */}
          <div style={{
            position: 'absolute',
            right: '20px',
            bottom: 0,
            width: '45%',
            height: '110%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            overflow: 'hidden',
            pointerEvents: 'none'
          }} className="hero-image-wrap">
            <img 
              src={ribbedTank} 
              alt="Model wearing collection" 
              style={{
                width: 'auto',
                height: '100%',
                maxHeight: '320px',
                objectFit: 'contain',
                transform: 'scale(1.1) translateY(10px)',
                transformOrigin: 'bottom'
              }}
            />
          </div>

        </div>

      </div>

      {/* Hero media queries */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 600px) {
          .hero-banner {
            grid-template-columns: 1fr !important;
            padding: 24px !important;
            min-height: 200px !important;
          }
          .hero-image-wrap {
            width: 50% !important;
            height: 100% !important;
            opacity: 0.8 !important;
            right: 0 !important;
          }
        }
        .btn-solid-dark:hover {
          background: #1f2937 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}} />
    </section>
  );
};

export default Hero;
