import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OwnerDashboard = () => {
  const { token } = useAuth();
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/owners/me/stores', {
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

  const fetchRatings = async (storeId) => {
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/owners/stores/${storeId}/ratings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRatings(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load ratings');
    }
  };

  const handleSelect = (store) => {
    setSelectedStore(store);
    fetchRatings(store.id);
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2>Owner Dashboard</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h3>Your Stores</h3>
          <ul>
            {stores.map((s) => (
              <li key={s.id}>
                <button onClick={() => handleSelect(s)}>{s.name}</button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 2 }}>
          <h3>Ratings</h3>
          {selectedStore ? <p>Store: {selectedStore.name}</p> : <p>Select a store</p>}
          <ul>
            {ratings.map((r) => (
              <li key={r.id}>
                {r.value} - user {r.userId}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;

