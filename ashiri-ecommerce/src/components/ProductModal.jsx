import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Check, Heart, HelpCircle, Gift, Plus, Minus } from 'lucide-react';

const ProductModal = ({ product, onClose, onAddToCart, favorites = {}, onToggleFavorite }) => {
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : 'S');
  const [activeView, setActiveView] = useState('front'); // 'front' or 'back'
  const [isAdded, setIsAdded] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setIsAdded(false);
  }, [selectedSize, quantity]);

  if (!product) return null;
  const isFavorite = !!favorites[product.id];

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor: 'Standard', // No color selection, default to Standard
      isGift,
      giftMessage: isGift ? giftMessage : '',
      quantity
    });
    setIsAdded(true);
    setIsGift(false);
    setGiftMessage('');
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
          maxHeight: '120vh',
          borderRadius: 'var(--radius-md)',
          overflowY: 'auto',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          background: 'var(--bg-main)',
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
            background: 'var(--bg-main)',
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

          {/* Large Main Preview Image */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '105%',
            background: '#f4f3f0', // Warm cream background
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.02)'
          }} className="main-image-wrap">
            <img
              src={activeView === 'front' ? product.image : (product.image2 || product.image)}
              alt={`${product.name} ${activeView} view`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '8px',
                transition: 'opacity 0.3s ease',
              }}
              className="main-image"
            />
          </div>

          {product.image2 && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', width: '100%', justifyContent: 'center' }} className="thumbnails-row">
              <button 
                onClick={() => setActiveView('front')}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '8px',
                  border: activeView === 'front' ? '2px solid #0f172a' : '2px solid transparent',
                  padding: '2px',
                  cursor: 'pointer',
                  background: '#f4f3f0',
                  transition: 'all 0.2s'
                }}
              >
                <img src={product.image} alt="Thumbnail 1" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
              </button>
              <button 
                onClick={() => setActiveView('back')}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '8px',
                  border: activeView === 'back' ? '2px solid #0f172a' : '2px solid transparent',
                  padding: '2px',
                  cursor: 'pointer',
                  background: '#f4f3f0',
                  transition: 'all 0.2s'
                }}
              >
                <img src={product.image2} alt="Thumbnail 2" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Size Grid */}
        <div style={{
          padding: '40px 30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }} className="modal-right-panel">

          <div>
            {/* Brand Logo & Product Code */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }} className="modal-brand-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="brand-text" style={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: 'var(--text-dark)',
                  textTransform: 'uppercase'
                }}>
                  ÀṢHÍRÍ
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
            }} className="modal-title brand-text">
              {product.name.replace('The Ashiri ', '')}
            </h2>

            {/* Ratings Stars Row */}


            {/* Large Bold Price */}
            <div style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: 'var(--text-dark)',
              marginBottom: '20px',
              letterSpacing: '-0.03em'
            }} className="modal-price-tag">
              ₦{product.price.toLocaleString()}
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
                  ['S', 'M', 'L', 'XL'].map(size => (
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
              borderColor: isGift ? 'var(--color-accent)' : 'var(--color-border)',
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
                  background: isGift ? 'var(--bg-card)' : '#fafafa',
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
                    background: isGift ? 'var(--color-accent)' : '#e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s ease',
                    flexShrink: 0,
                  }}>
                    <Gift size={14} color={isGift ? '#fff' : '#6b7280'} />
                  </span>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: isGift ? 'var(--color-accent)' : 'var(--text-dark)',
                  }}>
                    Gift this item
                  </span>
                  {isGift && (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: 'var(--color-accent)',
                      background: 'var(--color-accent-light)',
                      padding: '2px 7px',
                      borderRadius: '20px',
                    }}>ACTIVE</span>
                  )}
                </span>
                {/* Toggle switch pill */}
                <span style={{
                  width: '36px', height: '20px',
                  borderRadius: '20px',
                  background: isGift ? 'var(--color-accent)' : '#d1d5db',
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
                    background: 'var(--bg-main)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'left 0.2s ease',
                  }} />
                </span>
              </button>

              {/* Expandable gift message input */}
              {isGift && (
                <div style={{
                  padding: '12px 14px',
                  borderTop: '1px solid var(--color-border)',
                  background: 'var(--bg-main)',
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
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
                      border: '1px solid var(--color-border)',
                      background: 'var(--bg-main)',
                      outline: 'none',
                      color: 'var(--text-dark)',
                      lineHeight: 1.5,
                    }}
                    className="gift-message-input"
                  />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textAlign: 'right', marginTop: '2px' }}>
                    {giftMessage.length}/120
                  </span>
                  <p style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-accent)',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}>
                    <Gift size={10} /> Comes With A Card (+ ₦2,000)
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Action CTAs: Add to Cart and Favorite side-by-side */}
          <div className="mobile-sticky-action">
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
                    <Check size={16} /> Added to cart ({quantity})
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to cart
                  </>
                )}
              </button>

              {/* Quantity Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '110px',
                height: '50px',
                borderRadius: '4px',
                border: '1px solid var(--color-border)',
                background: 'var(--bg-main)',
                padding: '0 8px'
              }} className="modal-quantity-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '4px', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '4px', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}
                >
                  <Plus size={16} />
                </button>
              </div>
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
              Delivery fee varies with location
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
            height: 100% !important;
            max-height: 100vh !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
            border: none !important;
          }
          .modal-left-panel {
            border-right: none !important;
            border-bottom: none !important;
            padding: 0 !important;
            gap: 0 !important;
            position: relative !important;
          }
          .main-image-wrap {
            padding-top: 130% !important;
            border-radius: 0 !important;
            border: none !important;
          }
          .main-image {
            padding: 0px !important;
            object-fit: cover !important;
          }
          .thumbnails-row {
            position: absolute !important;
            bottom: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 10 !important;
            background: rgba(253, 251, 247, 0.7) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            padding: 6px !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
            gap: 12px !important;
            width: auto !important;
            display: flex !important;
            margin-top: 0 !important;
          }
          .thumbnail-btn {
            width: 50px !important;
            height: 50px !important;
            padding: 0 !important;
            border-radius: 8px !important;
            border-width: 2px !important;
            overflow: hidden !important;
          }
          .modal-right-panel {
            padding: 24px 20px 100px 20px !important; /* Extra bottom padding for sticky bar */
          }
          .modal-close-btn {
            top: 16px !important;
            left: 16px !important;
            width: 44px !important;
            height: 44px !important;
            background: rgba(255, 255, 255, 0.3) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
            color: #000 !important;
          }
          .modal-close-btn svg {
            width: 20px !important;
            height: 20px !important;
          }
          .mobile-sticky-action {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            padding: 16px 20px 24px 20px !important;
            background: rgba(253, 251, 247, 0.85) !important;
            backdrop-filter: blur(15px) !important;
            -webkit-backdrop-filter: blur(15px) !important;
            border-top: 1px solid rgba(255, 255, 255, 0.6) !important;
            z-index: 50 !important;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05) !important;
          }
          .modal-brand-row {
            margin-bottom: 8px !important;
          }
          .modal-title {
            font-size: 1.8rem !important;
            margin-bottom: 8px !important;
            line-height: 1.1 !important;
          }
          .modal-price-tag {
            font-size: 1.4rem !important;
            margin-bottom: 16px !important;
          }
          .modal-size-section {
            margin-bottom: 16px !important;
          }
          .size-grid {
            gap: 8px !important;
          }
          .size-square-btn {
            height: 44px !important;
            font-size: 0.85rem !important;
            border-radius: 8px !important;
          }
          .gift-toggle-btn {
            padding: 14px 16px !important;
          }
          .cart-action-solid-btn {
            height: 52px !important;
            font-size: 0.9rem !important;
            border-radius: 12px !important;
          }
          .modal-quantity-selector {
            height: 52px !important;
            border-radius: 12px !important;
          }
          .modal-delivery-text {
            margin-top: 8px !important;
          }
        }
      `}} />
    </div >
  );
};

export default ProductModal;
