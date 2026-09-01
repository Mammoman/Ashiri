import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import ProductModal from '../components/ProductModal';
import CartSidebar from '../components/CartSidebar';
import Gallery from '../components/Gallery';
import GalleryPage from '../components/GalleryPage';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAdmin } from '../context/AdminContext';

function StorefrontPage() {
  const { products, isLoadingSupabase } = useAdmin();
  const [currentPage, setCurrentPage] = React.useState('shop');
  const [cart, setCart] = useLocalStorage('ashiri_cart', []);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [sidebarTab, setSidebarTab] = React.useState('cart');
  const [favorites, setFavorites] = useLocalStorage('ashiri_wishlist', {});

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
    const chosenSize = product.selectedSize || (product.sizes ? product.sizes[0] : 'S');
    const chosenColor = product.selectedColor || (product.colors ? product.colors[0] : 'Standard');
    const isGiftItem = !!product.isGift;
    const giftMessageText = product.giftMessage || '';

    setCart((prevCart) => {
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

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="app-wrapper">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => { setSidebarTab('cart'); setIsCartOpen(true); }}
        wishlistCount={wishlistCount}
        onWishlistClick={() => { setSidebarTab('wishlist'); setIsCartOpen(true); }}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <main className="content-wrapper">
        {currentPage === 'shop' ? (
          <>
            <Hero />
            <ProductGrid
              products={products}
              onProductSelect={setSelectedProduct}
              onAddToCart={handleAddToCart}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
            <Gallery onViewGallery={() => handlePageChange('gallery')} />
            <Reviews />
          </>
        ) : (
          <GalleryPage onBackToShop={() => handlePageChange('shop')} />
        )}
      </main>

      <Footer onPageChange={handlePageChange} />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

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

export default StorefrontPage;
