import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../services/authService'
import '../styles/Auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const normalizedEmail = email.trim().toLowerCase()
      const data = await authService.login(normalizedEmail, password)

      setError('')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="auth-container">
        {/* Left: login card */}
        <div className="auth-card login-card">
          <div className="auth-header">
            <div className="logo-circle">
              <span className="logo-icon">🏪</span>
            </div>
            <h1>RateHub</h1>
            <p className="tagline">Discover Amazing Stores</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="auth-input"
                />
                <span className="input-icon">✉️</span>
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="auth-input"
                />
                <span className="input-icon">🔐</span>
              </div>
            </div>

            {error && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-login"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>New to RateHub?</span>
          </div>

          <Link to="/register" className="btn-secondary">
            <span>Create Account</span>
            <span className="plus-icon">+</span>
          </Link>

          <div className="auth-features">
            <div className="feature">
              <span>⭐</span>
              <p>Rate stores</p>
            </div>
            <div className="feature">
              <span>💬</span>
              <p>Leave reviews</p>
            </div>
            <div className="feature">
              <span>🔍</span>
              <p>Discover gems</p>
            </div>
          </div>
        </div>

        {/* Middle: India map panel */}
        <div className="auth-illustration">
          <div className="india-map-panel">
            <h2>Trusted ratings across India</h2>
            <p className="india-map-text">
              From metros to hidden towns, discover rated stores wherever you go.
            </p>

            <div className="india-map-wrapper">
              <div className="india-map-shape">
                <span className="map-pin pin-north">●</span>
                <span className="map-pin pin-west">●</span>
                <span className="map-pin pin-south">●</span>
                <span className="map-pin pin-east">●</span>
              </div>
            </div>

            <div className="india-map-tags">
              <span className="map-tag">Cafes</span>
              <span className="map-tag">Groceries</span>
              <span className="map-tag">Electronics</span>
            </div>
          </div>
        </div>

        {/* Right: story panel */}
        <div className="story-panel">
          <div className="story-section story-top">
            <div className="story-emoji">😕</div>
            <div>
              <p className="story-title">Without reviews</p>
              <p className="story-text">Walk, ask, guess. 2+ hours gone.</p>
            </div>
          </div>

          <div className="story-section story-middle">
            <div className="story-arrow">➜</div>
            <p className="story-or">Or</p>
          </div>

          <div className="story-section story-bottom">
            <div className="story-emoji">😎</div>
            <div>
              <p className="story-title">With RateHub</p>
              <p className="story-text">4.6★ stores near you. Decide in 5 mins.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

