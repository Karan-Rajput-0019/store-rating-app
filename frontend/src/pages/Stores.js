import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");
  const handleRate = async (storeId, rating) => {
  try {
    await api.post("/stores/rate", { store_id: storeId, rating });
    fetchStores();
  } catch (err) {
    setError("Failed to submit rating");
  }
};



  const fetchStores = async () => {
    try {
      const res = await api.get("/stores/with-user-rating");
      setStores(res.data);
    } catch (err) {
      setError("Failed to load stores");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="card">
      <div className="stores-header">
        <div>
          <h2 className="page-title">Stores</h2>
          <p className="page-subtitle">
            Browse stores and see the community ratings.
          </p>
        </div>

        <Link to="/stores/create" className="btn-new-store">
          + New Store
        </Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="table-wrapper">
        {stores.length === 0 ? (
          <p>No stores yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Average Rating</th>
                <th>Total Ratings</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.address}</td>
                  <td>{s.averageRating ?? "N/A"}</td>
                  <td>{s.totalRatings}</td>
                  <td>
                    <select
                      value={s.userRating ?? ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value) handleRate(s.id, value);
                      }}
                    >
                      <option value="">Rate…</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

