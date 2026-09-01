import React from 'react';
import { Image, Trash2 } from 'lucide-react';

// Import all gallery images for display
import Image1 from '../../assets/Image1.jpg';
import Image3 from '../../assets/Image3.jpg';
import greytank from '../../assets/greytank.jpg';
import purpletank from '../../assets/purpletank.jpg';
import redtank5 from '../../assets/redtank5.jpg';
import whitetank3 from '../../assets/whitetank3.jpg';
import greytankGallery from '../../assets/gallery/greytank.jpg';
import purpletankGallery from '../../assets/gallery/purpletank.jpg';
import purpletank2Gallery from '../../assets/gallery/purpletank2.jpg';
import redtank3Gallery from '../../assets/gallery/redtank3.jpg';
import redtank4Gallery from '../../assets/gallery/redtank4.jpg';
import whitetankGallery from '../../assets/gallery/whitetank.jpg';
import whitetank2Gallery from '../../assets/gallery/whitetank2.jpg';
import alltankGallery from '../../assets/gallery/alltank.jpg';
import alltankGallery3 from '../../assets/gallery/alltank3.jpg';
import greytank2 from '../../assets/gallery/greytank2.jpg';

const allImages = [
  { src: Image1, name: 'Image1.jpg', folder: 'assets' },
  { src: Image3, name: 'Image3.jpg', folder: 'assets' },
  { src: greytank, name: 'greytank.jpg', folder: 'assets' },
  { src: purpletank, name: 'purpletank.jpg', folder: 'assets' },
  { src: redtank5, name: 'redtank5.jpg', folder: 'assets' },
  { src: whitetank3, name: 'whitetank3.jpg', folder: 'assets' },
  { src: greytankGallery, name: 'greytank.jpg', folder: 'gallery' },
  { src: purpletankGallery, name: 'purpletank.jpg', folder: 'gallery' },
  { src: purpletank2Gallery, name: 'purpletank2.jpg', folder: 'gallery' },
  { src: redtank3Gallery, name: 'redtank3.jpg', folder: 'gallery' },
  { src: redtank4Gallery, name: 'redtank4.jpg', folder: 'gallery' },
  { src: whitetankGallery, name: 'whitetank.jpg', folder: 'gallery' },
  { src: whitetank2Gallery, name: 'whitetank2.jpg', folder: 'gallery' },
  { src: alltankGallery, name: 'alltank.jpg', folder: 'gallery' },
  { src: alltankGallery3, name: 'alltank3.jpg', folder: 'gallery' },
  { src: greytank2, name: 'greytank2.jpg', folder: 'gallery' },
];

const GalleryAdmin = () => {
  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Gallery Images ({allImages.length})</span>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
            Images are stored in src/assets/
          </span>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '14px',
          }}>
            {allImages.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  aspectRatio: '3/4',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                className="gallery-admin-item"
              >
                <img
                  src={img.src}
                  alt={img.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                  padding: '24px 10px 10px',
                  color: '#fff',
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, marginBottom: '2px' }}>
                    {img.name}
                  </div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>
                    {img.folder}/
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .gallery-admin-item:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
          transform: translateY(-3px);
        }
        .gallery-admin-item:hover img {
          transform: scale(1.05);
        }
      `}} />
    </div>
  );
};

export default GalleryAdmin;
