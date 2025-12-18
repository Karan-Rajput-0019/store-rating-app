import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StoreCard from '../components/StoreCard'
import storeService from '../services/storeService'
import '../styles/Home.css'

export default function Home() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      const res = await storeService.getAllStores()
      setStores(res.data || [])
    } catch (err) {
      console.error('Error fetching stores:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (store.location && store.location.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filter === 'all' || store.category === filter
    return matchesSearch && matchesFilter
  })

  const categories = [...new Set(stores.map(s => s.category).filter(Boolean))]
  const avgRating = stores.length > 0 
    ? (stores.reduce((sum, s) => sum + (s.rating || 0), 0) / stores.length).toFixed(1)
    : 0

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">Discover</span> Amazing Stores
          </h1>
          <p className="hero-subtitle">
            Read honest reviews, share your experience, and find the best stores in your city
          </p>

          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search stores by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">{stores.length}</div>
            <div className="stat-label">Stores</div>
          </div>
          <div className="stat">
            <div className="stat-number">⭐{avgRating}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
          <div className="stat">
            <div className="stat-number">10k+</div>
            <div className="stat-label">Reviews</div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filters-section">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Stores
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${filter === category ? 'active' : ''}`}
            onClick={() => setFilter(category)}
          >
            {category || 'Other'}
          </button>
        ))}
      </section>

      {/* Stores Grid */}
      <section className="stores-section">
        {loading ? (
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p>Finding awesome stores...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏪</div>
            <h3>No stores found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="stores-grid">
            {filteredStores.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      {filteredStores.length > 0 && (
        <section className="cta-section">
          <h2>Ready to share your experience?</h2>
          <p>Rate and review stores to help others find the best places</p>
          <Link to="/login" className="btn-cta">
            <span>Start Rating Now</span>
            <span className="arrow">🚀</span>
          </Link>
        </section>
      )}
    </div>
  )
}