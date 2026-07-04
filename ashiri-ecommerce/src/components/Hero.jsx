import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';
import ribbedTank from '../assets/ribbed_tank.png';
import silkTank from '../assets/silk_tank.png';
import knitTank from '../assets/knit_tank.png';
import linenTank from '../assets/linen_tank.png';

const slides = [
  {
    tag: 'NEW COLLECTION',
    title: 'THE OBA RIBBED TANK',
    subtitle: '20% OFF',
    desc: 'Crafted from ultra-soft, heavy-weight organic rib-knit cotton.',
    image: ribbedTank,
    bg: '#dbeafe', // Soft light blue-grey banner backdrop
    color: '#0f172a',
    link: '#collection',
    buttonText: 'SHOP UNISEX'
  },
  {
    tag: 'ARTISANAL LUXURY',
    title: 'THE ADIRE SILK CAMI',
    subtitle: 'YORUBA INDIGO',
    desc: 'Yoruba artisan hand-dyed mulberry silk camisole.',
    image: silkTank,
    bg: '#e0e7ff', // Soft indigo background
    color: '#1e1b4b',
    link: '#collection',
    buttonText: 'SHOP WOMEN'
  },
  {
    tag: 'EXCLUSIVE CROCHET',
    title: 'HERITAGE KNIT VEST',
    subtitle: 'HAND-CRAFTED',
    desc: 'Meticulously hand-knitted crochet vest inspired by history.',
    image: knitTank,
    bg: '#ffedd5', // Soft warm terracotta/orange-white
    color: '#431407',
    link: '#collection',
    buttonText: 'SHOP CROCHET'
  },
  {
    tag: 'SUMMER SOPHISTICATION',
    title: 'SAFARI LINEN TANK',
    subtitle: 'BELGIAN LINEN',
    desc: 'Belgian linen tank offering exceptional breathability.',
    image: linenTank,
    bg: '#f5f5f4', // Soft warm stone background
    color: '#1c1917',
    link: '#collection',
    buttonText: 'SHOP LINEN'
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayTimer = useRef(null);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const stopAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }
  };

  useEffect(() => {
    if (!isPaused) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
    return () => stopAutoplay();
  }, [isPaused, currentSlide]);

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const selectSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section 
      style={{ padding: '24px 0 12px 0', background: 'var(--bg-main)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        
        {/* Banner Layout Wrapper */}
        <div style={{
          position: 'relative',
          width: '100%',
          minHeight: '340px',
          height: '400px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-subtle)',
        }} className="hero-slider-container">

          {/* Slides Container */}
          {slides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: slide.bg,
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  alignItems: 'center',
                  padding: '30px 60px',
                  opacity: isActive ? 1 : 0,
                  visibility: isActive ? 'visible' : 'hidden',
                  transition: 'opacity 0.8s ease-in-out, visibility 0.8s ease-in-out',
                  zIndex: isActive ? 1 : 0,
                  boxSizing: 'border-box'
                }}
                className={`hero-slide-pane ${isActive ? 'active' : ''}`}
              >
                {/* Left Text Column */}
                <div style={{
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: '100%',
                  transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, opacity 0.6s ease 0.2s'
                }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: slide.color,
                    marginBottom: '8px'
                  }}>
                    {slide.tag}
                  </span>
                  
                  <h1 style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: slide.color,
                    marginBottom: '8px',
                    letterSpacing: '-0.04em'
                  }}>
                    {slide.title}
                  </h1>

                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: slide.color,
                    opacity: 0.8,
                    marginBottom: '12px'
                  }}>
                    {slide.subtitle}
                  </h2>

                  <p style={{
                    fontSize: '0.9rem',
                    color: slide.color,
                    opacity: 0.7,
                    marginBottom: '20px',
                    maxWidth: '380px',
                    lineHeight: '1.4'
                  }}>
                    {slide.desc}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <a 
                      href={slide.link} 
                      className="btn-solid-dark" 
                      style={{
                        background: '#000000',
                        color: '#ffffff',
                        padding: '12px 28px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        borderRadius: 'var(--radius-pill)',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      {slide.buttonText}
                    </a>

                    <a 
                      href="#gallery" 
                      className="hero-gallery-link"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#000000',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        borderBottom: '1.5px solid #000000',
                        paddingBottom: '2px',
                        transition: 'var(--transition-fast)',
                      }}
                    >
                      <Image size={14} /> Lookbook Gallery
                    </a>
                  </div>
                </div>

                {/* Right Image Column */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  pointerEvents: 'none'
                }} className="hero-image-wrap">
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    style={{
                      width: 'auto',
                      height: '95%',
                      maxHeight: '380px',
                      objectFit: 'contain',
                      transform: isActive ? 'scale(1.05) translateY(0)' : 'scale(0.95) translateY(20px)',
                      opacity: isActive ? 1 : 0,
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.8s ease 0.1s',
                      transformOrigin: 'bottom right'
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.7)',
              color: '#000000',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            className="hero-arrow-btn"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.7)',
              color: '#000000',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            className="hero-arrow-btn"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slide dots and indicator */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => selectSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: idx === currentSlide ? '24px' : '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-pill)',
                  background: idx === currentSlide ? '#000000' : 'rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Hero styles and queries */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1024px) {
          .hero-slide-pane {
            padding: 30px 40px !important;
          }
          .hero-image-wrap img {
            max-height: 300px !important;
          }
        }
        @media (max-width: 768px) {
          .hero-slider-container {
            height: auto !important;
            min-height: 500px !important;
          }
          .hero-slide-pane {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: flex-start !important;
            padding: 30px 24px 40px 24px !important;
          }
          .hero-slide-pane > div:first-child {
            height: auto !important;
            margin-bottom: 24px !important;
          }
          .hero-image-wrap {
            position: relative !important;
            width: 100% !important;
            height: 200px !important;
            display: flex !important;
            justify-content: center !important;
            align-items: flex-end !important;
            right: auto !important;
            bottom: auto !important;
          }
          .hero-image-wrap img {
            height: 100% !important;
            width: auto !important;
            max-height: 200px !important;
            transform: scale(1) !important;
            transform-origin: bottom center !important;
          }
          .hero-arrow-btn {
            width: 32px !important;
            height: 32px !important;
          }
        }
        
        .hero-arrow-btn:hover {
          background: #ffffff !important;
          color: #000000 !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
          transform: translateY(-50%) scale(1.05) !important;
        }

        .btn-solid-dark:hover {
          background: #1f2937 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .hero-gallery-link:hover {
          color: #374151 !important;
          border-color: #374151 !important;
          transform: translateX(2px);
        }
      `}} />
    </section>
  );
};

export default Hero;
