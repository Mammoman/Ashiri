import React, { useState } from 'react';
import { Star, Plus, X, Check, MessageSquare } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Reviews = () => {
  const { adminReviews, addReview } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formCategory, setFormCategory] = useState('Unisex');
  const [formError, setFormError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Filter only approved reviews for storefront view (or default if status is unset)
  const displayReviews = adminReviews.filter(
    (r) => !r.status || r.status === 'approved'
  );

  const totalReviewsCount = displayReviews.length;
  const averageRating = totalReviewsCount > 0
    ? (displayReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  const handleOpenModal = () => {
    setFormName('');
    setFormRating(5);
    setFormTitle('');
    setFormComment('');
    setFormCategory('Unisex');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim() || !formComment.trim()) {
      setFormError('Please complete all required fields.');
      return;
    }

    addReview({
      name: formName.trim(),
      rating: formRating,
      title: formTitle.trim(),
      comment: formComment.trim(),
      category: formCategory,
      verified: true,
      status: 'approved', // Auto-approved on storefront submit for smooth UX
    });

    setIsModalOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  return (
    <section id="reviews" style={{ padding: '80px 0', background: 'var(--bg-main)', borderTop: '1px solid var(--color-border)' }}>
      <div className="container">

        {/* Minimalist Editorial Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '48px',
          flexWrap: 'wrap',
          gap: '24px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '8px'
            }}>
              ARTISANAL VOICES
            </span>
            <h2 style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              color: 'var(--text-dark)',
              letterSpacing: '-0.03em',
              margin: 0,
              display: 'flex',
              alignItems: 'baseline',
              gap: '16px'
            }}>
              Customer Reviews
              <span style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: 'normal'
              }}>
                ★ {averageRating} ({totalReviewsCount})
              </span>
            </h2>
          </div>

          <button
            onClick={handleOpenModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--text-dark)',
              color: '#ffffff',
              padding: '12px 26px',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              borderRadius: 'var(--radius-pill)',
              boxShadow: 'var(--shadow-subtle)',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s ease'
            }}
            className="write-review-btn"
          >
            <Plus size={14} /> Write a Review
          </button>
        </div>

        {/* Clean Grid of Review Cards */}
        {displayReviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <MessageSquare size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ fontSize: '0.9rem' }}>No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {displayReviews.map((review) => (
              <div
                key={review.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                className="editorial-review-card"
              >
                <div>
                  {/* Rating Stars & Verification Badge */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < review.rating ? '#0f172a' : 'none'}
                          color={i < review.rating ? '#0f172a' : '#e2e8f0'}
                        />
                      ))}
                    </div>

                    {review.verified && (
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#10b981',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Check size={12} /> Verified Buyer
                      </span>
                    )}
                  </div>

                  {/* Review Title */}
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    marginBottom: '10px',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.3
                  }}>
                    "{review.title}"
                  </h3>

                  {/* Review Comment */}
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#4b5563',
                    lineHeight: 1.65,
                    margin: 0
                  }}>
                    {review.comment}
                  </p>
                </div>

                {/* Reviewer Details */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid #f3f4f6',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)'
                }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{review.name}</span>
                  <span>{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clean Modal for Submitting a Review */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 4000,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '20px',
            padding: '36px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f1f5f9',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={16} />
            </button>

            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--text-dark)',
              marginBottom: '6px',
              letterSpacing: '-0.02em'
            }}>
              Write a Review
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Share your experience with the Ashiri collection.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Star Rating Picker */}
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Your Rating
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      style={{ cursor: 'pointer' }}
                      fill={(hoverRating || formRating) >= star ? '#0f172a' : 'none'}
                      color={(hoverRating || formRating) >= star ? '#0f172a' : '#cbd5e1'}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setFormRating(star)}
                    />
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="E.g. Yemi A."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Title */}
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Review Headline
                </label>
                <input
                  type="text"
                  placeholder="E.g. Incredible craftsmanship & fit"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Comment */}
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Review Details
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us about the fabric, sizing, and overall feel..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {formError && (
                <p style={{ color: '#dc2626', fontSize: '0.78rem', margin: 0 }}>{formError}</p>
              )}

              <button
                type="submit"
                style={{
                  background: 'var(--text-dark)',
                  color: '#ffffff',
                  padding: '14px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '14px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 5000,
          fontSize: '0.82rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={16} color="#10b981" /> Review submitted and published!
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .editorial-review-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06) !important;
        }
      `}} />
    </section>
  );
};

export default Reviews;
