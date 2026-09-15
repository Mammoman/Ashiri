import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

const TrackOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const savedOrders = JSON.parse(localStorage.getItem('ashiri_guest_orders') || '[]');
    const sortedOrders = savedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setOrders(sortedOrders);

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
          const updatedOrders = sortedOrders.map(order => {
            const liveOrder = liveData.find(lo => lo.id === order.id);
            return liveOrder ? { ...order, status: liveOrder.status } : order;
          });
          setOrders(updatedOrders);
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
      case 'shipped':   return { color: '#3b82f6', bg: '#eff6ff', icon: <Truck size={14} />,        label: 'Shipped'    };
      case 'delivered': return { color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle size={14} />,  label: 'Delivered'  };
      case 'cancelled': return { color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={14} />,      label: 'Cancelled'  };
      default:          return { color: '#f59e0b', bg: '#fffbeb', icon: <Clock size={14} />,         label: 'Processing' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 16px 60px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .trk-inner { width: 100%; max-width: 680px; }
        .trk-title { font-family: var(--font-brand); font-size: 2rem; color: var(--text-dark); text-align: center; margin-bottom: 8px; }
        .trk-sub { color: var(--text-muted); text-align: center; font-size: 0.9rem; line-height: 1.5; margin-bottom: 36px; }
        .ord-card { background: var(--bg-secondary); border-radius: 14px; box-shadow: var(--shadow-subtle); overflow: hidden; border: 1px solid rgba(0,0,0,0.06); }
        .ord-hdr { padding: 16px 18px 14px; border-bottom: 1px solid rgba(0,0,0,0.06); }
        .ord-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
        .ord-id-lbl { font-size: 0.72rem; color: var(--text-muted); font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 3px; }
        .ord-id-val { font-weight: 700; color: var(--text-dark); font-family: monospace; font-size: 0.92rem; word-break: break-all; }
        .ord-badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 11px; border-radius: 20px; font-weight: 600; font-size: 0.78rem; white-space: nowrap; flex-shrink: 0; }
        .ord-date { display: flex; align-items: center; gap: 6px; }
        .ord-date-lbl { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
        .ord-date-val { font-size: 0.75rem; font-weight: 600; color: var(--text-dark); }
        .ord-items { padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; }
        .ord-item { display: flex; gap: 12px; align-items: center; }
        .ord-img { width: 60px; height: 60px; border-radius: 8px; background: #f1f1f1; overflow: hidden; flex-shrink: 0; }
        .ord-img img { width: 100%; height: 100%; object-fit: cover; }
        .ord-info { flex: 1; min-width: 0; }
        .ord-name { font-weight: 600; color: var(--text-dark); font-size: 0.9rem; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.35; }
        .ord-meta { font-size: 0.78rem; color: var(--text-muted); }
        .ord-price { font-weight: 700; color: var(--text-dark); font-size: 0.9rem; flex-shrink: 0; text-align: right; white-space: nowrap; }
        .ord-foot { padding: 14px 18px; background: rgba(0,0,0,0.025); border-top: 1px solid rgba(0,0,0,0.06); display: flex; justify-content: space-between; align-items: center; }
        .foot-lbl { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
        .foot-tot { font-size: 1.1rem; font-weight: 800; color: var(--text-dark); }
      ` }} />

      <div className="trk-inner">
        <h1 className="trk-title">My Orders</h1>
        <p className="trk-sub">Orders placed on this device are securely saved here for your convenience.</p>

        {orders.length === 0 ? (
          <div style={{ background: 'var(--bg-secondary)', padding: '60px 20px', borderRadius: '16px', textAlign: 'center', boxShadow: 'var(--shadow-subtle)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '8px' }}>No orders yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              When you place an order on this device, it will appear here so you can keep track of it.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order, index) => {
              const s = getStatusInfo(order.status);
              return (
                <div key={index} className="ord-card">
                  <div className="ord-hdr">
                    <div className="ord-top">
                      <div>
                        <div className="ord-id-lbl">Order ID</div>
                        <div className="ord-id-val">{order.id}</div>
                      </div>
                      <div className="ord-badge" style={{ background: s.bg, color: s.color }}>
                        {s.icon}{s.label}
                      </div>
                    </div>
                    <div className="ord-date">
                      <span className="ord-date-lbl">Date:</span>
                      <span className="ord-date-val">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="ord-items">
                    {order.cartItems?.map((item, i) => (
                      <div key={i} className="ord-item">
                        <div className="ord-img"><img src={item.image} alt={item.name} /></div>
                        <div className="ord-info">
                          <div className="ord-name">{item.name}</div>
                          <div className="ord-meta">Size: {item.selectedSize}&nbsp;|&nbsp;Qty: {item.quantity}</div>
                        </div>
                        <div className="ord-price">&#8358;{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  <div className="ord-foot">
                    <span className="foot-lbl">Total Amount</span>
                    <span className="foot-tot">&#8358;{order.subtotal?.toLocaleString()}</span>
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
