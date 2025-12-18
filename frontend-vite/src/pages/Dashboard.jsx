import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import ratingService from '../services/ratingService'
import '../styles/Dashboard.css'

const STREAK_TARGET = 3

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [streakCount, setStreakCount] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
    fetchUserRatings()
    fetchStreak()
  }, [navigate])

  const fetchUserRatings = async () => {
    try {
      const res = await ratingService.getCurrentUserRatings()
      setRatings(res.data || [])
    } catch (err) {
      console.error('Error fetching ratings:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStreak = async () => {
    try {
      const res = await ratingService.getMyRatingCount() // hit /ratings/me/count
      setStreakCount(res.data.total || 0)
    } catch (err) {
      console.error('Error fetching streak count:', err)
    }
  }

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    try {
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      )
      setPasswordSuccess('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setTimeout(() => {
        setShowPasswordForm(false)
        setPasswordSuccess('')
      }, 2000)
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password')
    }
  }

  if (!user) return null

  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0

  const streakProgress = Math.min(100, (streakCount / STREAK_TARGET) * 100)

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user.name}! 👋</h1>
          <p>Your rating dashboard and profile</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Logout →
        </button>
      </div>

      <div className="dashboard-container">
        {/* Profile + streak row */}
        <section className="profile-section">
          <div className="profile-card">
            <div className="profile-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="profile-info">
              <h2>{user.name}</h2>
              <p className="profile-email">✉️ {user.email}</p>
              <p className="profile-address">
                📍 {user.address || 'Address not provided'}
              </p>
              <p className="profile-role">
                🎖️ Role: <span className="role-badge">{user.role || 'User'}</span>
              </p>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="btn-edit-password"
            >
              {showPasswordForm ? '✕ Cancel' : '🔒 Change Password'}
            </button>
          </div>

          {/* Gamified rating streak card */}
          <div className="streak-card">
            <h2>Your rating streak</h2>
            <p className="streak-subtitle">
              Rate {STREAK_TARGET} stores to unlock your first badge.
            </p>

            <div className="streak-progress">
              <div
                className="streak-progress-fill"
                style={{ width: `${streakProgress}%` }}
              />
            </div>

            <div className="streak-stats">
              <span className="streak-label">All‑time ratings</span>
              <span className="streak-value">
                {Math.min(streakCount, STREAK_TARGET)} / {STREAK_TARGET} stores
              </span>
            </div>

            <div className="streak-badge-preview">
              <span className="badge-icon">🏅</span>
              <div>
                <p className="badge-title">Explorer badge</p>
                <p className="badge-text">
                  Keep rating to grow your streak and unlock more badges.
                </p>
              </div>
            </div>
          </div>

          {/* Password Change Form */}
          {showPasswordForm && (
            <div className="password-form-container">
              <h3>Change Your Password</h3>
              <form onSubmit={handlePasswordChange} className="password-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter your current password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {passwordError && (
                  <div className="error-message">❌ {passwordError}</div>
                )}
                {passwordSuccess && (
                  <div className="success-message">✅ {passwordSuccess}</div>
                )}

                <button type="submit" className="btn-update-password">
                  Update Password
                </button>
              </form>
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-number">{ratings.length}</div>
              <div className="stat-label">Total Ratings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{avgRating}</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <div className="stat-number">
                {ratings.filter((r) => r.comment).length}
              </div>
              <div className="stat-label">Reviews Written</div>
            </div>
          </div>
        </section>

        {/* Ratings History */}
        <section className="ratings-section">
          <div className="ratings-header">
            <h2>Your Ratings & Reviews</h2>
            <Link to="/" className="btn-rate-more">
              <span>Rate More Stores</span>
              <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading your ratings...</p>
            </div>
          ) : ratings.length === 0 ? (
            <div className="empty-ratings">
              <div className="empty-icon">⭐</div>
              <h3>No ratings yet</h3>
              <p>Start rating stores to see them here</p>
              <Link to="/" className="btn-explore">
                Explore Stores
              </Link>
            </div>
          ) : (
            <div className="ratings-grid">
              {ratings.map((rating) => (
                <div key={rating.id} className="rating-item">
                  <div className="rating-top">
                    <h3>{rating.store_name}</h3>
                    <span className="rating-stars">
                      {'⭐'.repeat(rating.rating)}
                      <span className="rating-value">{rating.rating}/5</span>
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="rating-comment">"{rating.comment}"</p>
                  )}
                  <span className="rating-date">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
