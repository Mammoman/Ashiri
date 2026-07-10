import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, ArrowLeft } from 'lucide-react';

// Import all unique images present in the codebase
import Image1 from '../assets/Image1.jpg';
import Image3 from '../assets/Image3.jpg';
import greytank from '../assets/greytank.jpg';
import purpletank from '../assets/purpletank.jpg';
import redtank5 from '../assets/redtank5.jpg';
import whitetank3 from '../assets/whitetank3.jpg';

import greytankGallery from '../assets/gallery/greytank.jpg';
import purpletankGallery from '../assets/gallery/purpletank.jpg';
import purpletank2Gallery from '../assets/gallery/purpletank2.jpg';
import redtank3Gallery from '../assets/gallery/redtank3.jpg';
import redtank4Gallery from '../assets/gallery/redtank4.jpg';
import whitetankGallery from '../assets/gallery/whitetank.jpg';
import whitetank2Gallery from '../assets/gallery/whitetank2.jpg';

const galleryItems = [
  { image: Image1, type: 'large', title: 'The Ashiri Silhouette', category: 'Editorial' },
  { image: Image3, type: 'wide', title: 'Lagos Atelier', category: 'Behind The Scenes' },
  { image: purpletank2Gallery, type: 'tall', title: 'Heritage Knit Detail', category: 'Textures' },
  { image: purpletank, type: 'normal', title: 'Purple Rib Knit', category: 'Lookbook' },
  { image: greytank, type: 'tall', title: 'Minimalist Drape', category: 'Lookbook' },
  { image: redtank3Gallery, type: 'normal', title: 'Botanical Dye Tone', category: 'Colorway' },
  { image: redtank4Gallery, type: 'large', title: 'Adire Indigo Cami', category: 'Craftsmanship' },
  { image: whitetankGallery, type: 'normal', title: 'Belgian Linen', category: 'Fabrication' },
  { image: whitetank3, type: 'wide', title: 'Organic Cotton Tank', category: 'Essentials' },
  { image: redtank5, type: 'normal', title: 'Clay Terracotta', category: 'Lookbook' },
  { image: whitetank2Gallery, type: 'tall', title: 'Artisanal Modernism', category: 'Editorial' },
  { image: greytankGallery, type: 'normal', title: 'Grey Rib Cami', category: 'Essentials' },
  { image: purpletankGallery, type: 'normal', title: 'Sunset Silhouette', category: 'Lookbook' }
];

const GalleryPage = ({ onBackToShop }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

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
            Lookbook Gallery
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
              className={`masonry-item ${item.type}`}
              onClick={() => setLightboxIndex(idx)}
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="masonry-img"
              />
              <div className="masonry-overlay">
                <span className="masonry-category">{item.category}</span>
                <h3 className="masonry-title">{item.title}</h3>
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
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#a78bfa',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                display: 'block',
                marginBottom: '6px'
              }}>
                {filteredItems[lightboxIndex].category}
              </span>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '4px',
                letterSpacing: '-0.02em'
              }}>
                {filteredItems[lightboxIndex].title}
              </h3>
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
            grid-auto-rows: 240px;
            gap: 20px;
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
            padding: 24px;
            color: #ffffff;
            opacity: 0;
            transition: opacity 0.4s ease;
          }

          .masonry-item:hover .masonry-overlay {
            opacity: 1;
          }

          .masonry-category {
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 6px;
          }

          .masonry-title {
            font-size: 1.1rem;
            fontWeight: 700;
            color: #ffffff;
            letter-spacing: -0.02em;
            margin: 0;
          }

          .masonry-zoom {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.25s ease;
          }

          .masonry-item:hover .masonry-zoom {
            background: rgba(255, 255, 255, 0.3);
          }

          @media (max-width: 1024px) {
            .masonry-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              grid-auto-rows: 200px !important;
              gap: 16px !important;
            }
            .masonry-item.large {
              grid-column: span 2 !important;
              grid-row: span 2 !important;
            }
            .masonry-item.wide {
              grid-column: span 2 !important;
            }
            .masonry-item.tall {
              grid-row: span 2 !important;
            }
          }

          @media (max-width: 640px) {
            .masonry-grid {
              grid-template-columns: 1fr !important;
              grid-auto-rows: 220px !important;
              gap: 12px !important;
            }
            .masonry-item.wide, .masonry-item.large, .masonry-item.tall {
              grid-column: span 1 !important;
              grid-row: span 1 !important;
            }
          }
        `
      }} />
    </div>
  );
};

export default GalleryPage;
