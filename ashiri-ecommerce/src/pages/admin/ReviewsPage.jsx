import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Star, Check, X, Trash2, MessageSquare } from 'lucide-react';

const ReviewsPage = () => {
  const { adminReviews, updateReviewStatus, deleteReview } = useAdmin();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReviews = adminReviews.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const stats = {
    total: adminReviews.length,
    pending: adminReviews.filter((r) => r.status === 'pending').length,
    approved: adminReviews.filter((r) => r.status === 'approved').length,
    rejected: adminReviews.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div>
      {/* Quick Stats */}
      <div className="admin-kpi-grid" style={{ marginBottom: '20px' }}>
        <div className="admin-kpi-card" onClick={() => setStatusFilter('all')} style={{ cursor: 'pointer' }}>
          <div className="admin-kpi-label">Total Reviews</div>
          <div className="admin-kpi-value">{stats.total}</div>
        </div>
        <div className="admin-kpi-card" onClick={() => setStatusFilter('pending')} style={{ cursor: 'pointer' }}>
          <div className="admin-kpi-label">Pending</div>
          <div className="admin-kpi-value">{stats.pending}</div>
        </div>
        <div className="admin-kpi-card" onClick={() => setStatusFilter('approved')} style={{ cursor: 'pointer' }}>
          <div className="admin-kpi-label">Approved</div>
          <div className="admin-kpi-value">{stats.approved}</div>
        </div>
        <div className="admin-kpi-card" onClick={() => setStatusFilter('rejected')} style={{ cursor: 'pointer' }}>
          <div className="admin-kpi-label">Rejected</div>
          <div className="admin-kpi-value">{stats.rejected}</div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">
            {statusFilter === 'all' ? 'All Reviews' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Reviews`}
            {' '}({filteredReviews.length})
          </span>
          {statusFilter !== 'all' && (
            <button
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => setStatusFilter('all')}
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="admin-card-body">
          {filteredReviews.length === 0 ? (
            <div className="admin-empty">
              <MessageSquare size={36} />
              <p>No reviews found. Customer reviews submitted on the storefront will appear here for moderation.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '18px 22px',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '1px', flexShrink: 0, paddingTop: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i < review.rating ? '#fbbf24' : 'none'}
                        color={i < review.rating ? '#fbbf24' : '#e2e8f0'}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
                        {review.title || 'Untitled'}
                      </span>
                      <span className={`admin-badge ${review.status || 'pending'}`}>
                        {review.status || 'pending'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: '4px 0 8px' }}>
                      {review.comment}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem', color: '#94a3b8' }}>
                      <span style={{ fontWeight: 600 }}>{review.name}</span>
                      <span>•</span>
                      <span>{review.category || 'General'}</span>
                      <span>•</span>
                      <span>{review.date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {review.status !== 'approved' && (
                      <button
                        className="admin-btn admin-btn-sm"
                        style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' }}
                        onClick={() => updateReviewStatus(review.id, 'approved')}
                        title="Approve"
                      >
                        <Check size={13} />
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button
                        className="admin-btn admin-btn-sm"
                        style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}
                        onClick={() => updateReviewStatus(review.id, 'rejected')}
                        title="Reject"
                      >
                        <X size={13} />
                      </button>
                    )}
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => {
                        if (window.confirm('Delete this review permanently?')) {
                          deleteReview(review.id);
                        }
                      }}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
