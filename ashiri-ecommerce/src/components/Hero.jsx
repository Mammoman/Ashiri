import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Hero = () => {
  const { galleryImages } = useAdmin();
  
  // Filter for 'campaign' folder, fallback to any images if none exist
  const campaignImages = galleryImages.filter(img => img.folder === 'campaign');
  const fallbackImages = galleryImages.length > 0 ? galleryImages : [];
  const activeImages = campaignImages.length > 0 ? campaignImages : fallbackImages;
  
  const slides = activeImages.map(img => ({ image: img.url, position: 'center' }));

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayTimer = useRef(null);

  const goToSlide = (idx) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(idx);
    setTimeout(() => setIsTransitioning(false), 900);
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (slides.length <= 1) return; // Don't autoplay if 0 or 1 slide
    autoplayTimer.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
  };

  const stopAutoplay = () => {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
  };

  useEffect(() => {
    if (!isPaused && slides.length > 1) startAutoplay();
    else stopAutoplay();
    return () => stopAutoplay();
  }, [isPaused, currentSlide, slides.length]);

  const handleNext = (e) => {
    e.stopPropagation();
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
  };

  return (
    <section
      className="hero-fullscreen"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, idx) => {
        const isActive = idx === currentSlide;
        return (
          <div
            key={idx}
            className={`hero-slide ${isActive ? 'hero-slide--active' : ''}`}
            aria-hidden={!isActive}
          >
            {/* Full-bleed background image */}
            <div
              className="hero-slide__bg"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundPosition: slide.position === 'top' ? 'center 15%' : 'center center',
              }}
            />

            {/* Dark gradient overlay */}
            <div className="hero-slide__overlay" />

            {/* Centred Ashiri wordmark — bottom-left */}
            <div className={`hero-wordmark ${isActive ? 'hero-wordmark--visible' : ''}`}>
              <span className="hero-wordmark__text">Ashiri</span>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="hero-arrow hero-arrow--left"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="hero-arrow hero-arrow--right"
      >
        <ChevronRight size={22} />
      </button>

      {/* Slide counter + dots */}
      <div className="hero-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`hero-dot ${idx === currentSlide ? 'hero-dot--active' : ''}`}
          />
        ))}
      </div>

      {/* Slide counter label */}
      <div className="hero-counter">
        <span className="hero-counter__current">
          {String(currentSlide + 1).padStart(2, '0')}
        </span>
        <span className="hero-counter__sep" />
        <span className="hero-counter__total">
          {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .hero-fullscreen {
            position: relative;
            width: 100%;
            height: calc(100vh - 80px);
            min-height: 500px;
            overflow: hidden;
            background: #0a0a0a;
          }

          /* ---- Slide base ---- */
          .hero-slide {
            position: absolute;
            inset: 0;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.9s ease-in-out, visibility 0.9s ease-in-out;
            z-index: 0;
          }
          .hero-slide--active {
            opacity: 1;
            visibility: visible;
            z-index: 1;
          }

          /* ---- Background image ---- */
          .hero-slide__bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-repeat: no-repeat;
            transform: scale(1.05);
            transition: transform 7s ease-out;
          }
          .hero-slide--active .hero-slide__bg {
            transform: scale(1);
          }

          /* ---- Gradient overlay — strong bottom dark for legibility ---- */
          .hero-slide__overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.88) 0%,
              rgba(0, 0, 0, 0.55) 30%,
              rgba(0, 0, 0, 0.18) 60%,
              rgba(0, 0, 0, 0.06) 100%
            );
          }

          /* ---- Text content (legacy, unused) ---- */
          .hero-slide__content {
            position: absolute;
            bottom: 90px;
            left: 60px;
            right: 60px;
            z-index: 2;
            color: #ffffff;
            opacity: 0;
            transform: translateY(28px);
            transition: opacity 0.7s ease 0.3s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s;
          }

          /* ---- Ashiri wordmark — bottom-left ---- */
          .hero-wordmark {
            position: absolute;
            bottom: 64px;
            left: 52px;
            z-index: 2;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease 0.3s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s;
            pointer-events: none;
          }
          .hero-wordmark--visible {
            opacity: 1;
            transform: translateY(0);
          }
          .hero-wordmark__text {
            font-size: clamp(3rem, 7vw, 7rem);
            font-weight: 800;
            letter-spacing: -0.05em;
            color: rgba(255, 255, 255, 0.96);
            text-shadow: 0 2px 24px rgba(0,0,0,0.55);
            line-height: 1;
            font-family: var(--font-body);
            user-select: none;
          }

          /* ---- Navigation arrows ---- */
          .hero-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.25);
            color: #ffffff;
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }
          .hero-arrow--left { left: 24px; }
          .hero-arrow--right { right: 24px; }
          .hero-arrow:hover {
            background: rgba(255,255,255,0.28);
            transform: translateY(-50%) scale(1.08);
          }

          /* ---- Dots ---- */
          .hero-dots {
            position: absolute;
            bottom: 32px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            display: flex;
            gap: 8px;
            align-items: center;
          }
          .hero-dot {
            height: 3px;
            border-radius: 2px;
            background: rgba(255,255,255,0.35);
            transition: all 0.3s ease;
            width: 20px;
          }
          .hero-dot--active {
            background: #ffffff;
            width: 44px;
          }

          /* ---- Counter ---- */
          .hero-counter {
            position: absolute;
            bottom: 28px;
            right: 60px;
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            color: rgba(255,255,255,0.6);
          }
          .hero-counter__current {
            color: #ffffff;
            font-size: 0.85rem;
          }
          .hero-counter__sep {
            display: inline-block;
            width: 20px;
            height: 1px;
            background: rgba(255,255,255,0.4);
          }

          /* ---- Responsive ---- */
          @media (max-width: 768px) {
            .hero-fullscreen {
              height: 85vh;
              min-height: 480px;
            }
            .hero-wordmark {
              bottom: 52px;
              left: 24px;
            }
            .hero-wordmark__text {
              font-size: clamp(2.8rem, 13vw, 5rem);
            }
            .hero-dots { left: 50%; transform: translateX(-50%); }
            .hero-counter { right: 24px; }
            .hero-arrow--left { left: 12px; }
            .hero-arrow--right { right: 12px; }
            .hero-arrow { width: 38px; height: 38px; }
          }
        `
      }} />
    </section>
  );
};

export default Hero;
