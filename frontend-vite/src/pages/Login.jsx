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
        {/* Left Column: Login Card + Middle Panel */}
        <div className="auth-left-column">
          {/* Top: login card */}
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


          {/* Bottom: Generic coverage panel */}
          <div className="auth-illustration">
            <div className="india-map-panel">
              <h2>Trusted ratings near you</h2>
              <p className="india-map-text">
                From your city to hidden gems, discover rated stores wherever you go.
              </p>


              <div className="india-map-wrapper">
                <div className="india-map-shape">
                  <div className="discovery-dot dot-1">●</div>
                  <div className="discovery-dot dot-2">●</div>
                  <div className="discovery-dot dot-3">●</div>
                  <div className="discovery-dot dot-4">●</div>
                </div>
              </div>


              <div className="india-map-tags">
                <span className="map-tag">Cafes</span>
                <span className="map-tag">Groceries</span>
                <span className="map-tag">Electronics</span>
              </div>
            </div>
          </div>
        </div>


        {/* Right: Enhanced story panel */}
        <div className="story-panel">
          {/* Top Section: Without Reviews */}
          <div className="story-section story-top fade-in-up">
            <div className="story-emoji">😕</div>
            <div className="story-content">
              <p className="story-title">Without reviews</p>
              <p className="story-text">Walk, ask, guess. 2+ hours gone.</p>
              
              {/* Icons + Short Labels */}
              <div className="story-icons">
                <div className="story-icon-item">
                  <span className="icon-emoji">😕</span>
                  <span className="icon-label">Uncertain</span>
                </div>
                <div className="story-icon-item">
                  <span className="icon-emoji">⏳</span>
                  <span className="icon-label">Time-consuming</span>
                </div>
                <div className="story-icon-item">
                  <span className="icon-emoji">🎲</span>
                  <span className="icon-label">Risky choice</span>
                </div>
              </div>

              {/* Benefit Bullets */}
              <div className="story-bullets">
                <div className="bullet">• Walk around confused</div>
                <div className="bullet">• Ask strangers</div>
                <div className="bullet">• Waste time</div>
              </div>

              {/* Statistics */}
              <div className="story-stats">
                <div className="stat-item">
                  <div className="stat-number">40%</div>
                  <div className="stat-label">Success rate</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">2h</div>
                  <div className="stat-label">Decision time</div>
                </div>
              </div>

              {/* Comparison Row */}
              <div className="story-comparison-row">
                <div className="comparison-col">
                  <div className="comparison-header">Time</div>
                  <div className="comparison-value">2+ hours</div>
                </div>
                <div className="comparison-col">
                  <div className="comparison-header">Confidence</div>
                  <div className="comparison-value">Low</div>
                </div>
              </div>
            </div>
          </div>


          {/* Middle Section: Or Divider */}
          <div className="story-section story-middle">
            <div className="story-divider-container">
              <div className="story-arrow">➜</div>
              <p className="story-or">
                <span className="or-badge">Or</span>
              </p>
            </div>
          </div>


          {/* Bottom Section: With RateHub */}
          <div className="story-section story-bottom fade-in-up recommended">
            <div className="story-badge">⭐ Recommended</div>
            <div className="story-emoji">😎</div>
            <div className="story-content">
              <p className="story-title">With RateHub</p>
              <p className="story-text">4.6★ stores near you. Decide in 5 mins.</p>
              
              {/* Icons + Short Labels */}
              <div className="story-icons">
                <div className="story-icon-item">
                  <span className="icon-emoji">✅</span>
                  <span className="icon-label">Confident</span>
                </div>
                <div className="story-icon-item">
                  <span className="icon-emoji">⚡</span>
                  <span className="icon-label">Quick</span>
                </div>
                <div className="story-icon-item">
                  <span className="icon-emoji">🎯</span>
                  <span className="icon-label">Informed choice</span>
                </div>
              </div>

              {/* Benefit Bullets */}
              <div className="story-bullets">
                <div className="bullet">• Find rated stores</div>
                <div className="bullet">• Read verified reviews</div>
                <div className="bullet">• Make smart choices</div>
              </div>

              {/* Statistics */}
              <div className="story-stats">
                <div className="stat-item highlight">
                  <div className="stat-number">94%</div>
                  <div className="stat-label">Success rate</div>
                </div>
                <div className="stat-item highlight">
                  <div className="stat-number">5min</div>
                  <div className="stat-label">Decision time</div>
                </div>
              </div>

              {/* Comparison Row */}
              <div className="story-comparison-row">
                <div className="comparison-col">
                  <div className="comparison-header">Time</div>
                  <div className="comparison-value">5 minutes</div>
                </div>
                <div className="comparison-col">
                  <div className="comparison-header">Confidence</div>
                  <div className="comparison-value">4.6★ verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}






