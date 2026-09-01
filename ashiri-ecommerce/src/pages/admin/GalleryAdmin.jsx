import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Image, Trash2, Plus, X } from 'lucide-react';

const GalleryAdmin = () => {
  const { galleryImages, addGalleryImage, addGalleryImages, deleteGalleryImage } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [folder, setFolder] = useState('campaign');
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFiles || imageFiles.length === 0) {
      setError('Please select at least one image to upload.');
      return;
    }
    setError('');
    setIsUploading(true);
    
    const { success, error: uploadError } = await addGalleryImages(imageFiles, folder);
    
    if (success) {
      setIsAdding(false);
      setImageFiles([]);
      setFolder('campaign');
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
          <div className="admin-card-body" style={{ padding: '24px' }}>
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
              <div className="admin-form-group">
                <label className="admin-form-label" style={{ marginBottom: '8px' }}>Image File</label>
                <label 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    padding: '32px 16px',
                    cursor: 'pointer',
                    background: '#f8fafc',
                    transition: 'all 0.2s',
                    color: '#64748b'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0f172a'; e.currentTarget.style.background = '#f1f5f9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                >
                  <Image size={32} style={{ marginBottom: '12px', color: '#94a3b8' }} />
                  <span style={{ fontWeight: 600, color: '#334155', textAlign: 'center' }}>
                    {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'Click to select images'}
                  </span>
                  {imageFiles.length === 0 && <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>PNG, JPG up to 5MB</span>}
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={(e) => setImageFiles(Array.from(e.target.files))} 
                    required
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Category / Folder</label>
                <select 
                  className="admin-form-input" 
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                >
                  <option value="campaign">campaign</option>
                  <option value="lookbook">lookbook</option>
                  <option value="gallery">gallery</option>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {Array.from(new Set(galleryImages.map(img => img.folder || 'uncategorized'))).sort().map(folderName => {
                const folderImages = galleryImages.filter(img => (img.folder || 'uncategorized') === folderName);
                
                return (
                  <div key={folderName}>
                    <h3 style={{ 
                      fontSize: '1rem', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      color: '#334155',
                      borderBottom: '1px solid #e2e8f0',
                      paddingBottom: '8px',
                      marginBottom: '16px'
                    }}>
                      {folderName} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, textTransform: 'none' }}>({folderImages.length})</span>
                    </h3>
                    
                    <div style={{
                      display: 'flex',
                      gap: '14px',
                      overflowX: 'auto',
                      paddingBottom: '16px',
                      WebkitOverflowScrolling: 'touch',
                      scrollbarWidth: 'none',
                    }}>
                      {folderImages.map((img) => (
                        <div
                          key={img.id}
                          style={{
                            flex: '0 0 160px',
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
                            alt="Gallery Upload"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          
                          {/* Overlay with info and delete */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '12px',
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => deleteGalleryImage(img.id, img.path)}
                                style={{
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                                title="Delete Image"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div>
                              <span style={{ 
                                background: 'rgba(255,255,255,0.2)', 
                                backdropFilter: 'blur(4px)',
                                color: 'white', 
                                fontSize: '0.65rem',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontWeight: 500,
                              }}>
                                {img.folder}/
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
