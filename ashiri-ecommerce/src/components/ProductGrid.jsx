import React, { useState } from 'react';
import { Star, Heart, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { products, circularCategories } from '../data/mockData';

const ProductGrid = ({ onProductSelect, onAddToCart, searchQuery }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState({});

  // Toggle favorite state
  const toggleFavorite = (id, e) => {
    e.stopPropagation(); // Avoid triggering product modal
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter products by category & search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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

        {/* Shop By Category (Mockup Circular Category Row) */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'capitalize',
              letterSpacing: '-0.02em',
              color: 'var(--text-dark)'
            }}>
              Shop By Category
            </h2>
            <button
              onClick={() => setActiveCategory('All')}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-muted)'
              }}
            >
              See All
            </button>
          </div>

          {/* Horizontal Scrolling Circular Avatars */}
          <div style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'none'
          }} className="category-scroll">

            {/* 'All' category circle */}
            <div
              onClick={() => setActiveCategory('All')}
              className={`circle-category ${activeCategory === 'All' ? 'active' : ''}`}
            >
              <div
                className="circle-img-wrap flex-center"
                style={{
                  background: activeCategory === 'All' ? 'var(--color-accent)' : '#ffffff',
                  color: activeCategory === 'All' ? '#ffffff' : 'var(--text-dark)'
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>ALL</span>
              </div>
              <span className="circle-category-label">All Items</span>
            </div>

            {circularCategories.map(cat => (
              <div
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`circle-category ${activeCategory === cat.name ? 'active' : ''}`}
              >
                <div className="circle-img-wrap">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span className="circle-category-label">{cat.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Toolbar - Mockup pill tags */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--color-border)'
        }}>
          {/* Mockup filter pills row */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            maxWidth: '100%'
          }} className="category-scroll">
            <button className="filter-btn">
              Size <ChevronDown size={13} />
            </button>
            <button className="filter-btn">
              Color <ChevronDown size={13} />
            </button>
          </div>

          {/* Sorter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 500,
                padding: '6px 12px',
                border: '1px solid var(--color-border)',
                background: 'var(--bg-card)',
                color: 'var(--text-dark)',
                borderRadius: 'var(--radius-pill)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Section Header: Curated For You */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{
            fontSize: '1rem',
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

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="flex-center" style={{
            flexDirection: 'column',
            padding: '60px 0',
            textAlign: 'center',
            gap: '12px'
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No products found matching your search.</p>
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
                  paddingTop: '115%', // Mockup Aspect Ratio
                  overflow: 'hidden',
                  background: '#f3f4f6' // Match image background color
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

                  {/* Floating heart icon matching mockup */}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                        {product.rating}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        ({product.reviews})
                      </span>
                    </div>
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

                  {/* Price Layout: Current Red Sale Price & Original Price Crossed Out */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--color-sale)'
                    }}>
                      ₦{product.price}
                    </span>
                    {product.originalPrice && (
                      <span style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        textDecoration: 'line-through'
                      }}>
                        ₦{product.originalPrice}
                      </span>
                    )}
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
