import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import greytank from '../assets/gallery/greytank.jpg';
import greytank4 from '../assets/gallery/greytank4.jpg';
import purpletank from '../assets/gallery/purpletank2.jpg';
import redtank from '../assets/gallery/redtank3.jpg';
import whitetank from '../assets/gallery/whitetank2.jpg';


const galleryItems = [
  {
    image: greytank4,
  },
  {
    image: purpletank,
  },
  {
    image: redtank,
  },
  {
    image: whitetank,
  },

];

const Gallery = ({ onViewGallery }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" style={{ padding: '60px 0', background: 'var(--bg-main)' }}>
      <div className="container">

        {/* Header Block */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>

          <h2 style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--text-dark)',
            letterSpacing: '-0.03em',
            marginBottom: '12px'
          }}>
            Gallery
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            maxWidth: '540px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Explore Our Beautiful Collection
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="lookbook-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px'
        }}>
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="gallery-card"
              onClick={() => setLightboxIndex(idx)}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                aspectRatio: '3/4',
                cursor: 'pointer',
                background: '#e5e7eb',
                boxShadow: 'var(--shadow-subtle)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}
                className="gallery-img"
              />

              {/* Overlay */}
              <div
                className="gallery-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)',
                  opacity: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '24px',
                  boxSizing: 'border-box',
                  transition: 'opacity 0.4s ease',
                  color: '#ffffff'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }} className="zoom-icon">
                  <Maximize2 size={14} />
                </div>

                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '6px'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.4',
                  margin: 0
                }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Archive Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
          <button
            onClick={onViewGallery}
            style={{
              padding: '14px 36px',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#ffffff',
              background: 'var(--color-accent)',
              borderRadius: 'var(--radius-pill)',
              boxShadow: 'var(--shadow-subtle)',
              transition: 'var(--transition-smooth)'
            }}
            className="explore-btn"
          >
            Explore Full Archive
          </button>
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.95)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              color: '#ffffff',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              transition: 'background 0.2s ease'
            }}
            className="lightbox-close"
          >
            <X size={20} />
          </button>

          {/* Navigation Controls */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            style={{
              position: 'absolute',
              left: '24px',
              color: '#ffffff',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              transition: 'background 0.2s'
            }}
            className="lightbox-arrow lightbox-prev"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            style={{
              position: 'absolute',
              right: '24px',
              color: '#ffffff',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              transition: 'background 0.2s'
            }}
            className="lightbox-arrow lightbox-next"
          >
            <ChevronRight size={24} />
          </button>

          {/* Lightbox Content Wrap */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '85vw',
              maxHeight: '80vh',
              color: '#ffffff'
            }}
          >
            <img
              src={galleryItems[lightboxIndex].image}
              alt={galleryItems[lightboxIndex].title}
              style={{
                maxWidth: '100%',
                maxHeight: '65vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                marginBottom: '20px'
              }}
            />

            <div style={{ textAlign: 'center', maxWidth: '500px' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '8px',
                letterSpacing: '-0.02em'
              }}>
                {galleryItems[lightboxIndex].title}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#cccccc',
                lineHeight: '1.5',
                margin: 0
              }}>
                {galleryItems[lightboxIndex].desc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Local responsive styling */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .explore-btn:hover {
          background: #1f2937 !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-medium);
        }
        .lightbox-close:hover, .lightbox-arrow:hover {
          background: rgba(255, 255, 255, 0.2) !important;
        }
        @media (max-width: 1024px) {
          .lookbook-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 768px) {
          .gallery-overlay {
            opacity: 1 !important;
            background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 70%) !important;
          }
          .zoom-icon {
            display: none !important;
          }
          .lightbox-arrow {
            width: 40px !important;
            height: 40px !important;
          }
          .lightbox-prev {
            left: 12px !important;
          }
          .lightbox-next {
            right: 12px !important;
          }
          .lightbox-close {
            top: 16px !important;
            right: 16px !important;
            width: 36px !important;
            height: 36px !important;
          }
        }
        @media (max-width: 600px) {
          .lookbook-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}} />
    </section>
  );
};

export default Gallery;
