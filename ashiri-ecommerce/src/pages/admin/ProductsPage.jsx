import React, { useState } from 'react';
import { products as catalogProducts } from '../../data/mockData';
import { Package, Edit, Eye, EyeOff } from 'lucide-react';

const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Product Catalog ({catalogProducts.length} items)</span>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
            Products are managed in mockData.js
          </span>
        </div>
        <div className="admin-card-body">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Original Price</th>
                <th>Sizes</th>
                <th>Colors</th>
              </tr>
            </thead>
            <tbody>
              {catalogProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <tr
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                  >
                    <td>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        background: '#f1f5f9',
                      }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                        ID: {product.id}
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge processing">{product.category}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                      ₦{product.price.toLocaleString()}
                    </td>
                    <td style={{ color: '#64748b', textDecoration: 'line-through' }}>
                      {product.originalPrice ? `₦${product.originalPrice.toLocaleString()}` : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {product.sizes ? product.sizes.map((s) => (
                          <span key={s} style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: '#f1f5f9',
                            color: '#334155',
                          }}>
                            {s}
                          </span>
                        )) : '—'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {product.colors ? product.colors.map((c) => (
                          <span key={c} style={{
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: '#f1f5f9',
                            color: '#334155',
                          }}>
                            {c}
                          </span>
                        )) : '—'}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Product Detail */}
                  {selectedProduct === product.id && (
                    <tr>
                      <td colSpan={7} style={{ padding: 0, background: '#fafbfc' }}>
                        <div className="admin-drawer">
                          <div className="admin-drawer-title">Description</div>
                          <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.6, marginBottom: '16px' }}>
                            {product.description || 'No description available.'}
                          </p>

                          {product.details && product.details.length > 0 && (
                            <>
                              <div className="admin-drawer-title">Product Details</div>
                              <ul style={{ padding: '0 0 0 18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {product.details.map((d, i) => (
                                  <li key={i} style={{ fontSize: '0.8rem', color: '#475569' }}>{d}</li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
