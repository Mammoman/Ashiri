import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingBag, Check, Heart, HelpCircle } from 'lucide-react';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : 'S');
  const [activeView, setActiveView] = useState('front'); // 'front' or 'back'
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
          }}>
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
            />
          </div>

          {/* Thumbnails Row: Front & Back Only */}
          <div style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            justifyContent: 'flex-start'
          }}>
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
            }}>
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
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: 'var(--text-dark)',
                  textTransform: 'uppercase'
                }}>
                  ASHIRI ATELIER
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
            }}>
              {product.name}
            </h2>

            {/* Ratings Stars Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', color: '#fbbf24' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                    stroke="currentColor"
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Large Bold Price */}
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--text-dark)',
              marginBottom: '24px',
              letterSpacing: '-0.03em'
            }}>
              ₦ {product.price}
            </div>

            {/* Square Grid Size Selector */}
            <div style={{ marginBottom: '24px' }}>
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
              }}>
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

          </div>

          {/* Action CTAs: Add to Cart and Favorite side-by-side */}
          <div>
            <div style={{
              display: 'flex',
              gap: '10px',
              width: '100%',
              marginBottom: '16px'
            }}>
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
                onClick={() => setIsFavorite(!isFavorite)}
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
            }}>
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
        @media (max-width: 768px) {
          .glass-panel {
            grid-template-columns: 1fr !important;
            max-height: 95vh !important;
          }
          .modal-left-panel {
            border-right: none !important;
            border-bottom: 1px solid var(--color-border);
            padding: 50px 20px 20px 20px !important;
          }
          .modal-right-panel {
            padding: 20px !important;
          }
        }
      `}} />
    </div>
  );
};

export default ProductModal;
