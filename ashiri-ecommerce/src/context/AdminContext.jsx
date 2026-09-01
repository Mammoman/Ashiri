import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { supabase } from '../lib/supabaseClient';

const AdminContext = createContext(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

const defaultInitialReviews = [
  {
    id: 1,
    name: 'Yemi A.',
    rating: 5,
    title: 'Perfection ooo',
    comment: 'The Grey Tank is sooo beautiful. It fits perfectly and the fabric quality is unmatched.',
    date: '2026-06-25',
    verified: true,
    category: 'Female',
    status: 'approved'
  },
  {
    id: 2,
    name: 'Chinedu O.',
    rating: 5,
    title: 'Feeling Flyy',
    comment: 'Got the red tank and omoo it fits my style perfectly. Super breathable for Lagos weather.',
    date: '2026-06-18',
    verified: true,
    category: 'Unisex',
    status: 'approved'
  },
  {
    id: 3,
    name: 'Sarah K.',
    rating: 5,
    title: 'Incredible Craftsmanship',
    comment: 'The knit detail and heavy-weight cotton feel premium. Truly an artisanal piece.',
    date: '2026-06-10',
    verified: true,
    category: 'Female',
    status: 'approved'
  }
];

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('ashiri_admin_auth', false);
  const [orders, setOrders] = useLocalStorage('ashiri_orders', []);
  const [adminReviews, setAdminReviews] = useLocalStorage('ashiri_admin_reviews', defaultInitialReviews);
  const [galleryImages, setGalleryImages] = useLocalStorage('ashiri_gallery', []);
  const [storeSettings, setStoreSettings] = useLocalStorage('ashiri_settings', {
    storeName: 'ASHIRI',
    storeEmail: 'ashiri@gmail.com',
    storePhone: '+234 000 000 0000',
    currency: '₦',
    paystackConfigured: false,
    emailConfigured: false,
  });

  const [isLoadingSupabase, setIsLoadingSupabase] = useState(false);

  // Fetch from Supabase on mount if available
  useEffect(() => {
    if (!supabase) return;
    
    const fetchSupabaseData = async () => {
      setIsLoadingSupabase(true);
      try {
        // Fetch Orders
        const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!ordersError && ordersData && ordersData.length > 0) {
          // Map DB snake_case back to frontend camelCase if needed
          const formattedOrders = ordersData.map(o => ({
            id: o.id,
            createdAt: o.created_at,
            customerName: o.customer_name,
            customerEmail: o.customer_email,
            customerPhone: o.customer_phone,
            customerAddress: o.customer_address,
            subtotal: parseFloat(o.subtotal),
            paymentMethod: o.payment_method,
            paymentReference: o.payment_reference,
            status: o.status,
            cartItems: o.cart_items
          }));
          setOrders(formattedOrders);
        }

        // Fetch Reviews
        const { data: reviewsData, error: reviewsError } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        if (!reviewsError && reviewsData && reviewsData.length > 0) {
          const formattedReviews = reviewsData.map(r => ({
            id: r.id,
            date: r.created_at.split('T')[0],
            name: r.name,
            rating: r.rating,
            title: r.title,
            comment: r.comment,
            category: r.category,
            verified: r.verified,
            status: r.status
          }));
          setAdminReviews(formattedReviews);
        }
      } catch (err) {
        console.error('Error fetching from Supabase:', err);
      } finally {
        setIsLoadingSupabase(false);
      }
    };

    fetchSupabaseData();
  }, [supabase]);

  const login = (password) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'ashiri2026';
    if (password === adminPassword) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Order helpers
  const addOrder = async (order) => {
    const newOrder = {
      id: 'ASH-ORD-' + Math.floor(Math.random() * 10000000 + 1),
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...order,
    };
    
    // Optimistic UI update
    setOrders((prev) => [newOrder, ...prev]);

    // Save to Supabase
    if (supabase) {
      const dbOrder = {
        id: newOrder.id,
        customer_name: newOrder.customerName,
        customer_email: newOrder.customerEmail,
        customer_phone: newOrder.customerPhone,
        customer_address: newOrder.customerAddress,
        subtotal: newOrder.subtotal,
        payment_method: newOrder.paymentMethod,
        payment_reference: newOrder.paymentReference,
        status: newOrder.status,
        cart_items: newOrder.cartItems
      };
      const { error } = await supabase.from('orders').insert([dbOrder]);
      if (error) console.error("Error inserting order to Supabase:", error);
    }
    
    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (supabase) {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) console.error("Error updating order in Supabase:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (supabase) {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) console.error("Error deleting order from Supabase:", error);
    }
  };

  // Review helpers
  const addReview = async (review) => {
    const tempId = Date.now();
    const newReview = {
      id: tempId,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      ...review,
    };
    
    // Optimistic update
    setAdminReviews((prev) => [newReview, ...prev]);

    if (supabase) {
      const dbReview = {
        name: newReview.name,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        category: newReview.category,
        verified: newReview.verified,
        status: newReview.status
      };
      
      const { data, error } = await supabase.from('reviews').insert([dbReview]).select();
      if (error) {
        console.error("Error inserting review to Supabase:", error);
      } else if (data && data.length > 0) {
        // Update with real ID from DB
        setAdminReviews((prev) => 
          prev.map((r) => r.id === tempId ? { ...r, id: data[0].id } : r)
        );
      }
    }
    
    return newReview;
  };

  const updateReviewStatus = async (reviewId, newStatus) => {
    setAdminReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
    );
    if (supabase) {
      const { error } = await supabase.from('reviews').update({ status: newStatus }).eq('id', reviewId);
      if (error) console.error("Error updating review in Supabase:", error);
    }
  };

  const deleteReview = async (reviewId) => {
    setAdminReviews((prev) => prev.filter((r) => r.id !== reviewId));
    if (supabase) {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
      if (error) console.error("Error deleting review from Supabase:", error);
    }
  };

  // Dashboard stats
  const getStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
    return { totalOrders, totalRevenue, avgOrderValue, pendingOrders, deliveredOrders };
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    orders,
    setOrders,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    adminReviews,
    setAdminReviews,
    addReview,
    updateReviewStatus,
    deleteReview,
    galleryImages,
    setGalleryImages,
    storeSettings,
    setStoreSettings,
    getStats,
    isLoadingSupabase
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
