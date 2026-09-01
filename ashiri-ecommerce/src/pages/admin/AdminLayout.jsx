import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Star,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/reviews', icon: Star, label: 'Reviews' },
  { to: '/admin/gallery', icon: Image, label: 'Gallery' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

const pageTitle = {
  '/admin': 'Dashboard Overview',
  '/admin/orders': 'Order Management',
  '/admin/products': 'Product Management',
  '/admin/reviews': 'Review Moderation',
  '/admin/gallery': 'Gallery Management',
  '/admin/settings': 'Store Settings',
};

const AdminLayout = () => {
  const { logout } = useAdmin();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentTitle = pageTitle[location.pathname] || 'Dashboard';

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 99,
            display: 'none',
          }}
          className="admin-overlay"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            ASHIRI <span>Admin</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section-title">Main Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a
            href="/"
            className="admin-nav-link"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            <ExternalLink size={16} />
            View Storefront
          </a>
          <button
            onClick={logout}
            className="admin-nav-link"
            style={{ color: '#ef4444' }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'none',
                padding: '6px',
                borderRadius: '8px',
              }}
              id="admin-menu-toggle"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className="admin-topbar-title">{currentTitle}</h1>
          </div>
          <div className="admin-topbar-actions">
            <span style={{
              fontSize: '0.72rem',
              color: '#64748b',
              fontWeight: 500,
            }}>
              {new Date().toLocaleDateString('en-NG', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .admin-overlay { display: block !important; }
          #admin-menu-toggle { display: flex !important; }
        }
      `}} />
    </div>
  );
};

export default AdminLayout;
