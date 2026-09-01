import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Image, Trash2, Plus, X } from 'lucide-react';

const GalleryAdmin = () => {
  const { galleryImages, addGalleryImage, deleteGalleryImage } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [folder, setFolder] = useState('assets');
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image to upload.');
      return;
    }
    setError('');
    setIsUploading(true);
    
    const { success, error: uploadError } = await addGalleryImage(imageFile, folder);
    
    if (success) {
      setIsAdding(false);
      setImageFile(null);
      setFolder('assets');
    } else {
      setError(uploadError || 'Upload failed');
    }
    
    setIsUploading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Brand Gallery</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setError(''); }}
          className="admin-btn admin-btn-primary"
          style={{ padding: '8px 16px', borderRadius: '8px' }}
        >
          {isAdding ? <X size={16} /> : <Plus size={16} />}
          {isAdding ? 'Cancel' : 'Upload Image'}
        </button>
      </div>

      {isAdding && (
        <div className="admin-card" style={{ marginBottom: '24px' }}>
          <div className="admin-card-header">
            <span className="admin-card-title">Upload Gallery Image</span>
          </div>
          <div className="admin-card-body">
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Image File</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="admin-form-input" 
                  onChange={(e) => setImageFile(e.target.files[0])} 
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Category / Folder</label>
                <select 
                  className="admin-form-input" 
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                >
                  <option value="assets">assets</option>
                  <option value="gallery">gallery</option>
                  <option value="lookbook">lookbook</option>
                  <option value="campaign">campaign</option>
                </select>
              </div>

              {error && <p style={{ color: '#dc2626', fontSize: '0.8rem', margin: 0 }}>{error}</p>}

              <button type="submit" className="admin-btn admin-btn-primary" disabled={isUploading}>
                {isUploading ? 'Uploading to Supabase...' : 'Upload Image'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Live Gallery Images ({galleryImages.length})</span>
        </div>
        <div style={{ padding: '20px' }}>
          {galleryImages.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>No images uploaded yet.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '14px',
            }}>
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  style={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    aspectRatio: '3/4',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                  }}
                  className="gallery-admin-item"
                >
                  <img
                    src={img.url}
                    alt={img.id}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  
                  {/* Delete overlay button */}
                  <button
                    onClick={() => deleteGalleryImage(img.id)}
                    className="gallery-delete-btn"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(220, 38, 38, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      opacity: 0,
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>

                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                    padding: '24px 10px 10px',
                    color: '#fff',
                  }}>
                    <div style={{ fontSize: '0.6rem', opacity: 0.9 }}>
                      {img.folder}/
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .gallery-admin-item:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
        .gallery-admin-item:hover .gallery-delete-btn {
          opacity: 1 !important;
        }
      `}} />
    </div>
  );
};

export default GalleryAdmin;
