import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminUsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState('name');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  const filtered = useMemo(() => {
    const lower = filter.toLowerCase();
    return users
      .filter((u) => u.name?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower))
      .sort((a, b) => {
        if (sortKey === 'name') return (a.name || '').localeCompare(b.name || '');
        if (sortKey === 'email') return (a.email || '').localeCompare(b.email || '');
        return 0;
      });
  }, [users, filter, sortKey]);

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2>Users</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Filter by name or email"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table width="100%" border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;

