import React, { useState, useEffect } from 'react';
import { Star, Heart, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';

// Premium Shimmering Skeleton Loader for Product Cards
const ProductCardSkeleton = () => (
  <div
    className="product-card"
    style={{
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      pointerEvents: 'none'
    }}
  >
    {/* Shimmer Image Box */}
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '115%', // Matches product-card image aspect ratio
        overflow: 'hidden',
      }}
      className="shimmer-bg"
    />

    {/* Details Shimmer Group */}
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Brand & Star Rating row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '4px'
      }}>
        {/* Brand placeholder */}
        <div className="skeleton-text shimmer-bg short" style={{ margin: 0, height: '10px' }} />
        {/* Rating placeholder */}
        <div className="skeleton-text shimmer-bg" style={{ margin: 0, height: '10px', width: '40px' }} />
      </div>

      {/* Product Title (2 lines) */}
      <div style={{ height: '34px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div className="skeleton-text shimmer-bg long" style={{ margin: 0 }} />
        <div className="skeleton-text shimmer-bg medium" style={{ margin: 0 }} />
      </div>

      {/* Price Layout */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px',
        marginTop: '4px'
      }}>
        <div className="skeleton-text shimmer-bg" style={{ margin: 0, height: '14px', width: '60px' }} />
      </div>
    </div>
  </div>
);

const ProductGrid = ({ products = [], onProductSelect, onAddToCart, favorites = {}, onToggleFavorite }) => {
  const [sortBy, setSortBy] = useState('featured');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Simulated Loading state on mount, sorting, category change
  useEffect(() => {
    setIsLoading(true);
    const delay = 800;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [sortBy, activeCategory]);

  // Toggle favorite state
  const toggleFavorite = (id, e) => {
    e.stopPropagation(); // Avoid triggering product modal
    onToggleFavorite(id);
  };

  // Extract unique categories and grab the first image for each
  const categoryMap = {};
  products.forEach(p => {
    if (p.category && p.category.trim() !== '' && !categoryMap[p.category]) {
      categoryMap[p.category] = p.image;
    }
  });
  
  const circularCategories = Object.keys(categoryMap).map(catName => ({
    name: catName,
    image: categoryMap[catName]
  }));

  // Filter products by category
  const filteredProducts = products.filter(product => {
    return activeCategory === 'All' || product.category === activeCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // 'featured'
  });

  return (
    <section id="collection" style={{ padding: '30px 0 60px 0', background: 'var(--bg-main)' }}>
      <div className="container">

        {/* Section Header: Curated For You */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            textTransform: 'capitalize',
            letterSpacing: '-0.02em',
            color: 'var(--text-dark)'
          }}>
            Curated For You
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing {sortedProducts.length} items
          </span>
        </div>

        {/* Horizontal Scrolling Circular Avatars */}
        {circularCategories.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            paddingBottom: '24px',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }} className="category-scroll">
            
            {/* 'All' category circle */}
            <div 
              onClick={() => setActiveCategory('All')}
              className={`circle-category ${activeCategory === 'All' ? 'active' : ''}`}
              style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <div 
                className="flex-center" 
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: activeCategory === 'All' ? 'var(--text-dark)' : '#ffffff',
                  color: activeCategory === 'All' ? '#ffffff' : 'var(--text-dark)',
                  border: `2px solid ${activeCategory === 'All' ? 'var(--text-dark)' : 'var(--color-border)'}`,
                  transition: 'all 0.2s ease',
                  boxShadow: activeCategory === 'All' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>ALL</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: activeCategory === 'All' ? 'var(--text-dark)' : 'var(--text-muted)' }}>
                All Items
              </span>
            </div>

            {circularCategories.map(cat => (
              <div 
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`circle-category ${activeCategory === cat.name ? 'active' : ''}`}
                style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${activeCategory === cat.name ? 'var(--text-dark)' : 'transparent'}`,
                  padding: activeCategory === cat.name ? '2px' : '0',
                  transition: 'all 0.2s ease',
                  boxShadow: activeCategory === cat.name ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: activeCategory === cat.name ? 'var(--text-dark)' : 'var(--text-muted)' }}>
                  {cat.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="product-grid-layout">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="flex-center" style={{
            flexDirection: 'column',
            padding: '60px 0',
            textAlign: 'center',
            gap: '12px'
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No products found.</p>
            <button
              onClick={() => { setActiveCategory('All'); }}
              className="filter-btn active"
              style={{ padding: '8px 16px', fontSize: '0.75rem' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="product-grid-layout">
            {sortedProducts.map(product => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => onProductSelect(product)}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
              >
                {/* Image Container with Heart Favorite floating */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '115%', // Aspect Ratio
                  overflow: 'hidden',
                  background: '#f3f4f6'
                }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Floating heart icon */}
                  <button
                    onClick={(e) => toggleFavorite(product.id, e)}
                    aria-label={favorites[product.id] ? "Remove from favorites" : "Add to favorites"}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 5,
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      color: favorites[product.id] ? 'var(--color-sale)' : 'var(--text-muted)'
                    }}
                    className="flex-center heart-badge"
                  >
                    <Heart size={15} fill={favorites[product.id] ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Details Section */}
                <div style={{ padding: '16px' }}>
                  {/* Brand & Star Rating row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                  }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase'
                    }}>
                      ASHIRI
                    </span>
                    {product.rating !== undefined && product.reviews !== undefined && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                          {product.rating}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          ({product.reviews})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Title */}
                  <h3 style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-dark)',
                    lineHeight: '1.3',
                    marginBottom: '8px',
                    height: '34px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {product.name}
                  </h3>

                  {/* Price Layout: Clean single price */}
                  <div>
                    <span style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--text-dark)'
                    }}>
                      ₦{product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid specific Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .product-grid-layout {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .category-scroll::-webkit-scrollbar {
          display: none;
        }

        .heart-badge:hover {
          transform: scale(1.08);
          background: #fdf2f2 !important;
        }

        @media (max-width: 1024px) {
          .product-grid-layout {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 768px) {
          .product-grid-layout {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}} />
    </section>
  );
};

export default ProductGrid;
