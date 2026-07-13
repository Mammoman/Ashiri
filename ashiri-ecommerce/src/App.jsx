import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import CartSidebar from './components/CartSidebar';
import Gallery from './components/Gallery';
import GalleryPage from './components/GalleryPage';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import { products } from './data/mockData';

function App() {
  const [currentPage, setCurrentPage] = useState('shop');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('cart'); // 'cart' or 'wishlist'
  const [favorites, setFavorites] = useState({});

  const handleToggleFavorite = (productId) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const wishlistItems = products.filter(product => favorites[product.id]);
  const wishlistCount = wishlistItems.length;

  // Cart operations
  const handleAddToCart = (product) => {
    // If we receive options from the modal, use them, otherwise default to first available or N/A
    const chosenSize = product.selectedSize || (product.sizes ? product.sizes[0] : 'S');
    const chosenColor = product.selectedColor || (product.colors ? product.colors[0] : 'Ochre');
    const isGiftItem = !!product.isGift;
    const giftMessageText = product.giftMessage || '';

    setCart((prevCart) => {
      // Find if item already exists in cart with EXACT same size, color, and gift packaging options
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor === chosenColor &&
          !!item.isGift === isGiftItem &&
          (item.giftMessage || '') === giftMessageText
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            ...product,
            selectedSize: chosenSize,
            selectedColor: chosenColor,
            isGift: isGiftItem,
            giftMessage: giftMessageText,
            quantity: 1,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (targetItem, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(targetItem);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === targetItem.id &&
        item.selectedSize === targetItem.selectedSize &&
        item.selectedColor === targetItem.selectedColor
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (targetItem) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.id === targetItem.id &&
            item.selectedSize === targetItem.selectedSize &&
            item.selectedColor === targetItem.selectedColor
          )
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Get total count of items in the cart
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="app-wrapper">
      {/* Premium Navbar */}
      <Navbar
        cartCount={cartCount}
        onCartClick={() => { setSidebarTab('cart'); setIsCartOpen(true); }}
        wishlistCount={wishlistCount}
        onWishlistClick={() => { setSidebarTab('wishlist'); setIsCartOpen(true); }}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Main content wrapped */}
      <main className="content-wrapper">
        {currentPage === 'shop' ? (
          <>
            {/* Parallax Hero */}
            <Hero />

            {/* Product Showcase */}
            <ProductGrid
              onProductSelect={setSelectedProduct}
              onAddToCart={handleAddToCart}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* Lookbook Gallery */}
            <Gallery onViewGallery={() => handlePageChange('gallery')} />

            {/* Customer Reviews */}
            <Reviews />
          </>
        ) : (
          <GalleryPage onBackToShop={() => handlePageChange('shop')} />
        )}
      </main>

      {/* Elegant Footer */}
      <Footer onPageChange={handlePageChange} />

      {/* Quick View Details Modal Overlay */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Slide-over Shopping Bag */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onAddToCart={handleAddToCart}
        defaultTab={sidebarTab}
        wishlistItems={wishlistItems}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}

export default App;
