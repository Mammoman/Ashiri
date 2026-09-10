import React, { useState } from 'react';
import { X, Upload, Check } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const CommunityFitUploadModal = ({ onClose }) => {
  const { addGalleryImage } = useAdmin();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Call addGalleryImage directly with the community_pending folder
    const result = await addGalleryImage(imageFile, 'community_pending');
    
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || 'Failed to upload image. Please try again.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-main)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            Share Your Fit
          </h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
          }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%', background: '#10b981',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Check size={32} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '8px' }}>
                Awesome!
              </h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Your <span className="brand-text">ÀṢHÍRÍ</span> style has been submitted for approval, thank you!
              </p>
              <button 
                onClick={onClose}
                className="cart-action-solid-btn"
                style={{ marginTop: '24px' }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                  Upload Photo
                </label>
                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px 20px',
                  border: '2px dashed var(--color-border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: 'var(--bg-card)',
                  transition: 'border-color 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <>
                      <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 500 }}>
                        Click to select image
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        JPG, PNG, max 5MB
                      </span>
                    </>
                  )}
                </label>
              </div>

              {error && (
                <div style={{
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--color-sale)',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  marginBottom: '20px'
                }}>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="cart-action-solid-btn"
                disabled={isSubmitting || !imageFile}
                style={{
                  opacity: isSubmitting || !imageFile ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Uploading...' : 'Submit Photo'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityFitUploadModal;
