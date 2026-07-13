import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Check, Heart, HelpCircle, Gift } from 'lucide-react';

const ProductModal = ({ product, onClose, onAddToCart, favorites = {}, onToggleFavorite }) => {
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : 'S');
  const [activeView, setActiveView] = useState('front'); // 'front' or 'back'
  const [isAdded, setIsAdded] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  if (!product) return null;
  const isFavorite = !!favorites[product.id];

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor: 'Standard' // No color selection, default to Standard
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '960px', // Wider desktop container matching split layout
          maxHeight: '90vh',
          borderRadius: 'var(--radius-md)',
          overflowY: 'auto',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          background: '#ffffff',
          animation: 'slideUp 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          boxShadow: 'var(--shadow-premium)',
          border: '1px solid var(--color-border)'
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close Button Top Left (Back Arrow) */}
        <button
          onClick={onClose}
          aria-label="Back to collection"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 10,
            background: '#ffffff',
            border: '1px solid var(--color-border)',
            color: 'var(--text-dark)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-subtle)'
          }}
          className="modal-close-btn"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Left Side: Product Image & View Switcher (Front/Back) */}
        <div style={{
          padding: '40px 30px 30px 30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          borderRight: '1px solid var(--color-border)'
        }} className="modal-left-panel">

          {/* Large Main Preview Image with Warm Cream Background */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '90%', // Landscape ratio matching mockup
            background: '#f4f3f0', // Warm cream background
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.02)'
          }} className="main-image-wrap">
            <img
              src={product.image}
              alt={`${product.name} ${activeView} view`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '24px',
                transition: 'transform 0.4s ease',
                // Flip image to mock back view as requested
                transform: activeView === 'back' ? 'scaleX(-1)' : 'scaleX(1)'
              }}
              className="main-image"
            />
          </div>

          {/* Thumbnails Row: Front & Back Only */}
          <div style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            justifyContent: 'flex-start'
          }} className="thumbnails-row">
            {/* Front View Thumbnail */}
            <button
              onClick={() => setActiveView('front')}
              style={{
                width: '76px',
                height: '84px',
                background: '#f4f3f0',
                borderRadius: 'var(--radius-sm)',
                border: '2px solid',
                borderColor: activeView === 'front' ? 'var(--text-dark)' : 'transparent',
                overflow: 'hidden',
                padding: '6px'
              }}
              className="thumbnail-btn"
            >
              <img
                src={product.image}
                alt="Front view thumbnail"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </button>

            {/* Back View Thumbnail (Flipped) */}
            <button
              onClick={() => setActiveView('back')}
              style={{
                width: '76px',
                height: '84px',
                background: '#f4f3f0',
                borderRadius: 'var(--radius-sm)',
                border: '2px solid',
                borderColor: activeView === 'back' ? 'var(--text-dark)' : 'transparent',
                overflow: 'hidden',
                padding: '6px'
              }}
              className="thumbnail-btn"
            >
              <img
                src={product.image}
                alt="Back view thumbnail"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: 'scaleX(-1)'
                }}
              />
            </button>
          </div>

        </div>

        {/* Right Side: Product Details & Size Grid */}
        <div style={{
          padding: '40px 30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }} className="modal-right-panel">

          <div>
            {/* Breadcrumbs Navigation */}
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500
            }} className="modal-breadcrumbs">
              <span>Apparel</span>
              <span>&gt;</span>
              <span>Tops</span>
              <span>&gt;</span>
              <span style={{ color: 'var(--text-dark)' }}>{product.category}</span>
            </div>

            {/* Brand Logo & Product Code */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }} className="modal-brand-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: 'var(--text-dark)',
                  textTransform: 'uppercase'
                }}>
                  ASHIRI
                </span>
              </div>
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                fontFamily: 'monospace',
                letterSpacing: '0.05em'
              }}>
                AS-2026-RI
              </span>
            </div>

            {/* Product Name */}
            <h2 style={{
              fontSize: '1.65rem',
              fontWeight: 700,
              color: 'var(--text-dark)',
              lineHeight: 1.25,
              marginBottom: '10px',
              letterSpacing: '-0.02em'
            }} className="modal-title">
              {product.name}
            </h2>

            {/* Ratings Stars Row */}


            {/* Large Bold Price */}
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--text-dark)',
              marginBottom: '24px',
              letterSpacing: '-0.03em'
            }} className="modal-price-tag">
              ₦ {product.price}
            </div>

            {/* Square Grid Size Selector */}
            <div style={{ marginBottom: '24px' }} className="modal-size-section">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--text-dark)'
                }}>
                  Size <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}></span>
                </span>


              </div>

              {/* Grid of Square Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px'
              }} className="size-grid">
                {product.sizes ? (
                  product.sizes.map(size => {
                    const isActive = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          height: '44px',
                          border: '1px solid',
                          borderColor: isActive ? 'var(--text-dark)' : 'var(--color-border)',
                          background: isActive ? 'var(--text-dark)' : '#ffffff',
                          color: isActive ? '#ffffff' : 'var(--text-dark)',
                          fontSize: '0.85rem',
                          fontWeight: isActive ? 700 : 500,
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'var(--transition-fast)'
                        }}
                        className="size-square-btn"
                      >
                        {size}
                      </button>
                    );
                  })
                ) : (
                  ['S', 'M', 'L'].map(size => (
                    <button key={size} className="size-square-btn">{size}</button>
                  ))
                )}
              </div>
            </div>

            {/* Gift Option Toggle */}
            <div style={{
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: isGift ? '#7c3aed' : 'var(--color-border)',
              overflow: 'hidden',
              transition: 'border-color 0.2s ease',
            }}>
              {/* Toggle row */}
              <button
                type="button"
                onClick={() => setIsGift(prev => !prev)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  background: isGift ? '#f5f3ff' : '#fafafa',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                className="gift-toggle-btn"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '28px', height: '28px',
                    borderRadius: '7px',
                    background: isGift ? '#7c3aed' : '#e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s ease',
                    flexShrink: 0,
                  }}>
                    <Gift size={14} color={isGift ? '#fff' : '#6b7280'} />
                  </span>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: isGift ? '#5b21b6' : 'var(--text-dark)',
                  }}>
                    Gift this item
                  </span>
                  {isGift && (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: '#7c3aed',
                      background: '#ede9fe',
                      padding: '2px 7px',
                      borderRadius: '20px',
                    }}>ACTIVE</span>
                  )}
                </span>
                {/* Toggle switch pill */}
                <span style={{
                  width: '36px', height: '20px',
                  borderRadius: '20px',
                  background: isGift ? '#7c3aed' : '#d1d5db',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'background 0.2s ease',
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '3px',
                    left: isGift ? '18px' : '3px',
                    width: '14px', height: '14px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'left 0.2s ease',
                  }} />
                </span>
              </button>

              {/* Expandable gift message input */}
              {isGift && (
                <div style={{
                  padding: '12px 14px',
                  borderTop: '1px solid #ede9fe',
                  background: '#fdfcff',
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#7c3aed',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '6px',
                  }}>
                    Personalised Message (optional)
                  </label>
                  <textarea
                    placeholder="E.g. Happy Birthday! Wishing you joy in every outfit ✨"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    rows={2}
                    maxLength={120}
                    style={{
                      width: '100%',
                      resize: 'none',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-body)',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #ddd6fe',
                      background: '#ffffff',
                      outline: 'none',
                      color: 'var(--text-dark)',
                      lineHeight: 1.5,
                    }}
                    className="gift-message-input"
                  />
                  <span style={{ fontSize: '0.65rem', color: '#a78bfa', display: 'block', textAlign: 'right', marginTop: '2px' }}>
                    {giftMessage.length}/120
                  </span>
                  <p style={{
                    fontSize: '0.7rem',
                    color: '#7c3aed',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}>
                    <Gift size={10} /> Wrapped in our signature matte kraft box with a handwritten note.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Action CTAs: Add to Cart and Favorite side-by-side */}
          <div>
            <div style={{
              display: 'flex',
              gap: '10px',
              width: '100%',
              marginBottom: '16px'
            }} className="modal-actions-row">
              {/* Wide Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                style={{
                  flexGrow: 1,
                  background: isAdded ? '#10b981' : 'var(--text-dark)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  height: '50px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-subtle)'
                }}
                className="cart-action-solid-btn"
              >
                {isAdded ? (
                  <>
                    <Check size={16} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to cart
                  </>
                )}
              </button>

              {/* Heart Favorite Button */}
              <button
                onClick={() => onToggleFavorite(product.id)}
                aria-label="Add to wishlist"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                  background: isFavorite ? '#fef2f2' : '#ffffff',
                  color: isFavorite ? '#ef4444' : 'var(--text-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-fast)'
                }}
                className="heart-action-btn"
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Delivery terms info */}
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: 'center'
            }} className="modal-delivery-text">
              Free delivery on orders over ₦50,000
            </p>
          </div>

        </div>

      </div>

      {/* Styles for hover interactions */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .modal-close-btn:hover {
          background: #f3f4f6 !important;
          transform: scale(1.05);
        }
        .thumbnail-btn:hover {
          border-color: #cbd5e1 !important;
        }
        .size-square-btn:hover {
          border-color: var(--text-dark) !important;
        }
        .cart-action-solid-btn:hover {
          background: #1f2937 !important;
        }
        .heart-action-btn:hover {
          border-color: var(--text-dark) !important;
          background: #f9fafb !important;
        }
        .gift-toggle-btn:hover {
          filter: brightness(0.97);
        }
        .gift-message-input:focus {
          border-color: #a78bfa !important;
          box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.15);
        }
        @media (max-width: 768px) {
          .glass-panel {
            grid-template-columns: 1fr !important;
            max-height: 90vh !important;
            width: 95% !important;
            margin: auto !important;
          }
          .modal-left-panel {
            border-right: none !important;
            border-bottom: 1px solid var(--color-border);
            padding: 40px 12px 10px 12px !important;
            gap: 12px !important;
          }
          .main-image-wrap {
            padding-top: 65% !important;
          }
          .main-image {
            padding: 12px !important;
          }
          .thumbnail-btn {
            width: 52px !important;
            height: 58px !important;
            padding: 4px !important;
          }
          .thumbnails-row {
            gap: 8px !important;
          }
          .modal-right-panel {
            padding: 12px 16px 16px 16px !important;
          }
          .modal-breadcrumbs {
            margin-bottom: 6px !important;
          }
          .modal-brand-row {
            margin-bottom: 4px !important;
          }
          .modal-title {
            font-size: 1.25rem !important;
            margin-bottom: 6px !important;
          }
          .modal-rating-row {
            margin-bottom: 10px !important;
          }
          .modal-price-tag {
            font-size: 1.45rem !important;
            margin-bottom: 12px !important;
          }
          .modal-size-section {
            margin-bottom: 14px !important;
          }
          .size-grid {
            gap: 6px !important;
          }
          .size-square-btn {
            height: 36px !important;
            font-size: 0.8rem !important;
          }
          .modal-actions-row {
            margin-bottom: 10px !important;
            gap: 8px !important;
          }
          .cart-action-solid-btn {
            height: 42px !important;
            font-size: 0.8rem !important;
          }
          .heart-action-btn {
            width: 42px !important;
            height: 42px !important;
          }
          .modal-close-btn {
            top: 10px !important;
            left: 10px !important;
            width: 32px !important;
            height: 32px !important;
          }
          .modal-close-btn svg {
            width: 14px !important;
            height: 14px !important;
          }
        }
      `}} />
    </div>
  );
};

export default ProductModal;
