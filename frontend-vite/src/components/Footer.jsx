import '../styles/Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>RateHub</h4>
            <p>Discover and rate your favorite stores</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/">Stores</a></li>
              <li><a href="/">Dashboard</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" title="Facebook">f</a>
              <a href="#" title="Twitter">𝕏</a>
              <a href="#" title="Instagram">📷</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} RateHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}