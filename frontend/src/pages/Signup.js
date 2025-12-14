import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // use existing backend route
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/stores");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card signup-card"
      style={{ maxWidth: 520, margin: "40px auto" }}
    >
      <h2 className="page-title">Welcome</h2>
      <p className="page-subtitle">
        Create your account to start rating stores.
      </p>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="signup-form-grid">
        <div className="form-group">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                </div>
        
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </form>
        
              <p className="login-link">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </div>
          );
        }
