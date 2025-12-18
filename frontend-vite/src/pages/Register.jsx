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

        {/* Right-side India map panel, same as Login */}
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
      </div>
    </div>
  )
}
