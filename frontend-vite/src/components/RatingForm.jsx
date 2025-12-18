import { useState } from 'react'
import '../styles/RatingForm.css'

export default function RatingForm({ storeId, onSubmit, isLoading }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    onSubmit({
      rating,
      comment,
      storeId
    })

    // Reset form
    setRating(0)
    setComment('')
  }

  return (
    <form onSubmit={handleSubmit} className="rating-form-component">
      <div className="rating-selector">
        <label>Your Rating</label>
        <div className="stars-selector">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              className={`star-btn ${rating >= star ? 'active' : ''}`}
              onClick={() => setRating(star)}
              disabled={isLoading}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      <div className="comment-group">
        <label>Your Review (Optional)</label>
        <textarea
          placeholder="Share your thoughts about this store..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="comment-input"
          maxLength="500"
          disabled={isLoading}
        ></textarea>
        <small>{comment.length}/500</small>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      <button 
        type="submit" 
        disabled={isLoading || rating === 0}
        className="btn-submit-rating"
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Submitting...
          </>
        ) : (
          <>
            Submit Rating
            <span>✓</span>
          </>
        )}
      </button>
    </form>
  )}