import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import CommunityFitUploadModal from './CommunityFitUploadModal';
import ImageWithSkeleton from './ImageWithSkeleton';

const CommunityFits = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section style={{ padding: '60px 0', background: 'var(--bg-main)' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--text-dark)',
            letterSpacing: '-0.03em',
            marginBottom: '16px'
          }}>
            Community Fits
          </h2>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            maxWidth: '500px',
            lineHeight: '1.6',
            marginBottom: '24px'
          }}>
            See how the ÀṢHÍRÍ community styles their pieces.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="cart-action-solid-btn"
            style={{
              padding: '12px 24px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: 'auto',
              borderRadius: '30px'
            }}
          >
            <Camera size={18} />
            Share Your Fit
          </button>
        </div>

        {images.length > 0 ? (
          <div className="masonry-grid" style={{
            columnCount: 3,
            columnGap: '16px',
            width: '100%'
          }}>
            {images.map((img) => (
              <div key={img.id} className="masonry-item" style={{
                marginBottom: '16px',
                breakInside: 'avoid',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'var(--bg-card)'
              }}>
                <ImageWithSkeleton
                  src={img.url}
                  alt="Community Fit"
                  style={{
                    width: '100%',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'var(--bg-card)',
            borderRadius: '12px'
          }}>
            <p style={{ color: 'var(--text-muted)' }}>
              No fits shared yet. Be the first to share your ÀṢHÍRÍ style!
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CommunityFitUploadModal onClose={() => setIsModalOpen(false)} />
      )}
    </section>
  );
};

export default CommunityFits;
