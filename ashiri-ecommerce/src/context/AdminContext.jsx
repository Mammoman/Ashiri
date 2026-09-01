import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { supabase } from '../lib/supabaseClient';

const AdminContext = createContext(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Local state fallbacks (will be overwritten by Supabase if connected)
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminReviews, setAdminReviews] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'ASHIRI',
    storeEmail: 'ashiri@gmail.com',
    storePhone: '+234 000 000 0000',
    currency: '₦',
    paystackConfigured: false,
    emailConfigured: false,
  });

  const [isLoadingSupabase, setIsLoadingSupabase] = useState(true);

  // Listen for Supabase Auth state changes
  useEffect(() => {
    if (!supabase) return;
    
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes (e.g., login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch all data from Supabase on mount
  useEffect(() => {
    if (!supabase) {
      setIsLoadingSupabase(false);
      return;
    }
    
    const fetchSupabaseData = async () => {
      setIsLoadingSupabase(true);
      try {
        // Fetch Settings
        const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (settingsData) {
          setStoreSettings(prev => ({
            ...prev,
            storeName: settingsData.store_name || 'ASHIRI',
            storeEmail: settingsData.store_email || '',
            storePhone: settingsData.store_phone || '',
            currency: settingsData.currency || '₦',
          }));
        }

        // Fetch Products
        const { data: productsData } = await supabase.from('products').select('*').order('id', { ascending: true });
        if (productsData) {
          const formattedProducts = productsData.map(p => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            image: p.image,
            sizes: p.sizes || [],
          }));
          setProducts(formattedProducts);
        }

        // Fetch Gallery
        const { data: galleryData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (galleryData) {
          setGalleryImages(galleryData.map(g => ({ id: g.id, url: g.url, folder: g.folder })));
        }

        // Fetch Orders
        const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (ordersData) {
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
        const { data: reviewsData } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        if (reviewsData) {
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
  }, []);

  const login = async (email, password) => {
    if (!supabase) {
      return { success: false, error: 'Supabase is not configured. Local fallback disabled.' };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  // Products helpers
  const addProduct = async (productData, imageFile) => {
    let imageUrl = '';
    
    if (supabase && imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('brand_assets').upload(filePath, imageFile);
      if (uploadError) {
        console.error('Upload error', uploadError);
        return { success: false, error: uploadError.message };
      }
      
      const { data } = supabase.storage.from('brand_assets').getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    } else if (productData.image) {
      imageUrl = productData.image; // fallback to text URL if provided
    }

    const newProduct = {
      id: Math.floor(Math.random() * 1000000) + 10000, // DB missing auto-increment, generate random ID
      name: productData.name,
      category: 'Uncategorized', // Hardcoded default because it's required by the DB but removed from UI
      price: productData.price,
      image: imageUrl,
      sizes: productData.sizes || [],
      details: [],
      colors: [],
    };

    if (supabase) {
      const { data, error } = await supabase.from('products').insert([newProduct]).select();
      if (error) return { success: false, error: error.message };
      
      if (data && data.length > 0) {
        const p = data[0];
        setProducts(prev => [...prev, {
          id: p.id, name: p.name, price: parseFloat(p.price),
          image: p.image, sizes: p.sizes || [],
        }]);
      }
      return { success: true };
    }
    return { success: false, error: 'Supabase not connected' };
  };

  const deleteProduct = async (productId) => {
    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        console.error(error);
        return false;
      }
    }
    setProducts(prev => prev.filter(p => p.id !== productId));
    return true;
  };

  // Settings helpers
  const updateSettings = async (newSettings) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));
    if (supabase) {
      const { error } = await supabase.from('settings').update({
        store_name: newSettings.storeName,
        store_email: newSettings.storeEmail,
        store_phone: newSettings.storePhone,
        currency: newSettings.currency
      }).eq('id', 1);
      if (error) console.error("Error updating settings:", error);
    }
  };

  // Gallery helpers
  const addGalleryImage = async (imageFile, folder = 'Uncategorized') => {
    if (!supabase || !imageFile) return { success: false, error: 'No image or Supabase connection' };
    
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;
    
    const { error: uploadError } = await supabase.storage.from('brand_assets').upload(filePath, imageFile);
    if (uploadError) return { success: false, error: uploadError.message };
    
    const { data } = supabase.storage.from('brand_assets').getPublicUrl(filePath);
    
    const { data: dbData, error: dbError } = await supabase.from('gallery').insert([{
      url: data.publicUrl,
      folder: folder
    }]).select();
    
    if (dbError) return { success: false, error: dbError.message };
    
    if (dbData && dbData.length > 0) {
      setGalleryImages(prev => [{ id: dbData[0].id, url: dbData[0].url, folder: dbData[0].folder }, ...prev]);
    }
    return { success: true };
  };

  const deleteGalleryImage = async (imageId) => {
    if (supabase) {
      await supabase.from('gallery').delete().eq('id', imageId);
    }
    setGalleryImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Order helpers
  const addOrder = async (order) => {
    const newOrder = {
      id: 'ASH-ORD-' + Math.floor(Math.random() * 10000000 + 1),
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...order,
    };
    
    setOrders((prev) => [newOrder, ...prev]);

    if (supabase) {
      const dbOrder = {
        id: newOrder.id, customer_name: newOrder.customerName, customer_email: newOrder.customerEmail,
        customer_phone: newOrder.customerPhone, customer_address: newOrder.customerAddress,
        subtotal: newOrder.subtotal, payment_method: newOrder.paymentMethod,
        payment_reference: newOrder.paymentReference, status: newOrder.status, cart_items: newOrder.cartItems
      };
      await supabase.from('orders').insert([dbOrder]);
    }
    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    if (supabase) await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  };

  const deleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (supabase) await supabase.from('orders').delete().eq('id', orderId);
  };

  // Review helpers
  const addReview = async (review) => {
    const tempId = Date.now();
    const newReview = { id: tempId, date: new Date().toISOString().split('T')[0], status: 'pending', ...review };
    setAdminReviews((prev) => [newReview, ...prev]);

    if (supabase) {
      const dbReview = { name: newReview.name, rating: newReview.rating, title: newReview.title, comment: newReview.comment, category: newReview.category, verified: newReview.verified, status: newReview.status };
      const { data } = await supabase.from('reviews').insert([dbReview]).select();
      if (data && data.length > 0) {
        setAdminReviews((prev) => prev.map((r) => r.id === tempId ? { ...r, id: data[0].id } : r));
      }
    }
    return newReview;
  };

  const updateReviewStatus = async (reviewId, newStatus) => {
    setAdminReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r)));
    if (supabase) await supabase.from('reviews').update({ status: newStatus }).eq('id', reviewId);
  };

  const deleteReview = async (reviewId) => {
    setAdminReviews((prev) => prev.filter((r) => r.id !== reviewId));
    if (supabase) await supabase.from('reviews').delete().eq('id', reviewId);
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
    isAuthenticated, login, logout,
    products, addProduct, deleteProduct,
    galleryImages, addGalleryImage, deleteGalleryImage,
    storeSettings, updateSettings,
    orders, addOrder, updateOrderStatus, deleteOrder,
    adminReviews, addReview, updateReviewStatus, deleteReview,
    getStats, isLoadingSupabase
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
