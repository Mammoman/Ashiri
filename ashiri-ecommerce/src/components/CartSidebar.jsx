import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ArrowLeft, Loader2, Heart, ShoppingBag } from 'lucide-react';

// Dynamic loader helper for Paystack script
const loadPaystackScript = () => {
  return new Promise((resolve) => {
    if (window.PaystackPop) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CartSidebar = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onAddToCart,
  defaultTab = 'cart',
  wishlistItems = [],
  onToggleFavorite
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paystack'); // 'paystack' or 'pod'
  const [isMockPaystackOpen, setIsMockPaystackOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePaymentSuccess = async (reference) => {
    try {
      const serverResponse = await fetch('/api/send-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          customerEmail,
          customerName,
          customerAddress,
          subtotal: calculateSubtotal(),
          paymentMethod: 'Paystack',
          paymentReference: reference
        })
      });

      const result = await serverResponse.json();
      if (result.success) {
        if (result.warning) {
          alert(`Payment successful and order placed!\n\nNote: ${result.warning}`);
        } else {
          alert('Payment successful and order placed! A receipt has been sent to your email.');
        }
        onClearCart();
        setIsCheckoutOpen(false);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerAddress('');
        onClose();
      } else {
        alert(`Order registration failed: ${result.message || 'Please contact support with reference ' + reference}`);
      }
    } catch (error) {
      console.error('Order verification error:', error);
      alert(`Payment was successful, but we failed to register the order. Please contact support with reference: ${reference}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!customerEmail || !customerName || !customerAddress) {
      alert('Please fill out all delivery information fields.');
      return;
    }
    
    setIsSubmitting(true);

    if (paymentMethod === 'paystack') {
      const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_dcae78550183b19409b85c13e4bcfc424a1e9411';
      // Detect if we are in Sandbox / Demo mode with a placeholder or invalid key
      const isPlaceholderKey = !import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 
                               publicKey.startsWith('pk_test_dcae78550183b19409b85c13e4bcfc424a1e9411') || 
                               publicKey === 'pk_test_placeholder';
      
      if (isPlaceholderKey) {
        setIsMockPaystackOpen(true);
      } else {
        try {
          const loaded = await loadPaystackScript();
          if (!loaded) {
            alert('Failed to load payment gateway. Please check your internet connection and try again.');
            setIsSubmitting(false);
            return;
          }

          const paymentRef = 'ASH-' + Math.floor(Math.random() * 1000000000 + 1);
          const handler = window.PaystackPop.setup({
            key: publicKey,
            email: customerEmail,
            amount: calculateSubtotal() * 100, // Paystack expects amount in kobo
            currency: 'NGN',
            ref: paymentRef,
            callback: function(response) {
              handlePaymentSuccess(response.reference || paymentRef);
            },
            onClose: function() {
              setIsSubmitting(false);
            }
          });
          handler.openIframe();
        } catch (error) {
          console.error('Paystack checkout setup error:', error);
          alert('Could not initialize payment. Please try again.');
          setIsSubmitting(false);
        }
      }
    } else {
      // Pay on Delivery (POD)
      try {
        const response = await fetch('/api/send-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cartItems,
            customerEmail,
            customerName,
            customerAddress,
            subtotal: calculateSubtotal(),
            paymentMethod: 'Pay on Delivery',
            paymentReference: 'N/A'
          })
        });

        const result = await response.json();
        
        if (result.success) {
          if (result.warning) {
            alert(`Order placed successfully!\n\nNote: ${result.warning}`);
          } else {
            alert('Order placed successfully! Order confirmation has been sent to your email.');
          }
          onClearCart();
          setIsCheckoutOpen(false);
          setCustomerName('');
          setCustomerEmail('');
          setCustomerAddress('');
          onClose();
        } else {
          alert(`Checkout Failed: ${result.message || 'Please try again.'}`);
        }
      } catch (error) {
        console.error('Checkout submit error:', error);
        alert('Could not submit order. Please check your internet connection and try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
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
        
        {/* VIEW 1: SHOPPING BAG ITEMS LIST */}
        {!isCheckoutOpen ? (
          <>
            {/* Header */}
            <div style={{
              padding: '20px 20px 10px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-dark)'
              }}>
                Atelier Client Panel
              </span>
              <button 
                onClick={onClose} 
                aria-label="Close panel"
                style={{
                  color: 'var(--text-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  border: 'none',
                  cursor: 'pointer'
                }}
                className="cart-close-btn"
              >
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Horizontal Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--color-border)',
              background: '#ffffff',
              padding: '0 10px'
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('cart')}
                style={{
                  flex: 1,
                  padding: '12px 6px',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'cart' ? 700 : 500,
                  color: activeTab === 'cart' ? 'var(--text-dark)' : 'var(--text-muted)',
                  borderBottom: '2px solid',
                  borderColor: activeTab === 'cart' ? 'var(--text-dark)' : 'transparent',
                  background: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ShoppingBag size={14} />
                Bag ({cartItems.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('wishlist')}
                style={{
                  flex: 1,
                  padding: '12px 6px',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'wishlist' ? 700 : 500,
                  color: activeTab === 'wishlist' ? 'var(--text-dark)' : 'var(--text-muted)',
                  borderBottom: '2px solid',
                  borderColor: activeTab === 'wishlist' ? 'var(--text-dark)' : 'transparent',
                  background: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Heart size={14} fill={activeTab === 'wishlist' ? 'currentColor' : 'none'} />
                Wishlist ({wishlistItems.length})
              </button>
            </div>

            {activeTab === 'wishlist' ? (
              /* VIEW 1A: WISHLIST ITEMS LIST */
              <div style={{
                flexGrow: 1,
                overflowY: 'auto',
                padding: '20px'
              }} className="cart-items-scroll">
                {wishlistItems.length === 0 ? (
                  <div className="flex-center" style={{
                    height: '100%',
                    flexDirection: 'column',
                    textAlign: 'center',
                    gap: '12px'
                  }}>
                    <Heart size={32} style={{ color: 'var(--text-muted)' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your wishlist is empty.</p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="filter-btn active"
                      style={{ padding: '8px 18px', fontSize: '0.75rem' }}
                    >
                      Browse Atelier Collection
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {wishlistItems.map((item) => (
                      <div 
                        key={item.id}
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
                              ₦{item.price.toLocaleString()}
                            </span>
                          </div>

                          {/* Actions */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginTop: '6px'
                          }}>
                            {/* Move to bag button */}
                            <button 
                              type="button"
                              onClick={() => {
                                onAddToCart(item);
                                setActiveTab('cart');
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.7rem',
                                color: 'var(--text-dark)',
                                fontWeight: 700,
                                background: 'var(--color-accent-light)',
                                border: 'none',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Add to Bag
                            </button>

                            {/* Remove from wishlist */}
                            <button 
                              type="button"
                              onClick={() => onToggleFavorite(item.id)}
                              style={{
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '0.7rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                              className="remove-btn"
                            >
                              <Trash2 size={11} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* VIEW 1B: SHOPPING BAG ITEMS LIST (Existing) */
              <>
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
                        type="button"
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
                                  type="button"
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
                                  type="button"
                                  onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                                  style={{ padding: '4px 8px', color: 'var(--text-muted)' }}
                                  className="qty-btn"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>

                              {/* Remove */}
                              <button 
                                type="button"
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
                            ₦{(item.price * item.quantity).toLocaleString()}
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
                          ₦{calculateSubtotal().toLocaleString()}
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
                          ₦{calculateSubtotal().toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCheckoutOpen(true)}
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
              </>
            )}
          </>
        ) : (
          /* VIEW 2: CHECKOUT SHIPPING & EMAIL FORM */
          <form onSubmit={handleCheckoutSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}>
            {/* Form Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <button 
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
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
                <ArrowLeft size={16} />
              </button>
              <span style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-dark)'
              }}>
                Delivery Information
              </span>
            </div>

            {/* Inputs Body */}
            <div style={{
              flexGrow: 1,
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflowY: 'auto'
            }}>
              {/* Name */}
              <div>
                <label style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '6px',
                  textTransform: 'uppercase'
                }}>
                  Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="E.g. Kehinde Etti"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="input-premium"
                  style={{ width: '100%', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '6px',
                  textTransform: 'uppercase'
                }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="name@domain.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="input-premium"
                  style={{ width: '100%', borderRadius: 'var(--radius-sm)' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Your digital receipt will be sent here.
                </span>
              </div>

              {/* Address */}
              <div>
                <label style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '6px',
                  textTransform: 'uppercase'
                }}>
                  Delivery Address
                </label>
                <textarea 
                  placeholder="Street, City, State, Country"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  required
                  rows="3"
                  className="input-premium"
                  style={{ 
                    width: '100%', 
                    borderRadius: 'var(--radius-sm)',
                    resize: 'none',
                    fontFamily: 'var(--font-body)',
                    padding: '10px 16px',
                    background: '#f3f4f6',
                    border: '1px solid transparent',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Payment Method
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Option 1: Paystack */}
                  <label 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid',
                      borderColor: paymentMethod === 'paystack' ? 'var(--text-dark)' : 'var(--color-border)',
                      background: paymentMethod === 'paystack' ? '#fbfbfb' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="paystack"
                      checked={paymentMethod === 'paystack'}
                      onChange={() => setPaymentMethod('paystack')}
                      style={{ accentColor: 'var(--text-dark)' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', display: 'block' }}>
                        Pay Online (Cards, Bank Transfer)
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Securely processed via Paystack
                      </span>
                    </div>
                  </label>

                  {/* Option 2: POD */}
                  <label 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid',
                      borderColor: paymentMethod === 'pod' ? 'var(--text-dark)' : 'var(--color-border)',
                      background: paymentMethod === 'pod' ? '#fbfbfb' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="pod"
                      checked={paymentMethod === 'pod'}
                      onChange={() => setPaymentMethod('pod')}
                      style={{ accentColor: 'var(--text-dark)' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', display: 'block' }}>
                        Pay on Delivery
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Pay via Transfer or Cash when delivered
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order total widget */}
              <div style={{
                background: '#f9fafb',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                marginTop: '10px',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>Total Items:</span>
                  <span style={{ fontWeight: 600 }}>{cartItems.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                  <span>Amount Due:</span>
                  <span style={{ color: 'var(--color-sale)' }}>₦{calculateSubtotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Form Actions Footer */}
            <div style={{
              padding: '20px',
              borderTop: '1px solid var(--color-border)',
              background: '#fafafa'
            }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: isSubmitting ? 'var(--text-muted)' : 'var(--text-dark)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: 'var(--shadow-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                className="checkout-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Processing Order...
                  </>
                ) : (
                  paymentMethod === 'paystack'
                    ? `Pay & Place Order (₦${calculateSubtotal().toLocaleString()})`
                    : `Place Order (₦${calculateSubtotal().toLocaleString()})`
                )}
              </button>
            </div>
          </form>
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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />

      {/* Mock Paystack Payment Modal Overlay */}
      {isMockPaystackOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 3000,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          animation: 'fadeIn 0.2s ease-out'
        }} className="mock-paystack-overlay">
          <div style={{
            background: '#ffffff',
            width: '100%',
            maxWidth: '380px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'slideUp 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            border: '1px solid var(--color-border)',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{
              background: '#09a5db',
              padding: '20px',
              color: '#ffffff',
              position: 'relative',
              textAlign: 'center'
            }}>
              <button 
                onClick={() => {
                  setIsMockPaystackOpen(false);
                  setIsSubmitting(false);
                }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  opacity: 0.8
                }}
                aria-label="Close payment"
              >
                ✕
              </button>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.9, marginBottom: '4px' }}>
                Ashiri Atelier Payment Gateway
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                ₦{calculateSubtotal().toLocaleString()}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px' }}>
                {customerEmail}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 20px' }}>
              <div style={{
                background: '#ebf8fe',
                border: '1px solid #bae6fd',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '0.75rem',
                color: '#0369a1',
                marginBottom: '16px',
                lineHeight: 1.4
              }}>
                <strong>PAYSTACK DEMO MODE</strong><br/>
                Since no custom Paystack Public Key is configured, you are running in sandbox demo mode. Click the button below to simulate a successful card transaction.
              </div>

              {/* Fake card form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Card Number
                  </label>
                  <input 
                    type="text" 
                    value="4081 0000 0000 0000" 
                    disabled 
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.85rem',
                      background: '#f9fafb',
                      color: 'var(--text-dark)'
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                      Expiry
                    </label>
                    <input 
                      type="text" 
                      value="12/29" 
                      disabled 
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.85rem',
                        background: '#f9fafb',
                        color: 'var(--text-dark)'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                      CVV
                    </label>
                    <input 
                      type="text" 
                      value="123" 
                      disabled 
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.85rem',
                        background: '#f9fafb',
                        color: 'var(--text-dark)'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setIsMockPaystackOpen(false);
                  handlePaymentSuccess('MOCK-ASH-' + Math.floor(Math.random() * 1000000000 + 1));
                }}
                style={{
                  width: '100%',
                  background: '#3ac5a0',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(58, 197, 160, 0.2)'
                }}
                className="mock-success-btn"
              >
                Simulate Payment of ₦{calculateSubtotal().toLocaleString()}
              </button>
            </div>
            
            {/* Footer */}
            <div style={{
              background: '#f9fafb',
              padding: '12px',
              textAlign: 'center',
              borderTop: '1px solid var(--color-border)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              🔒 Secured by Paystack Demo Integration
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
