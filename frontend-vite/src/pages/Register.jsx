import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../services/authService'
import '../styles/Auth.css'


export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const navigate = useNavigate()


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  const handleNext = (e) => {
    e.preventDefault()
    if (step === 1 && formData.name && formData.email) {
      setStep(2)
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')


    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }


    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }


    setLoading(true)


    try {
      const normalizedEmail = formData.email.trim().toLowerCase()


      await authService.register({
        name: formData.name,
        email: normalizedEmail,
        password: formData.password,
        address: formData.address,
      })


      const res = await authService.login(normalizedEmail, formData.password)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
        {/* Left: register card */}
        <div className="auth-card register-card">
          <div className="auth-header">
            <div className="logo-circle">
              <span className="logo-icon">🏪</span>
            </div>
            <h1>Join RateHub</h1>
            <p className="tagline">Start rating and sharing today</p>
          </div>


          <div className="step-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span>1</span>
              <label>Basic Info</label>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span>2</span>
              <label>Security</label>
            </div>
          </div>


          {step === 1 ? (
            <form onSubmit={handleNext} className="auth-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="auth-input"
                  />
                  <span className="input-icon">👤</span>
                </div>
              </div>


              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="auth-input"
                  />
                  <span className="input-icon">✉️</span>
                </div>
              </div>


              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="address"
                    placeholder="Your address (optional)"
                    value={formData.address}
                    onChange={handleChange}
                    className="auth-input"
                  />
                  <span className="input-icon">📍</span>
                </div>
              </div>


              <button type="submit" className="btn-next">
                <span>Next</span>
                <span className="btn-arrow">→</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="auth-input"
                  />
                  <span className="input-icon">🔐</span>
                </div>
                <small className="password-hint">Min 6 characters</small>
              </div>


              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="auth-input"
                  />
                  <span className="input-icon">✓</span>
                </div>
              </div>


              {error && (
                <div className="error-alert">
                  <span className="error-icon">⚠️</span>
                  <p>{error}</p>
                </div>
              )}


              <div className="button-group">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-back"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-register"
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <span>🎉</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}


          <div className="auth-divider">
            <span>Have an account?</span>
          </div>


          <Link to="/login" className="btn-secondary">
            <span>Sign In</span>
            <span className="arrow-icon">→</span>
          </Link>
        </div>


        {/* Middle: Generic coverage panel */}
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






