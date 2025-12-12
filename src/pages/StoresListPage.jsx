import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const StoresListPage = () => {
  const { token } = useAuth();
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ratingValues, setRatingValues] = useState({});

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/stores', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load stores');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStores();
  }, [token]);

  const handleRate = async (storeId) => {
    const value = Number(ratingValues[storeId]);
    if (!value || value < 1 || value > 5) {
      return setError('Rating must be between 1 and 5');
    }
    setError('');
    try {
      await axios.post(
        `http://localhost:5000/api/stores/${storeId}/ratings`,
        { value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // refresh list
      const res = await axios.get('http://localhost:5000/api/stores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to submit rating');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h2>Stores</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {stores.map((store) => (
          <li key={store.id} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
            <div>
              <strong>{store.name}</strong> ({store.email})
            </div>
            <div>{store.address}</div>
            <div>Average Rating: {store.averageRating ?? 'N/A'}</div>
            <div>
              <input
                type="number"
                min="1"
                max="5"
                value={ratingValues[store.id] || ''}
                onChange={(e) => setRatingValues({ ...ratingValues, [store.id]: e.target.value })}
                placeholder="Rate 1-5"
              />
              <button onClick={() => handleRate(store.id)}>Submit Rating</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoresListPage;

