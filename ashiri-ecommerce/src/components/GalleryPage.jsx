import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, ArrowLeft } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const GalleryPage = ({ onBackToShop }) => {
  const { galleryImages } = useAdmin();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Show all images as a flat gallery
  const galleryItems = galleryImages.map(img => ({
    image: img.url,
  }));

  const filteredItems = galleryItems;

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
  }, [lightboxIndex, filteredItems]);

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ padding: '40px 0 80px 0', background: 'var(--bg-main)', minHeight: 'calc(100vh - 70px)' }}>
      <div className="container">

        {/* Header Block */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '48px' }}>
          <button
            onClick={onBackToShop}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            className="back-btn"
          >
            <ArrowLeft size={14} /> Back to Shop
          </button>

          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            display: 'block',
            marginBottom: '10px'
          }}>
            ASIRI VISUAL ARCHIVE
          </span>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: 'var(--text-dark)',
            letterSpacing: '-0.04em',
            marginBottom: '14px',
            lineHeight: 1.1
          }}>
            Gallery
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            maxWidth: '560px',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}>
            A curated visual history of our slow-fashion garments, textures, Lagos studio vats, and editorial drapes.
          </p>

          {/* Filter Bar removed per user request */}
        </div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className={`masonry-item ${item.type || ''}`}
              onClick={() => setLightboxIndex(idx)}
            >
              <img
                src={item.image}
                alt={`Gallery ${idx}`}
                className="masonry-img"
              />
              <div className="masonry-overlay">
                <div className="masonry-zoom">
                  <Maximize2 size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(10, 10, 10, 0.98)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="lightbox-close"
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              color: '#ffffff',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              zIndex: 3010
            }}
          >
            <X size={20} />
          </button>

          {/* Navigation Controls */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="lightbox-arrow lightbox-prev"
            style={{
              position: 'absolute',
              left: '24px',
              color: '#ffffff',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '50%',
              width: '52px',
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              zIndex: 3010
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="lightbox-arrow lightbox-next"
            style={{
              position: 'absolute',
              right: '24px',
              color: '#ffffff',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '50%',
              width: '52px',
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              zIndex: 3010
            }}
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
              maxHeight: '85vh',
              color: '#ffffff',
              position: 'relative'
            }}
          >
            <img
              src={filteredItems[lightboxIndex].image}
              alt={filteredItems[lightboxIndex].title}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                marginBottom: '20px'
              }}
            />

            <div style={{ textAlign: 'center', maxWidth: '600px' }}>
              <span style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 600,
                letterSpacing: '0.1em'
              }}>
                {lightboxIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Masonry CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .back-btn:hover {
            color: var(--text-dark) !important;
            transform: translateX(-2px);
          }

          .masonry-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: min(240px, 22vw);
            gap: clamp(8px, 1.8vw, 20px);
          }

          .masonry-item {
            position: relative;
            overflow: hidden;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-subtle);
            background: #f4f3f0;
            cursor: pointer;
          }

          .masonry-item.wide {
            grid-column: span 2;
          }

          .masonry-item.tall {
            grid-row: span 2;
          }

          .masonry-item.large {
            grid-column: span 2;
            grid-row: span 2;
          }

          .masonry-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .masonry-item:hover .masonry-img {
            transform: scale(1.04);
          }

          .masonry-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(10, 10, 10, 0.85) 0%, rgba(10, 10, 10, 0.2) 60%, rgba(10, 10, 10, 0) 100%);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: clamp(8px, 2vw, 24px);
            color: #ffffff;
            opacity: 0;
            transition: opacity 0.4s ease;
          }

          .masonry-item:hover .masonry-overlay {
            opacity: 1;
          }

          .masonry-category {
            font-size: clamp(0.55rem, 1vw, 0.65rem);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 6px;
          }

          .masonry-title {
            font-size: clamp(0.7rem, 1.5vw, 1.1rem);
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.02em;
            margin: 0;
          }

          .masonry-zoom {
            position: absolute;
            top: clamp(8px, 2vw, 20px);
            right: clamp(8px, 2vw, 20px);
            width: clamp(20px, 3.5vw, 36px);
            height: clamp(20px, 3.5vw, 36px);
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.25s ease;
          }

          .masonry-zoom svg {
            width: clamp(10px, 1.8vw, 16px) !important;
            height: clamp(10px, 1.8vw, 16px) !important;
          }

          .masonry-item:hover .masonry-zoom {
            background: rgba(255, 255, 255, 0.3);
          }

          /* Keep 4-column masonry layout on mobile, touch, and desktop */
          @media (max-width: 768px) {
            .masonry-overlay {
              opacity: 1 !important;
            }
            .masonry-zoom {
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
        `
      }} />
    </div>
  );
};

export default GalleryPage;
