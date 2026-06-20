import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingBag, Check } from 'lucide-react';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : 'S');
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : 'Ochre');
  const [isAdded, setIsAdded] = useState(false);

  // Mapping string colors to hex/background values for styling circular buttons
  const getColorHex = (colorName) => {
    const maps = {
      'Ochre': '#b45309',
      'Charcoal': '#374151',
      'Bone': '#f5f5f4',
      'Indigo/White': '#1e3a8a',
      'Noir/Gold': '#111827',
      'Bone/Gold': '#eab308',
      'Terracotta/Gold': '#c2410c',
      'Sand': '#d1fae5',
      'Olive': '#3f6212',
      'Sahara Gold': '#ca8a04',
      'Bronze Spark': '#854d0e',
      'Indigo': '#1e40af',
      'Faded Indigo': '#60a5fa',
      'Terracotta': '#b91c1c',
      'Clay': '#ea580c',
      'Oatmeal': '#e7e5e4',
      'Noir': '#000000',
      'Ivory': '#f8fafc'
    };
    return maps[colorName] || '#9ca3af';
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor
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
        background: 'rgba(17, 24, 39, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '92vh',
          borderRadius: 'var(--radius-lg)',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          animation: 'slideUp 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          boxShadow: 'var(--shadow-premium)',
          border: '1px solid var(--color-border)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header - Mockup Detail Product Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: '#ffffff',
          zIndex: 10
        }}>
          <button 
            onClick={onClose}
            aria-label="Back"
            style={{
              color: 'var(--text-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f3f4f6'
            }}
            className="back-btn-hover"
          >
            <ArrowLeft size={18} />
          </button>
          
          <span style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--text-dark)'
          }}>
            Detail Product
          </span>

          <div style={{ width: '36px' }} /> {/* Spacer matching mockup */}
        </div>

        {/* Product Image Section */}
        <div style={{
          position: 'relative',
          width: '100%',
          paddingTop: '90%', // landscape/square-ish crop for details
          background: '#f3f4f6',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '20px'
            }}
          />
        </div>

        {/* Info & Options Form */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Metadata & Title */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase'
              }}>
                ASHIRI
              </span>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={12} fill="var(--color-sale)" stroke="var(--color-sale)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  {product.rating}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ({product.reviews})
                </span>
              </div>
            </div>

            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-dark)',
              lineHeight: 1.3,
              marginBottom: '10px',
              letterSpacing: '-0.02em'
            }}>
              {product.name}
            </h2>

            {/* Price layout: active and original crossed-out */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--color-sale)'
              }}>
                ${product.price}.00
              </span>
              {product.originalPrice && (
                <span style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through'
                }}>
                  ${product.originalPrice}.00
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5
          }}>
            {product.description}
          </p>

          {/* Option Pickers wrapper */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '20px',
            padding: '12px 0',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)'
          }}>
            
            {/* Colors picker */}
            <div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                Colors
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {product.colors.map(color => {
                  const isActive = selectedColor === color;
                  const isLight = color === 'Bone' || color === 'Ivory' || color === 'Oatmeal';
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: getColorHex(color),
                        border: '2px solid',
                        borderColor: isActive ? 'var(--text-dark)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isLight ? '#000000' : '#ffffff',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      {isActive && <Check size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size picker */}
            <div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                Size
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {product.sizes ? (
                  product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid',
                        borderColor: selectedSize === size ? 'var(--text-dark)' : 'var(--color-border)',
                        background: selectedSize === size ? 'var(--text-dark)' : 'transparent',
                        color: selectedSize === size ? '#ffffff' : 'var(--text-dark)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-pill)',
                        minWidth: '36px'
                      }}
                      className="size-pill-btn"
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Standard</span>
                )}
              </div>
            </div>

          </div>

          {/* Action CTAs: Add to Cart and Buy Now side-by-side */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginTop: '8px'
          }}>
            <button
              onClick={handleAddToCart}
              style={{
                border: '1px solid var(--text-dark)',
                borderRadius: 'var(--radius-pill)',
                background: isAdded ? '#48bb78' : 'transparent',
                color: isAdded ? '#ffffff' : 'var(--text-dark)',
                borderColor: isAdded ? '#48bb78' : 'var(--text-dark)',
                fontWeight: 700,
                fontSize: '0.8rem',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              className="add-cart-outline-btn"
            >
              {isAdded ? (
                <>
                  <Check size={15} /> Added
                </>
              ) : (
                <>
                  <ShoppingBag size={15} /> Add To Cart
                </>
              )}
            </button>

            <button
              onClick={() => alert(`Proceeding to Buy ${product.name} now!`)}
              style={{
                borderRadius: 'var(--radius-pill)',
                background: 'var(--text-dark)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8rem',
                height: '48px'
              }}
              className="buy-now-solid-btn"
            >
              Buy Now
            </button>
          </div>

        </div>

      </div>

      {/* Modal specific styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .back-btn-hover:hover {
          background: #e5e7eb !important;
        }
        .size-pill-btn:hover {
          border-color: var(--text-dark) !important;
        }
        .add-cart-outline-btn:hover {
          background: var(--color-accent-light) !important;
        }
        .buy-now-solid-btn:hover {
          background: #1f2937 !important;
        }
      `}} />
    </div>
  );
};

export default ProductModal;
