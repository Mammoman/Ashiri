import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

const TrackOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Read from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('ashiri_guest_orders') || '[]');
    // Sort so newest are first
    const sortedOrders = savedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setOrders(sortedOrders);

    // Try to fetch live statuses
    const fetchLiveStatuses = async () => {
      try {
        const orderIds = sortedOrders.map(o => o.id);
        if (orderIds.length === 0) return;
        
        const response = await fetch('/api/track-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderIds })
        });
        
        if (response.ok) {
          const liveData = await response.json();
          // Update the saved orders with live statuses
          const updatedOrders = sortedOrders.map(order => {
            const liveOrder = liveData.find(lo => lo.id === order.id);
            if (liveOrder) {
              return { ...order, status: liveOrder.status };
            }
            return order;
          });
          setOrders(updatedOrders);
          // Update localStorage with the new statuses
          localStorage.setItem('ashiri_guest_orders', JSON.stringify(updatedOrders));
        }
      } catch (err) {
        console.error('Failed to fetch live tracking:', err);
      }
    };
    
    fetchLiveStatuses();
  }, []);

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'shipped':
        return { color: '#3b82f6', bg: '#eff6ff', icon: <Truck size={16} />, label: 'Shipped' };
      case 'delivered':
        return { color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle size={16} />, label: 'Delivered' };
      case 'cancelled':
        return { color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={16} />, label: 'Cancelled' };
      case 'pending':
      default:
        return { color: '#f59e0b', bg: '#fffbeb', icon: <Clock size={16} />, label: 'Processing' };
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      padding: '40px 20px',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .track-orders-header {
            font-size: 2rem;
          }
          .order-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
          }
          .order-card-right {
            display: flex; 
            align-items: center; 
            gap: 16px;
          }
          .order-item-row {
            display: flex;
            gap: 16px;
            align-items: center;
          }
          .order-item-price {
            font-weight: 600;
            color: var(--text-dark);
          }
          @media (max-width: 480px) {
            .track-orders-header {
              font-size: 1.5rem;
            }
            .order-card-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 16px;
            }
            .order-card-right {
              width: 100%;
              justify-content: space-between;
            }
            .order-item-row {
              align-items: flex-start;
            }
            .order-item-details {
              display: flex;
              flex-direction: column;
              gap: 4px;
            }
            .order-item-price {
              margin-top: 8px;
            }
            .order-card-footer {
              flex-direction: column;
              gap: 8px;
              align-items: flex-start;
            }
          }
        `
      }} />
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <h1 className="track-orders-header" style={{
          fontFamily: 'var(--font-brand)',
          color: 'var(--text-dark)',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          My Orders
        </h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '40px' }}>
          Orders placed on this device are securely saved here for your convenience.
        </p>

        {orders.length === 0 ? (
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '60px 20px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '8px' }}>No orders found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              When you place an order on this device, it will appear here so you can keep track of it.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map((order, index) => {
              const statusInfo = getStatusInfo(order.status);
              
              return (
                <div key={index} style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-subtle)',
                  overflow: 'hidden'
                }}>
                  {/* Order Header */}
                  <div className="order-card-header" style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Order ID
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontFamily: 'monospace', fontSize: '1rem' }}>
                        {order.id}
                      </div>
                    </div>
                    
                    <div className="order-card-right">
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          Date
                        </div>
                        <div style={{ fontWeight: 500, color: 'var(--text-dark)', fontSize: '0.9rem' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {order.cartItems?.map((item, i) => (
                        <div key={i} className="order-item-row">
                          <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '8px',
                            background: '#f1f1f1',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}>
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="order-item-details" style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.95rem', marginBottom: '4px' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              Size: {item.selectedSize} | Qty: {item.quantity}
                            </div>
                          </div>
                          <div className="order-item-price">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="order-card-footer" style={{
                    padding: '16px 20px',
                    background: 'rgba(0,0,0,0.02)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Total Amount
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                      ₦{order.subtotal?.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrdersPage;
