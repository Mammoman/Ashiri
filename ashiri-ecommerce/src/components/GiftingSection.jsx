import React, { useState } from 'react';
import { Gift, Package, Sparkles, Heart, ArrowRight } from 'lucide-react';

const giftOptions = [
  {
    icon: Gift,
    title: 'Gift Cards',
    desc: 'Let them choose their perfect piece. Digital gift cards from ₦5,000 to ₦100,000 — delivered instantly to any inbox.',
    cta: 'Get a Gift Card',
    accent: '#7c3aed',
    bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
  },
  {
    icon: Package,
    title: 'Luxury Gift Wrapping',
    desc: 'Every order, wrapped in our signature matte kraft box, ribbon-tied with a personalised handwritten note.',
    cta: 'Add Gift Wrapping',
    accent: '#d97706',
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
  },
  {
    icon: Sparkles,
    title: 'Curated Gift Sets',
    desc: 'Thoughtfully curated pairings — from the tank + accessory bundle to full Ashiri starter sets.',
    cta: 'Browse Gift Sets',
    accent: '#0891b2',
    bg: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
  },
];

const GiftingSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section id="gifting" style={{ padding: '80px 0', background: 'var(--bg-main)' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '14px',
          }}>
            <Heart size={12} fill="currentColor" /> GIFTING
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--text-dark)',
            lineHeight: 1.1,
            marginBottom: '14px',
          }}>
            Gift the Art of Dressing
          </h2>
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Whether you're celebrating a birthday, anniversary, or just want to show someone you care —
            Ashiri  makes gifting effortless and unforgettable.
          </p>
        </div>

        {/* Gift Option Cards */}
        <div className="gifting-grid">
          {giftOptions.map((option, idx) => {
            const Icon = option.icon;
            const isHovered = hoveredCard === idx;
            return (
              <div
                key={idx}
                className="gifting-card"
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: option.bg,
                  borderRadius: 'var(--radius-md)',
                  padding: '36px 32px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: isHovered
                    ? '0 20px 40px rgba(0,0,0,0.09)'
                    : 'var(--shadow-subtle)',
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  cursor: 'pointer',
                }}
              >
                {/* Decorative circle */}
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: option.accent,
                  opacity: 0.07,
                  transition: 'transform 0.4s ease',
                  transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                }} />

                {/* Icon badge */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: option.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '22px',
                  boxShadow: `0 8px 20px ${option.accent}30`,
                }}>
                  <Icon size={24} color="#ffffff" />
                </div>

                {/* Content */}
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  marginBottom: '10px',
                  letterSpacing: '-0.02em',
                }}>
                  {option.title}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.65,
                  marginBottom: '24px',
                }}>
                  {option.desc}
                </p>

                {/* CTA */}
                <a
                  href="#collection"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: option.accent,
                    transition: 'gap 0.2s ease',
                  }}
                  className="gifting-cta-link"
                >
                  {option.cta} <ArrowRight size={13} />
                </a>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div style={{
          marginTop: '48px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: 'clamp(28px, 5vw, 48px) clamp(24px, 6vw, 60px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-20px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            right: '120px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              marginBottom: '8px',
            }}>
              Personalised gifting for every occasion
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: '440px',
              lineHeight: 1.5,
            }}>
              Need a bespoke gift package? Our  team can craft a personalised gift experience
              — just reach out and we'll handle the rest.
            </p>
          </div>

          <a
            href="mailto:ashiri@gmail.com"
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 30px',
              background: '#ffffff',
              color: '#000000',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease',
              position: 'relative',
              zIndex: 1,
              whiteSpace: 'nowrap',
            }}
            className="gifting-contact-btn"
          >
            <Heart size={14} /> Contact
          </a>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .gifting-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }

          .gifting-cta-link:hover {
            gap: 10px !important;
          }

          .gifting-contact-btn:hover {
            background: #f1f5f9 !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(255,255,255,0.15);
          }

          @media (max-width: 900px) {
            .gifting-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 600px) {
            .gifting-grid {
              grid-template-columns: 1fr;
            }
          }
        `
      }} />
    </section>
  );
};

export default GiftingSection;
