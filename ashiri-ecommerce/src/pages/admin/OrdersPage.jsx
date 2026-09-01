import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Search, ChevronDown, ChevronUp, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const OrdersPage = () => {
  const { updateOrderStatus, deleteOrder, fetchOrdersPage } = useAdmin();
  const [localOrders, setLocalOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      const { data, total } = await fetchOrdersPage(page, limit);
      setLocalOrders(data);
      setTotalOrders(total);
      setIsLoading(false);
    };
    loadOrders();
  }, [page, fetchOrdersPage]);

  const filteredOrders = localOrders.filter((order) => {
    const matchesSearch =
      !searchTerm ||
      (order.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const totalPages = Math.ceil(totalOrders / limit);

  return (
    <div>
      {/* Filters */}
      <div className="admin-card" style={{ marginBottom: '20px' }}>
        <div className="admin-filters">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
              style={{ paddingLeft: '34px', width: '100%' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-form-select"
            style={{ width: 'auto', minWidth: '140px' }}
          >
            <option value="all">All Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Orders ({filteredOrders.length})</span>
        </div>
        <div className="admin-card-body">
          {filteredOrders.length === 0 ? (
            <div className="admin-empty">
              <Package size={36} />
              <p>{searchTerm || statusFilter !== 'all' ? 'No orders match your filters.' : 'No orders yet.'}</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '30px' }}></th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr style={{ cursor: 'pointer' }} onClick={() => toggleExpand(order.id)}>
                      <td>
                        {expandedOrder === order.id ? (
                          <ChevronUp size={14} style={{ color: '#94a3b8' }} />
                        ) : (
                          <ChevronDown size={14} style={{ color: '#94a3b8' }} />
                        )}
                      </td>
                      <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.72rem' }}>
                        {order.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{order.customerName || '—'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{order.customerEmail || ''}</div>
                      </td>
                      <td>{order.cartItems ? order.cartItems.length : 0}</td>
                      <td style={{ fontWeight: 700 }}>₦{(order.subtotal || 0).toLocaleString()}</td>
                      <td>
                        <span className={`admin-badge ${order.status || 'pending'}`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('en-NG', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="admin-form-select"
                          style={{ fontSize: '0.72rem', padding: '4px 8px', width: 'auto', minWidth: '100px' }}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan={8} style={{ padding: 0, background: '#fafbfc' }}>
                          <div className="admin-drawer">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                              <div>
                                <div className="admin-drawer-title">Delivery Info</div>
                                <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                                  <strong>{order.customerName}</strong><br />
                                  {order.customerEmail}<br />
                                  {order.customerPhone || '—'}<br />
                                  {order.customerAddress || '—'}
                                </p>
                              </div>
                              <div>
                                <div className="admin-drawer-title">Payment</div>
                                <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                                  <strong>Method:</strong> {order.paymentMethod || 'Paystack'}<br />
                                  <strong>Reference:</strong> {order.paymentReference || '—'}<br />
                                  <strong>Verification:</strong> {order.verificationStatus || '—'}
                                </p>
                              </div>
                            </div>

                            <div className="admin-drawer-title">Order Items</div>
                            {order.cartItems && order.cartItems.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {order.cartItems.map((item, idx) => (
                                  <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px 12px',
                                    background: '#ffffff',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '0.8rem',
                                  }}>
                                    <span style={{ fontWeight: 600, flex: 1 }}>{item.name}</span>
                                    <span style={{ color: '#64748b' }}>Size: {item.selectedSize}</span>
                                    <span style={{ color: '#64748b' }}>x{item.quantity}</span>
                                    <span style={{ fontWeight: 700 }}>₦{(item.price * item.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No item details</p>
                            )}

                            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                              <button
                                className="admin-btn admin-btn-danger admin-btn-sm"
                                onClick={() => {
                                  if (window.confirm('Delete this order?')) {
                                    deleteOrder(order.id);
                                    setExpandedOrder(null);
                                  }
                                }}
                              >
                                Delete Order
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Showing page {page} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="admin-btn admin-btn-secondary admin-btn-sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button 
              className="admin-btn admin-btn-secondary admin-btn-sm" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
