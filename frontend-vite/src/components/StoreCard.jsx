import { Link } from 'react-router-dom'
import '../styles/store-card.css'

export default function StoreCard({ store }) {
  return (
    <Link to={`/store/${store.id}`} className="store-card-link">
      <div className="store-card">
        <div className="card-header">
          <div className="store-badge">
            {store.category || '📦'}
          </div>
          <div className="rating-badge">
            <span className="star">⭐</span>
            <span className="rating">{store.rating ? store.rating.toFixed(1) : 'N/A'}</span>
          </div>
        </div>

        <div className="card-body">
          <h3 className="store-name">{store.name}</h3>
          <p className="store-location">
            📍 {store.location || 'Location not specified'}
          </p>
          {store.description && (
            <p className="store-description">{store.description}</p>
          )}
        </div>

        <div className="card-footer">
          <button className="btn-visit">
            <span>View Details</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </Link>
  )
}