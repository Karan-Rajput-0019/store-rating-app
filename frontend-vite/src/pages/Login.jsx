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
      // authService.login returns res.data
      const data = await authService.login(email, password)

      // success: clear error and store auth data
      setError('')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      // handleError in authService throws Error with message
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

        <div className="auth-illustration">
          <div className="illustration-content">
            <div className="store-card-demo">
              <div className="demo-star">⭐⭐⭐⭐⭐</div>
              <div className="demo-text">Amazing Experience</div>
            </div>
            <div className="user-avatars">
              <div className="avatar avatar-1">👤</div>
              <div className="avatar avatar-2">👥</div>
              <div className="avatar avatar-3">👫</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

