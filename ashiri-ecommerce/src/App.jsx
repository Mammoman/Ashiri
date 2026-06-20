import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';

function App() {
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart operations
  const handleAddToCart = (product) => {
    // If we receive options from the modal, use them, otherwise default to first available or N/A
    const chosenSize = product.selectedSize || (product.sizes ? product.sizes[0] : 'S');
    const chosenColor = product.selectedColor || (product.colors ? product.colors[0] : 'Ochre');

    setCart((prevCart) => {
      // Find if item already exists in cart with EXACT same size and color
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor === chosenColor
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

  // Get total count of items in the cart
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-wrapper">
      {/* Premium Navbar */}
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main content wrapped */}
      <main className="content-wrapper">
        {/* Parallax Hero */}
        <Hero />

        {/* Product Showcase */}
        <ProductGrid
          onProductSelect={setSelectedProduct}
          onAddToCart={handleAddToCart}
          searchQuery={searchQuery}
        />
      </main>

      {/* Elegant Footer */}
      <Footer />

      {/* Quick View Details Modal Overlay */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Slide-over Shopping Bag */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}

export default App;
