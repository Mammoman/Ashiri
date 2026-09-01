import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Package, Plus, Trash2, X } from 'lucide-react';

const ProductsPage = () => {
  const { products, addProduct, deleteProduct } = useAdmin();
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Add product form state
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', price: '', sizes: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const parsedData = {
        ...formData,
        price: parseFloat(formData.price),
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      const result = await addProduct(parsedData, imageFile);
      
      if (!result.success) {
        setError(result.error || 'Failed to save product');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsAdding(false);
      setFormData({ name: '', price: '', sizes: '' });
      setImageFile(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Product Catalog</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setError(''); }}
          className="admin-btn admin-btn-primary"
          style={{ padding: '8px 16px', borderRadius: '8px' }}
        >
          {isAdding ? <X size={16} /> : <Plus size={16} />}
          {isAdding ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {isAdding && (
        <div className="admin-card" style={{ marginBottom: '24px' }}>
          <div className="admin-card-header">
            <span className="admin-card-title">Add New Product</span>
          </div>
          <div className="admin-card-body">
            {error && (
              <div style={{ padding: '12px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                <strong>Error: </strong>{error}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Product Name</label>
                <input required className="admin-form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Price (₦)</label>
                <input required type="number" className="admin-form-input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Sizes (comma separated)</label>
                <input className="admin-form-input" placeholder="S, M, L, XL" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} />
              </div>

              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="admin-form-label">Product Image</label>
                <input required type="file" accept="image/*" className="admin-form-input" onChange={e => setImageFile(e.target.files[0])} />
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Image will be uploaded to Supabase Storage automatically.</span>
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Uploading & Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Live Products ({products.length} items)</span>
        </div>
        <div className="admin-card-body">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Sizes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <React.Fragment key={product.id}>
                  <tr>
                    <td>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '10px',
                        overflow: 'hidden', background: '#f1f5f9',
                      }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{product.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>ID: {product.id}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>₦{product.price.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {product.sizes ? product.sizes.map((s) => (
                          <span key={s} style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#334155' }}>
                            {s}
                          </span>
                        )) : '—'}
                      </div>
                    </td>
                    <td>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                        style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
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
