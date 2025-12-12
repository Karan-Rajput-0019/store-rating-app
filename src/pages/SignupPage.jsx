import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.name.length < 20 || form.name.length > 60) {
      return setError('Name must be 20-60 characters');
    }
    if (!emailRegex.test(form.email)) {
      return setError('Invalid email');
    }
    if (form.address.length > 400) {
      return setError('Address must be at most 400 characters');
    }
    if (!passwordRegex.test(form.password)) {
      return setError('Password must be 8-16 chars with one uppercase and one special char');
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', form);
      // Auto-login after signup
      const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
        email: form.email,
        password: form.password,
      });
      login(loginRes.data);
      navigate('/stores');
    } catch (err) {
      setError(err?.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;

