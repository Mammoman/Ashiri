import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ArrowLeft, Loader2, Heart, ShoppingBag, Gift } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useAdmin } from '../context/AdminContext';

// EmailJS credentials from .env.local — swap for real values from your EmailJS dashboard
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'service_xxxxxxx';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_xxxxxxx';
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'xxxxxxxxxxxxxxxx';

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
  const { addOrder } = useAdmin();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod] = useState('paystack'); // Only Paystack supported
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

    const hasGiftItems = cartItems.some((item) => item.isGift);

    // Template variables — matched to your EmailJS template variable names
    // {{email}} → To Email field, {{order_id}} → Subject, {{#orders}} → item loop
    const templateParams = {
      // Core fields matching your existing template
      email:    customerEmail,             // → "To Email" field uses {{email}}
      order_id: reference,                 // → Subject uses Order # {{order_id}}
      orders:   cartItems.map((item) => {
        // Resolve absolute image URL so email clients can read it
        let absoluteImgUrl = item.image || '';
        if (absoluteImgUrl && !absoluteImgUrl.startsWith('http')) {
          const origin = window.location.origin.includes('localhost')
            ? 'https://ashiri-ecommerce.vercel.app'
            : window.location.origin;
          const cleanPath = absoluteImgUrl.startsWith('/') ? absoluteImgUrl : `/${absoluteImgUrl}`;
          absoluteImgUrl = `${origin}${cleanPath}`;
        }

        return {
          name:  item.isGift
            ? `${item.name} (Size: ${item.selectedSize}) 🎁${item.giftMessage ? ` — "${item.giftMessage}"` : ' Gift Packaged'}`
            : `${item.name} (Size: ${item.selectedSize})`,
          price: (item.price * item.quantity).toLocaleString(), // template adds ₦ prefix: ₦{{price}}
          units: item.quantity,
          image_url: absoluteImgUrl, // Passed to template as {{image_url}}
        };
      }),

      // Cost summary — populates Shipping / Taxes / Order Total rows in your template
      cost: {
        shipping: 'Varies with location',
        tax:      'N/A',
        total:    calculateSubtotal().toLocaleString(), // template adds ₦ prefix: ₦{{cost.total}}
      },

      // Extra fields used in the body text you added
      customer_name:    customerName,
      customer_phone:   customerPhone,
      delivery_address: customerAddress,
      order_total:      `₦${calculateSubtotal().toLocaleString()}`,
      gift_note:        hasGiftItems ? '🎁 One or more items in this order include gift packaging.' : '',
    };

    let emailSent = false;

    try {
      // Send the confirmation email directly from the browser via EmailJS
      const emailRes = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      if (emailRes.status === 200) {
        emailSent = true;
        console.log('EmailJS order confirmation sent successfully:', emailRes.text);
      }
    } catch (emailErr) {
      console.error('EmailJS failed to send order confirmation:', emailErr);
      // Non-blocking — the order is still processed even if the email fails
    }

    // Save order to database
    try {
      await addOrder({
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        subtotal: calculateSubtotal(),
        paymentMethod: 'paystack',
        paymentReference: reference,
        status: 'pending',
        cartItems: cartItems
      });
    } catch (dbErr) {
      console.error('Failed to save order to database:', dbErr);
    }

    // Clear cart and close panel regardless of email outcome
    onClearCart();
    setIsCheckoutOpen(false);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCustomerAddress('');
    setIsSubmitting(false);
    onClose();

    // Friendly success message
    if (emailSent) {
      alert(`🎉 Payment successful! Your order has been placed.\n\nA confirmation has been sent to ${customerEmail}.`);
    } else {
      alert(`✅ Payment successful! Your order is confirmed (Ref: ${reference}).\n\nNote: We couldn't send your email receipt right now — please screenshot this for your records.`);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!customerEmail || !customerName || !customerAddress || !customerPhone) {
      alert('Please fill out all delivery information fields.');
      return;
    }

    setIsSubmitting(true);

    if (paymentMethod === 'paystack') {
      const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
      // Detect if we are in Sandbox / Demo mode with a placeholder or missing key
      const isPlaceholderKey = !publicKey ||
        publicKey === 'pk_test_your_key_here' ||
        publicKey === 'pk_test_placeholder' ||
        publicKey.length < 20;

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
            callback: function (response) {
              handlePaymentSuccess(response.reference || paymentRef);
            },
            onClose: function () {
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
                Client Panel
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
                      Browse  Collection
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
                              {item.isGift && (
                                <div style={{ 
                                  display: 'flex', 
                                  flexDirection: 'column',
                                  gap: '4px',
                                  marginTop: '6px',
                                  padding: '6px 10px',
                                  background: '#f5f3ff', 
                                  borderRadius: '6px',
                                  border: '1px solid #ddd6fe',
                                  maxWidth: '100%',
                                  textAlign: 'left'
                                }}>
                                  <span style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '4px', 
                                    fontSize: '0.65rem', 
                                    fontWeight: 700, 
                                    color: '#7c3aed' 
                                  }}>
                                    <Gift size={10} /> GIFT PACKAGING
                                  </span>
                                  {item.giftMessage && (
                                    <p style={{ 
                                      fontSize: '0.7rem', 
                                      color: '#5b21b6', 
                                      fontStyle: 'italic',
                                      margin: 0,
                                      wordBreak: 'break-word',
                                      lineHeight: 1.3
                                    }}>
                                      "{item.giftMessage}"
                                    </p>
                                  )}
                                </div>
                              )}
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
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          VARIES WITH LOCATION
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

              {/* Phone Number */}
              <div>
                <label style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '6px',
                  textTransform: 'uppercase'
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="E.g. +234 801 234 5678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="input-premium"
                  style={{ width: '100%', borderRadius: 'var(--radius-sm)' }}
                />
                <span style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '4px', display: 'block', fontStyle: 'italic', lineHeight: '1.3' }}>
                  A call and mail will be made to confirm your delivery fee to process your order.
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
                <span style={{ fontSize: '0.72rem', color: 'var(--color-sale)', fontWeight: 600, marginTop: '5px', display: 'block' }}>
                  * Please Specify if it is an Interstate Delivery
                </span>
              </div>

              {/* Payment Method — Paystack only */}
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
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--text-dark)',
                  background: '#fbfbfb',
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#09a5db',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>PAY</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', display: 'block' }}>
                      Pay Online (Cards, Bank Transfer)
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Securely processed via Paystack
                    </span>
                  </div>
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
                  `Pay & Place Order (₦${calculateSubtotal().toLocaleString()})`
                )}
              </button>
            </div>
          </form>
        )}

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
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
                Ashiri  Payment Gateway
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
                <strong>PAYSTACK DEMO MODE</strong><br />
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
