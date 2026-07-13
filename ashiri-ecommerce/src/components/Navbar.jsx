import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';

const Navbar = ({ cartCount, onCartClick, wishlistCount, onWishlistClick, currentPage, onPageChange }) => {
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
        {/* Left Side: Logo & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); onPageChange('shop'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

          {/* Nav Links */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onPageChange('shop'); }}
              style={{
                fontSize: '0.8rem',
                fontWeight: currentPage === 'shop' ? 700 : 500,
                color: currentPage === 'shop' ? 'var(--text-dark)' : 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'var(--transition-fast)'
              }}
              className="nav-link"
            >
              Shop
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onPageChange('gallery'); }}
              style={{
                fontSize: '0.8rem',
                fontWeight: currentPage === 'gallery' ? 700 : 500,
                color: currentPage === 'gallery' ? 'var(--text-dark)' : 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'var(--transition-fast)'
              }}
              className="nav-link"
            >
              Gallery
            </a>
          </div>
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Wishlist Icon Button */}
          <button
            onClick={onWishlistClick}
            aria-label="Open Wishlist"
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
            className="wishlist-toggle-btn"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
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
                {wishlistCount}
              </span>
            )}
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

      <style dangerouslySetInnerHTML={{
        __html: `
        .cart-toggle-btn:hover, .wishlist-toggle-btn:hover {
          background: #e5e7eb !important;
          transform: scale(1.05);
        }
      `}} />
    </nav>
  );
};

export default Navbar;
