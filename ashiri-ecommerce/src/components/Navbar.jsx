import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ArrowLeft } from 'lucide-react';

const Navbar = ({ cartCount, onCartClick, searchQuery, onSearchChange }) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <nav className="glass-navbar" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      transition: 'var(--transition-smooth)',
      background: '#ffffff',
      borderBottom: '1px solid var(--color-border)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        {/* Left Side: Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: 'var(--text-dark)'
          }}>
            ASHIRI
          </span>
        </a>

        {/* Center: Desktop Search Input (Pill style matching search input in mockup) */}
        {!isMobileSearchOpen && (
          <div className="desktop-only" style={{
            position: 'relative',
            width: '320px'
          }}>
            <input
              type="text"
              placeholder="Search Men's Fashion..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input-premium"
              style={{
                width: '100%',
                paddingLeft: '44px',
                paddingRight: '16px',
                fontSize: '0.85rem',
                height: '42px',
                borderRadius: 'var(--radius-pill)',
                background: '#f3f4f6'
              }}
            />
            <Search size={16} style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }} />
          </div>
        )}

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile Search Trigger */}
          <button 
            onClick={() => setIsMobileSearchOpen(true)}
            className="mobile-only"
            aria-label="Open search"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              color: 'var(--text-dark)'
            }}
          >
            <Search size={22} />
          </button>

          {/* Cart Icon Button */}
          <button
            onClick={onCartClick}
            aria-label="Open Shopping Bag"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              color: 'var(--text-dark)',
              background: '#f3f4f6',
              borderRadius: '50%'
            }}
            className="cart-toggle-btn"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="flex-center" style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'var(--color-sale)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay Panel */}
      {isMobileSearchOpen && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '70px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '12px',
          animation: 'fadeIn 0.15s ease-out',
          zIndex: 1001
        }}>
          <button 
            onClick={() => {
              setIsMobileSearchOpen(false);
              onSearchChange('');
            }}
            aria-label="Back"
            style={{ color: 'var(--text-dark)', padding: '4px' }}
          >
            <ArrowLeft size={22} />
          </button>
          
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <input
              type="text"
              placeholder="Search Men's Fashion..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input-premium"
              autoFocus
              style={{
                width: '100%',
                paddingLeft: '40px',
                height: '40px',
                borderRadius: 'var(--radius-pill)',
                background: '#f3f4f6'
              }}
            />
            <Search size={16} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
          </div>
        </div>
      )}

      {/* Media Query Overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: flex !important;
          }
        }
        .cart-toggle-btn:hover {
          background: #e5e7eb !important;
          transform: scale(1.05);
        }
      `}} />
    </nav>
  );
};

export default Navbar;
