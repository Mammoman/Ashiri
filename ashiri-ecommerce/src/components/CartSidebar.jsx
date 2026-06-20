import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

const CartSidebar = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  if (!isOpen) return null;

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2500,
        background: 'rgba(17, 24, 39, 0.3)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      {/* Sidebar Panel */}
      <div 
        className="glass-panel"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '400px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          borderLeft: '1px solid var(--color-border)',
          borderTop: 'none',
          borderBottom: 'none',
          animation: 'slideLeft 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          boxShadow: 'var(--shadow-premium)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-dark)'
            }}>
              Your Bag
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#ffffff',
              background: 'var(--text-dark)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)'
            }}>
              {cartItems.length}
            </span>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close bag"
            style={{
              color: 'var(--text-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#f3f4f6'
            }}
            className="cart-close-btn"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Items list */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '20px'
        }} className="cart-items-scroll">
          {cartItems.length === 0 ? (
            <div className="flex-center" style={{
              height: '100%',
              flexDirection: 'column',
              textAlign: 'center',
              gap: '12px'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your bag is empty.</p>
              <button
                onClick={onClose}
                className="filter-btn active"
                style={{ padding: '8px 18px', fontSize: '0.75rem' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item, idx) => (
                <div 
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: '70px',
                    height: '85px',
                    overflow: 'hidden',
                    background: '#f3f4f6',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h4 style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--text-dark)',
                        lineHeight: 1.3,
                        marginBottom: '2px'
                      }}>
                        {item.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Size: {item.selectedSize} | Tone: {item.selectedColor}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '6px'
                    }}>
                      {/* Qty */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-pill)',
                        background: '#f9fafb'
                      }}>
                        <button 
                          onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                          style={{ padding: '4px 8px', color: 'var(--text-muted)' }}
                          className="qty-btn"
                        >
                          <Minus size={10} />
                        </button>
                        <span style={{ padding: '0 4px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                          style={{ padding: '4px 8px', color: 'var(--text-muted)' }}
                          className="qty-btn"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button 
                        onClick={() => onRemoveItem(item)}
                        style={{
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.7rem'
                        }}
                        className="remove-btn"
                      >
                        <Trash2 size={11} /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    textAlign: 'right'
                  }}>
                    ${item.price * item.quantity}.00
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '20px',
            borderTop: '1px solid var(--color-border)',
            background: '#fafafa'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>
                  ${calculateSubtotal()}.00
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                  COMPLIMENTARY
                </span>
              </div>
              <div style={{ width: '100%', height: '1px', background: 'var(--color-border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-sale)' }}>
                  ${calculateSubtotal()}.00
                </span>
              </div>
            </div>

            <button
              onClick={() => alert("Checkout initiated")}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: 'var(--text-dark)',
                color: '#ffffff',
                borderRadius: 'var(--radius-pill)',
                boxShadow: 'var(--shadow-subtle)'
              }}
              className="checkout-btn"
            >
              Checkout Now
            </button>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .cart-close-btn:hover {
          background: #e5e7eb !important;
          transform: translateX(2px);
        }
        .qty-btn:hover {
          color: var(--text-dark) !important;
        }
        .remove-btn:hover {
          color: var(--color-sale) !important;
        }
        .checkout-btn:hover {
          background: #1f2937 !important;
        }
      `}} />
    </div>
  );
};

export default CartSidebar;
