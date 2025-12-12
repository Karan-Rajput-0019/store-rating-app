import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/admin/dashboard/summary', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchSummary();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Admin Dashboard</h2>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>No data</p>
      )}
    </div>
  );
};

export default AdminDashboard;

