import { Link, useNavigate } from 'react-router-dom'
import '../styles/Header.css'

export default function Header() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🏪</span>
          <span className="logo-text">RateHub</span>
        </Link>

        <nav className="nav-menu">
          <Link to="/" className="nav-link">Stores</Link>
          {user && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">👤 {user.name}</span>
              <button onClick={handleLogout} className="btn-logout-header">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login-header">Login</Link>
              <Link to="/register" className="btn-register-header">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}