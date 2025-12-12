import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const redirectByRole = (role) => {
    if (role === 'SYSTEM_ADMIN') return navigate('/admin');
    if (role === 'STORE_OWNER') return navigate('/owner');
    return navigate('/stores');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      login(res.data);
      redirectByRole(res.data.user.role);
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="auth-card">
        <header>
          <h2>Welcome back</h2>
          <p className="muted">Sign in to access your dashboard.</p>
        </header>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <p>
          No account? <Link to="/signup">Sign up</Link>
      </p>
      </div>
    </div>
  );
};

export default LoginPage;

