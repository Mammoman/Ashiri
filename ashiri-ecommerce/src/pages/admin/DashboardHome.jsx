import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { DollarSign, ShoppingBag, TrendingUp, Package, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardHome = () => {
  const { orders, getStats, products } = useAdmin();
  const stats = getStats();

  // Generate chart data from orders (last 7 days)
  const generateChartData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOrders = orders.filter(
        (o) => o.createdAt && o.createdAt.split('T')[0] === dateStr
      );
      const revenue = dayOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
      days.push({
        date: date.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric' }),
        revenue,
        orders: dayOrders.length,
      });
    }
    return days;
  };

  const chartData = generateChartData();
  const recentOrders = orders.slice(0, 8);

  return (
    <div>
      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Total Revenue</div>
          <div className="admin-kpi-value">₦{stats.totalRevenue.toLocaleString()}</div>
          <div className="admin-kpi-icon">
            <DollarSign size={24} />
          </div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Total Orders</div>
          <div className="admin-kpi-value">{stats.totalOrders}</div>
          <div className="admin-kpi-icon">
            <ShoppingBag size={24} />
          </div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Avg. Order Value</div>
          <div className="admin-kpi-value">₦{stats.avgOrderValue.toLocaleString()}</div>
          <div className="admin-kpi-icon">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="admin-kpi-card">
          <div className="admin-kpi-label">Pending Orders</div>
          <div className="admin-kpi-value">{stats.pendingOrders}</div>
          <div className="admin-kpi-icon">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Charts + Recent Orders */}
      <div className="admin-grid-3">
        {/* Revenue Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Revenue (Last 7 Days)</span>
          </div>
          <div className="admin-chart-container" style={{ height: '280px' }}>
            {orders.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0f172a',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.78rem',
                    }}
                    formatter={(v) => [`₦${v.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="admin-empty" style={{ padding: '40px 20px' }}>
                <TrendingUp size={36} />
                <p>No order data yet. Revenue chart will appear here once orders are placed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Catalog Quick Stats */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Products</span>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
              {products.length} items
            </span>
          </div>
          <div className="admin-card-body">
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 18px',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#f1f5f9',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#0f172a',
                    }}
                  >
                    {product.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: '#64748b',
                    }}
                  >
                    {product.category}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  ₦{product.price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-card" style={{ marginTop: '20px' }}>
        <div className="admin-card-header">
          <span className="admin-card-title">Recent Orders</span>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
            {orders.length} total
          </span>
        </div>
        <div className="admin-card-body">
          {recentOrders.length === 0 ? (
            <div className="admin-empty">
              <ShoppingBag size={36} />
              <p>No orders yet. Orders will appear here after customers make purchases.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {order.id}
                    </td>
                    <td>{order.customerName || '—'}</td>
                    <td style={{ fontWeight: 600 }}>
                      ₦{(order.subtotal || 0).toLocaleString()}
                    </td>
                    <td>
                      <span className={`admin-badge ${order.status || 'pending'}`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.78rem' }}>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
