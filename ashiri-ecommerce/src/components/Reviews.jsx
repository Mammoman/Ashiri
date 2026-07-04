import React, { useState } from 'react';
import { Star, Check, Plus, X, MessageSquare } from 'lucide-react';

const initialReviews = [
  {
    id: 1,
    name: 'Yemi A.',
    rating: 5,
    title: 'Absolutely gorgeous texture!',
    comment: 'The Adire Silk Cami is stunning. You can feel the silk is high grade and the indigo patterns are beautifully organic. It fits perfectly!',
    date: '2026-06-25',
    verified: true,
    category: 'Female'
  },
  {
    id: 2,
    name: 'Chinedu O.',
    rating: 5,
    title: 'Superior rib construction',
    comment: 'Bought the Oba Ribbed Tank. Highly durable, dense rib knit cotton. It holds its shape even after multiple washes. Handcrafted quality is obvious.',
    date: '2026-06-18',
    verified: true,
    category: 'Unisex'
  },
  {
    id: 3,
    name: 'Sarah K.',
    rating: 4,
    title: 'Incredible design, runs slightly large',
    comment: 'The Heritage Knit Crochet vest is a work of art! Subtle golden thread looks beautiful. I recommend sizing down if you want a snug fit.',
    date: '2026-06-10',
    verified: true,
    category: 'Female'
  },
  {
    id: 4,
    name: 'Tunde W.',
    rating: 5,
    title: 'Effortless summer staple',
    comment: 'The Safari Linen Tank is perfect for warm Lagos days. Extremely light and breathable. Sand color goes with everything.',
    date: '2026-05-28',
    verified: true,
    category: 'Male'
  }
];

const Reviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [starFilter, setStarFilter] = useState(null); // null means all
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formCategory, setFormCategory] = useState('Unisex');
  const [formError, setFormError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Math metrics
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : 0;

  // Star counts for bar breakdown
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    if (starCounts[r.rating] !== undefined) {
      starCounts[r.rating]++;
    }
  });

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
      setFormError('Please fill out all fields.');
      return;
    }

    const newReview = {
      id: Date.now(),
      name: formName.trim(),
      rating: formRating,
      title: formTitle.trim(),
      comment: formComment.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: true,
      category: formCategory
    };

    setReviews([newReview, ...reviews]);
    setIsModalOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const filteredReviews = starFilter 
    ? reviews.filter(r => r.rating === starFilter)
    : reviews;

  return (
    <section id="reviews" style={{ padding: '60px 0', background: 'var(--bg-main)', borderTop: '1px solid var(--color-border)' }}>
      <div className="container">
        
        {/* Header Block */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '8px'
            }}>
              ARTISANAL VOICES
            </span>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--text-dark)',
              letterSpacing: '-0.03em',
              margin: 0
            }}>
              Customer Reviews
            </h2>
          </div>
          
          <button
            onClick={handleOpenModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-accent)',
              color: '#ffffff',
              padding: '12px 24px',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-pill)',
              boxShadow: 'var(--shadow-subtle)',
              transition: 'var(--transition-fast)'
            }}
            className="write-review-btn"
          >
            <Plus size={16} /> Write a Review
          </button>
        </div>

        {/* Dashboard Panels */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 2fr',
          gap: '40px',
          marginBottom: '40px'
        }} className="reviews-dashboard">
          
          {/* Rating Breakdown card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '30px',
            boxShadow: 'var(--shadow-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            height: 'fit-content'
          }}>
            
            {/* Avg score circle / row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 800,
                color: 'var(--text-dark)',
                lineHeight: 1
              }}>
                {averageRating}
              </div>
              <div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                  {[...Array(5)].map((_, i) => {
                    const active = i < Math.round(parseFloat(averageRating));
                    return (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={active ? '#fbbf24' : 'none'} 
                        color={active ? '#fbbf24' : '#e5e7eb'} 
                      />
                    );
                  })}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Based on {totalReviewsCount} reviews
                </div>
              </div>
            </div>

            {/* Distribution bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = starCounts[stars] || 0;
                const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
                const isSelected = starFilter === stars;
                
                return (
                  <div 
                    key={stars}
                    onClick={() => setStarFilter(isSelected ? null : stars)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      margin: '0 -8px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--color-accent-light)' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                    className="rating-bar-row"
                  >
                    {/* Star Label */}
                    <span style={{ width: '45px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      {stars} <Star size={12} fill="#fbbf24" color="#fbbf24" />
                    </span>
                    
                    {/* Progress track */}
                    <div style={{
                      flexGrow: 1,
                      height: '8px',
                      background: '#f3f4f6',
                      borderRadius: 'var(--radius-pill)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${percentage}%`,
                        background: 'var(--color-accent)',
                        borderRadius: 'var(--radius-pill)',
                        transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                      }} />
                    </div>

                    {/* Count */}
                    <span style={{ width: '25px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 500 }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Reset Filter Button */}
            {starFilter && (
              <button 
                onClick={() => setStarFilter(null)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-sale)',
                  alignSelf: 'flex-start',
                  borderBottom: '1px solid var(--color-sale)'
                }}
              >
                Clear Rating Filter ({starFilter} Stars)
              </button>
            )}

          </div>

          {/* Review List block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                {starFilter ? `Showing ${filteredReviews.length} (${starFilter}-Star) Reviews` : `All Reviews (${totalReviewsCount})`}
              </span>
            </div>

            {filteredReviews.length === 0 ? (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px dashed var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '40px',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>
                <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p style={{ fontSize: '0.9rem' }}>No reviews found matching this filter.</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div 
                  key={review.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-subtle)',
                    animation: 'slideUp 0.4s ease'
                  }}
                  className="review-card"
                >
                  {/* Rating + Date Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < review.rating ? '#fbbf24' : 'none'} 
                          color={i < review.rating ? '#fbbf24' : '#e5e7eb'} 
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {review.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    marginBottom: '8px'
                  }}>
                    {review.title}
                  </h3>

                  {/* Body Comment */}
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.6',
                    marginBottom: '16px'
                  }}>
                    {review.comment}
                  </p>

                  {/* Reviewer Details */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{review.name}</span>
                      {review.verified && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          color: '#10b981',
                          fontWeight: 600,
                          background: '#ecfdf5',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.65rem'
                        }}>
                          <Check size={10} strokeWidth={3} /> Verified Buyer
                        </span>
                      )}
                    </div>
                    
                    <span style={{
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontWeight: 600,
                      fontSize: '0.65rem'
                    }}>
                      Category: {review.category}
                    </span>
                  </div>

                </div>
              ))
            )}

          </div>

        </div>

      </div>

      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 2000,
          background: 'var(--text-dark)',
          color: '#ffffff',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-premium)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            background: '#10b981',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Check size={12} strokeWidth={3} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Review submitted! Thank you for your feedback.</span>
        </div>
      )}

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              width: 'calc(100% - 32px)',
              maxWidth: '500px',
              padding: '30px',
              boxShadow: 'var(--shadow-premium)',
              position: 'relative',
              boxSizing: 'border-box',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                Share Your Experience
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ color: 'var(--text-muted)', border: 'none', background: 'none' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Rating selection */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '8px', color: 'var(--text-dark)' }}>
                  Overall Rating *
                </label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating !== null ? hoverRating : formRating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => setFormRating(star)}
                        style={{
                          color: isFilled ? '#fbbf24' : '#e5e7eb',
                          padding: '0 4px',
                          fontSize: '1.5rem',
                          transition: 'transform 0.1s ease',
                          transform: star === hoverRating ? 'scale(1.15)' : 'scale(1)'
                        }}
                      >
                        <Star size={24} fill={isFilled ? 'currentColor' : 'none'} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="rev-name" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--text-dark)' }}>
                  Your Name *
                </label>
                <input
                  id="rev-name"
                  type="text"
                  placeholder="e.g. Kola A."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="input-premium"
                  style={{ width: '100%', borderRadius: 'var(--radius-sm)', boxSizing: 'border-box' }}
                  required
                />
              </div>

              {/* Category selector */}
              <div>
                <label htmlFor="rev-category" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--text-dark)' }}>
                  Purchased Collection *
                </label>
                <select
                  id="rev-category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    fontSize: '0.9rem',
                    border: '1px solid var(--color-border)',
                    background: '#f3f4f6',
                    borderRadius: 'var(--radius-sm)',
                    outline: 'none',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  <option value="Unisex">Unisex Collection</option>
                  <option value="Male">Male Collection</option>
                  <option value="Female">Female Collection</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="rev-title" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--text-dark)' }}>
                  Review Title *
                </label>
                <input
                  id="rev-title"
                  type="text"
                  placeholder="e.g. Unmatched softness and build!"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="input-premium"
                  style={{ width: '100%', borderRadius: 'var(--radius-sm)', boxSizing: 'border-box' }}
                  required
                />
              </div>

              {/* Comments */}
              <div>
                <label htmlFor="rev-comment" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--text-dark)' }}>
                  Detailed Comment *
                </label>
                <textarea
                  id="rev-comment"
                  placeholder="Tell others what you think about the fit, texture, and handcrafted quality..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="input-premium"
                  rows={4}
                  style={{
                    width: '100%',
                    borderRadius: 'var(--radius-sm)',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    minHeight: '80px'
                  }}
                  required
                />
              </div>

              {/* Error messages */}
              {formError && (
                <div style={{ color: 'var(--color-sale)', fontSize: '0.8rem', fontWeight: 500 }}>
                  {formError}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    color: 'var(--text-muted)'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'var(--color-accent)',
                    color: '#ffffff',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                  className="submit-review-btn"
                >
                  Submit Review
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Styled interactions and transitions */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .write-review-btn:hover {
          background: #1f2937 !important;
          transform: translateY(-1px);
        }
        .submit-review-btn:hover {
          background: #1f2937 !important;
        }
        .rating-bar-row:hover {
          background: var(--color-accent-light) !important;
        }
        .review-card:hover {
          border-color: #cbd5e1 !important;
          box-shadow: var(--shadow-medium) !important;
        }
        @media (max-width: 900px) {
          .reviews-dashboard {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
      `}} />
    </section>
  );
};

export default Reviews;
