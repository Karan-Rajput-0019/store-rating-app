import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const StoreDetailPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [store, setStore] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ratingValue, setRatingValue] = useState('');

  const fetchStore = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStore(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load store');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const handleRate = async () => {
    const value = Number(ratingValue);
    if (!value || value < 1 || value > 5) {
      return setError('Rating must be between 1 and 5');
    }
    setError('');
    try {
      await axios.post(
        `http://localhost:5000/api/stores/${id}/ratings`,
        { value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRatingValue('');
      fetchStore();
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to submit rating');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!store) return <p>No store found</p>;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h2>{store.name}</h2>
      <p>{store.email}</p>
      <p>{store.address}</p>
      <p>Average Rating: {store.averageRating ?? 'N/A'}</p>

      <h3>Leave a rating</h3>
      <input
        type="number"
        min="1"
        max="5"
        value={ratingValue}
        onChange={(e) => setRatingValue(e.target.value)}
        placeholder="Rate 1-5"
      />
      <button onClick={handleRate}>Submit Rating</button>

      <h3>Ratings</h3>
      <ul>
        {(store.ratings || []).map((r) => (
          <li key={r.id}>
            {r.value} - by user {r.userId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreDetailPage;

