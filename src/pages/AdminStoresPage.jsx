import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminStoresPage = () => {
  const { token } = useAuth();
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/admin/stores', {
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

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2>Stores</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table width="100%" border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Owner</th>
            <th>Average Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.owner?.name || s.ownerId}</td>
              <td>{s.averageRating ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStoresPage;

