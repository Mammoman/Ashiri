import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminContext = createContext(null);

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// Unguessable storage path; the extension is derived from the MIME type, not the filename.
function storagePath(folder, file) {
  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[file.type] || 'bin';
  return `${folder}/${crypto.randomUUID()}.${ext}`;
}

function validateImage(file) {
  if (!file) return 'No image selected.';
  if (!IMAGE_TYPES.includes(file.type)) return 'Only JPG, PNG, WEBP or GIF images are allowed.';
  if (file.size > MAX_IMAGE_BYTES) return 'Image must be 5MB or smaller.';
  return null;
}

// Bearer token for calls to admin-only serverless functions.
async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

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
    storeName: 'ÀṢHÍRÍ',
    storeEmail: 'ashiri@gmail.com',
    storePhone: '+234 000 000 0000',
    currency: '₦',
    logoUrl: '/logo.png',
    paystackConfigured: false,
    emailConfigured: false,
  });

  const [isLoadingSupabase, setIsLoadingSupabase] = useState(true);
  // Bumped whenever the auth state changes so data is refetched under the new role
  // (admins can see pending reviews / orders that anonymous visitors cannot).
  const [authVersion, setAuthVersion] = useState(0);

  // A session alone is not enough: the user must also be in public.admins.
  const resolveAdmin = useCallback(async (session) => {
    if (!session) {
      setIsAuthenticated(false);
      return false;
    }
    const { data, error } = await supabase.rpc('is_admin');
    const ok = !error && data === true;
    setIsAuthenticated(ok);
    return ok;
  }, []);

  // Listen for Supabase Auth state changes
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => resolveAdmin(session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      resolveAdmin(session);
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') setAuthVersion((v) => v + 1);
    });

    return () => subscription.unsubscribe();
  }, [resolveAdmin]);

  // Fetch all data from Supabase on mount and whenever the auth role changes
  useEffect(() => {
    if (!supabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
            storeName: settingsData.store_name || 'ÀṢHÍRÍ',
            storeEmail: settingsData.store_email || '',
            storePhone: settingsData.store_phone || '',
            currency: settingsData.currency || '₦',
            logoUrl: settingsData.logo_url || '/logo.png',
          }));
        }

        // Fetch Products (Initial load limited for dashboard)
        const { data: productsData } = await supabase.from('products').select('*').order('id', { ascending: true }).limit(50);
        if (productsData) {
          const formattedProducts = productsData.map(p => ({
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            image: p.image,
            image2: p.image2,
            sizes: p.sizes || [],
          }));
          setProducts(formattedProducts);
        }

        // Fetch Gallery
        const { data: galleryData } = await supabase
          .from('gallery')
          .select('*')
          .order('position', { ascending: true })
          .order('created_at', { ascending: false });
        if (galleryData) {
          setGalleryImages(galleryData.map(g => ({ id: g.id, url: g.url, folder: g.folder, position: g.position || 0 })));
        }

        // Fetch Orders (Initial load limited for dashboard)
        const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50);
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoadingSupabase(false);
      }
    };

    fetchSupabaseData();
  }, [authVersion]);

  const login = async (email, password) => {
    if (!supabase) {
      return { success: false, error: 'Supabase is not configured. Local fallback disabled.' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

    const isAdmin = await resolveAdmin(data.session);
    if (!isAdmin) {
      await supabase.auth.signOut();
      return { success: false, error: 'This account does not have admin access.' };
    }
    return { success: true };
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  // Uploads a validated image to brand_assets and returns its public URL.
  const uploadImage = async (folder, file) => {
    const problem = validateImage(file);
    if (problem) return { error: problem };
    const filePath = storagePath(folder, file);
    const { error } = await supabase.storage.from('brand_assets').upload(filePath, file, { contentType: file.type });
    if (error) return { error: error.message };
    return { url: supabase.storage.from('brand_assets').getPublicUrl(filePath).data.publicUrl };
  };

  const formatProduct = (p) => ({
    id: p.id, name: p.name, price: parseFloat(p.price),
    image: p.image, image2: p.image2, sizes: p.sizes || [],
  });

  // Products helpers
  const addProduct = async (productData, imageFile, image2File) => {
    if (!supabase) return { success: false, error: 'Supabase not connected' };

    let imageUrl = productData.image || '';
    let image2Url = '';

    if (imageFile) {
      const { url, error } = await uploadImage('products', imageFile);
      if (error) return { success: false, error };
      imageUrl = url;
    }
    if (image2File) {
      const { url, error } = await uploadImage('products', image2File);
      if (error) console.error('Secondary upload error', error);
      else image2Url = url;
    }

    // id is generated by the database (products_id_seq).
    const newProduct = {
      name: productData.name,
      category: 'Uncategorized', // Hardcoded default because it's required by the DB but removed from UI
      price: productData.price,
      image: imageUrl,
      image2: image2Url || null,
      sizes: productData.sizes || [],
      details: [],
      colors: [],
    };

    const { data, error } = await supabase.from('products').insert([newProduct]).select();
    if (error) return { success: false, error: error.message };
    if (data && data.length > 0) setProducts(prev => [...prev, formatProduct(data[0])]);
    return { success: true };
  };

  const updateProduct = async (productId, productData, imageFile, image2File) => {
    if (!supabase) return { success: false, error: 'Supabase not connected' };

    let imageUrl = productData.image || '';
    let image2Url = productData.image2 || '';

    if (imageFile) {
      const { url, error } = await uploadImage('products', imageFile);
      if (error) return { success: false, error };
      imageUrl = url;
    }
    if (image2File) {
      const { url, error } = await uploadImage('products', image2File);
      if (error) console.error('Secondary upload error', error);
      else image2Url = url;
    }

    const updatedProductData = {
      name: productData.name,
      price: productData.price,
      image: imageUrl,
      image2: image2Url || null,
      sizes: productData.sizes || [],
    };

    const { data, error } = await supabase.from('products').update(updatedProductData).eq('id', productId).select();
    if (error) return { success: false, error: error.message };
    if (data && data.length > 0) {
      setProducts(prev => prev.map(item => item.id === productId ? formatProduct(data[0]) : item));
    }
    return { success: true };
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
  const updateSettings = async (newSettings, logoFile = null) => {
    let logoUrl = newSettings.logoUrl;

    if (logoFile && supabase) {
      const { url, error } = await uploadImage('brand_assets', logoFile);
      if (!error && url) {
        logoUrl = url;
      } else if (error) {
        console.error('Error uploading logo:', error);
      }
    }

    const updatedSettings = { ...newSettings, logoUrl };
    setStoreSettings(prev => ({ ...prev, ...updatedSettings }));

    if (supabase) {
      const { error } = await supabase.from('settings').update({
        store_name: updatedSettings.storeName,
        store_email: updatedSettings.storeEmail,
        store_phone: updatedSettings.storePhone,
        currency: updatedSettings.currency,
        logo_url: updatedSettings.logoUrl
      }).eq('id', 1);
      if (error) console.error("Error updating settings:", error);
    }
  };

  // Gallery helpers
  const addGalleryImage = async (imageFile, folder = 'Uncategorized') => {
    if (!supabase) return { success: false, error: 'No Supabase connection' };

    const { url, error: uploadError } = await uploadImage('gallery', imageFile);
    if (uploadError) return { success: false, error: uploadError };

    const { data: dbData, error: dbError } = await supabase.from('gallery').insert([{ url, folder }]).select();
    if (dbError) return { success: false, error: dbError.message };

    if (dbData && dbData.length > 0) {
      setGalleryImages(prev => [{ id: dbData[0].id, url: dbData[0].url, folder: dbData[0].folder }, ...prev]);
    }
    return { success: true };
  };

  // Storefront "share your fit" — anonymous visitors may only upload into
  // community/ and only create rows in the community_pending folder (enforced by RLS).
  const submitCommunityFit = async (imageFile) => {
    if (!supabase) return { success: false, error: 'No Supabase connection' };

    const { url, error: uploadError } = await uploadImage('community', imageFile);
    if (uploadError) return { success: false, error: uploadError };

    const { error: dbError } = await supabase.from('gallery').insert([{ url, folder: 'community_pending' }]);
    if (dbError) return { success: false, error: dbError.message };
    return { success: true };
  };

  const addGalleryImages = async (imageFiles, folder = 'Uncategorized') => {
    if (!supabase || !imageFiles || imageFiles.length === 0) return { success: false, error: 'No images or Supabase connection' };
    
    const uploadedImages = [];
    
    for (const file of imageFiles) {
      const { url, error } = await uploadImage('gallery', file);
      if (error) {
        console.error('Upload error for file:', file.name, error);
        continue; // skip this file and continue with others
      }
      uploadedImages.push({ url, folder });
    }
    
    if (uploadedImages.length === 0) {
      return { success: false, error: 'All uploads failed' };
    }
    
    // Batch insert to DB
    const { data: dbData, error: dbError } = await supabase.from('gallery').insert(uploadedImages).select();
    
    if (dbError) return { success: false, error: dbError.message };
    
    if (dbData && dbData.length > 0) {
      const formatted = dbData.map(g => ({ id: g.id, url: g.url, folder: g.folder, position: g.position || 0 }));
      setGalleryImages(prev => [...formatted, ...prev]);
    }
    
    return { success: true, count: uploadedImages.length };
  };

  const updateGalleryOrder = async (orderedImages) => {
    // Optimistically update local state
    setGalleryImages(orderedImages);
    
    if (!supabase) return;
    
    // In Supabase, batch updates using upsert based on primary key (id)
    // We map only the fields needed to avoid writing over other things accidentally
    const updates = orderedImages.map(img => ({
      id: img.id,
      position: img.position,
      url: img.url,
      folder: img.folder
    }));
    
    const { error } = await supabase.from('gallery').upsert(updates, { onConflict: 'id' });
    if (error) {
      console.error('Error updating gallery order in DB:', error);
    }
  };

  const deleteGalleryImage = async (imageId) => {
    if (supabase) {
      await supabase.from('gallery').delete().eq('id', imageId);
    }
    setGalleryImages(prev => prev.filter(img => img.id !== imageId));
  };

  const approveCommunityFit = async (imageId) => {
    if (supabase) {
      const { error } = await supabase.from('gallery').update({ folder: 'community' }).eq('id', imageId);
      if (error) {
        console.error('Error approving fit:', error);
        return { success: false, error: error.message };
      }
    }
    setGalleryImages(prev => prev.map(img => img.id === imageId ? { ...img, folder: 'community' } : img));
    return { success: true };
  };

  // Pagination helpers
  const fetchProductsPage = async (page = 1, limit = 20) => {
    if (!supabase) return { data: [], total: 0 };
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true })
      .range(from, to);
    
    return {
      data: data ? data.map(p => ({
        id: p.id, name: p.name, price: parseFloat(p.price),
        image: p.image, image2: p.image2, sizes: p.sizes || []
      })) : [],
      total: count || 0
    };
  };

  const fetchOrdersPage = async (page = 1, limit = 20) => {
    if (!supabase) return { data: [], total: 0 };
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, count } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    return {
      data: data ? data.map(o => ({
        id: o.id, createdAt: o.created_at, customerName: o.customer_name,
        customerEmail: o.customer_email, customerPhone: o.customer_phone,
        customerAddress: o.customer_address, subtotal: o.subtotal,
        paymentMethod: o.payment_method, paymentReference: o.payment_reference,
        status: o.status, cartItems: o.cart_items
      })) : [],
      total: count || 0
    };
  };

  // Order helpers
  // Checkout goes through /api/create-order, which re-prices the cart from the
  // database and verifies the Flutterwave transaction before saving anything.
  const createOrder = async ({ customer, items, transactionId, txRef }) => {
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        transactionId,
        txRef,
        items: items.map((i) => ({
          id: i.id,
          selectedSize: i.selectedSize,
          selectedColor: i.selectedColor,
          quantity: i.quantity,
          isGift: !!i.isGift,
          giftMessage: i.giftMessage || '',
        })),
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, error: body.error || 'Could not place order.' };
    return { success: true, order: body.order, emailSent: body.emailSent };
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const previous = orders.find((o) => o.id === orderId)?.status;
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

    // The serverless function updates the row and emails the customer for
    // shipped / delivered / cancelled. It requires the admin's session token.
    try {
      const res = await fetch('/api/update-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!res.ok) {
        console.error('Failed to update order status:', await res.text());
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: previous } : o)));
        return { success: false };
      }
      return { success: true };
    } catch (err) {
      console.error('Fetch to /api/update-order-status failed:', err);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: previous } : o)));
      return { success: false };
    }
  };

  const deleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (supabase) await supabase.from('orders').delete().eq('id', orderId);
  };

  // Review helpers
  // Storefront submissions are always pending + unverified (also enforced by RLS);
  // an admin approves them from the Reviews page.
  const addReview = async (review) => {
    if (!supabase) return { success: false, error: 'Supabase not connected' };
    const dbReview = {
      name: review.name, rating: review.rating, title: review.title,
      comment: review.comment, category: review.category,
      verified: false, status: 'pending',
    };
    const { error } = await supabase.from('reviews').insert([dbReview]);
    if (error) return { success: false, error: error.message };
    return { success: true };
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
    products, addProduct, updateProduct, deleteProduct,
    galleryImages, 
    addGalleryImage,
    addGalleryImages,
    updateGalleryOrder,
    deleteGalleryImage,
    approveCommunityFit,
    submitCommunityFit,
    storeSettings, updateSettings,
    orders, createOrder, updateOrderStatus, deleteOrder,
    fetchProductsPage, fetchOrdersPage,
    adminReviews, addReview, updateReviewStatus, deleteReview,
    getStats, isLoadingSupabase
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
