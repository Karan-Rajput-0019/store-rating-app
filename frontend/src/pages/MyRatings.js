import { useEffect, useState } from "react";
import api from "../services/api";

export default function MyRatings() {
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState("");

  const fetchRatings = async () => {
    try {
      setError("");
      const res = await api.get("/ratings/me");
      setRatings(res.data);
    } catch (err) {
      setError("Failed to load your ratings");
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  return (
    <div className="card">
      <h2 className="page-title">My Ratings</h2>
      <p className="page-subtitle">
        All the ratings you have submitted so far.
      </p>

      {error && <p className="error-text">{error}</p>}

      <div className="table-wrapper">
        {ratings.length === 0 ? (
          <p>You have not rated any stores yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Store</th>
                <th>Rating</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r) => (
                <tr key={r.id}>
                  <td>{r.storeName}</td>
                  <td>{r.rating}</td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
