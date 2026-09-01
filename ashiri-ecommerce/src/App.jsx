import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StorefrontPage from './pages/StorefrontPage';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import OrdersPage from './pages/admin/OrdersPage';
import ProductsPage from './pages/admin/ProductsPage';
import ReviewsPage from './pages/admin/ReviewsPage';
import GalleryAdmin from './pages/admin/GalleryAdmin';
import SettingsPage from './pages/admin/SettingsPage';
import './admin.css';

// Admin route guard — shows login if not authenticated
function AdminGuard({ children }) {
  const { isAuthenticated } = useAdmin();
  if (!isAuthenticated) return <AdminLogin />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Storefront */}
      <Route path="/" element={<StorefrontPage />} />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="gallery" element={<GalleryAdmin />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <AppRoutes />
      </AdminProvider>
    </BrowserRouter>
  );
}

export default App;
