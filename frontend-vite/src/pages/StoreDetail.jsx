import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import RatingForm from '../components/RatingForm'
import storeService from '../services/storeService'
import ratingService from '../services/ratingService'
import '../styles/StoreDetail.css'

export default function StoreDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [store, setStore] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isAuthenticated] = useState(!!localStorage.getItem('token'))

  const fetchData = useCallback(async () => {
    try {
      const [storeRes, ratingsRes] = await Promise.all([
        storeService.getStoreById(id),
        ratingService.getStoreRatings(id)
      ])
      setStore(storeRes.data)
      setRatings(ratingsRes.data || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmitRating = async (formData) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setSubmitting(true)
    try {
      await ratingService.submitRating(id, formData.rating, formData.comment)
      await fetchData()
    } catch (err) {
      console.error('Error submitting rating:', err)
      alert('Failed to submit rating')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading store details...</p>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="error-container">
        <h2>Store not found</h2>
        <Link to="/" className="btn-back">← Back to Stores</Link>
      </div>
    )
  }

  const ratingStats = {
    avg: store.rating || 0,
    total: ratings.length,
    distribution: {
      5: ratings.filter(r => r.rating === 5).length,
      4: ratings.filter(r => r.rating === 4).length,
      3: ratings.filter(r => r.rating === 3).length,
      2: ratings.filter(r => r.rating === 2).length,
      1: ratings.filter(r => r.rating === 1).length,
    }
  }

  return (
    <div className="store-detail-wrapper">
      {/* Header */}
      <div className="detail-header">
        <Link to="/" className="back-btn">← Back to Stores</Link>
        <div className="store-hero">
          <div className="store-info">
            <h1>{store.name}</h1>
            <p className="location">📍 {store.location}</p>
            <p className="category">🏷️ {store.category}</p>
            {store.description && (
              <p className="description">{store.description}</p>
            )}
          </div>
          <div className="rating-summary">
            <div className="big-rating">
              <span className="star">⭐</span>
              <span className="number">{ratingStats.avg.toFixed(1)}</span>
            </div>
            <p className="total-reviews">{ratingStats.total} reviews</p>
          </div>
        </div>
      </div>

      <div className="detail-container">
        {/* Rating Distribution */}
        <section className="rating-distribution">
          <h2>Rating Distribution</h2>
          <div className="distribution-list">
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="distribution-item">
                <span className="stars">{stars}⭐</span>
                <div className="bar">
                  <div 
                    className="bar-fill"
                    style={{
                      width: ratingStats.total > 0 
                        ? (ratingStats.distribution[stars] / ratingStats.total * 100) + '%'
                        : '0%'
                    }}
                  ></div>
                </div>
                <span className="count">{ratingStats.distribution[stars]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Submit Rating - Using Component */}
        {isAuthenticated && (
          <section className="rating-form-section">
            <h2>Share Your Experience</h2>
            <RatingForm 
              storeId={id}
              onSubmit={handleSubmitRating}
              isLoading={submitting}
            />
          </section>
        )}

        {!isAuthenticated && (
          <div className="login-prompt">
            <p>Sign in to share your rating and review</p>
            <Link to="/login" className="btn-login-prompt">Sign In to Rate</Link>
          </div>
        )}

        {/* Reviews Section */}
        <section className="reviews-section">
          <h2>Recent Reviews ({ratings.length})</h2>
          {ratings.length === 0 ? (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="reviews-list">
              {ratings.map(rating => (
                <div key={rating.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="avatar">👤</div>
                      <div>
                        <h4>{rating.user_name || 'Anonymous'}</h4>
                        <span className="review-date">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="review-rating">
                      {'⭐'.repeat(rating.rating)}
                    </div>
                  </div>
                  {rating.comment && (
                    <p className="review-comment">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}