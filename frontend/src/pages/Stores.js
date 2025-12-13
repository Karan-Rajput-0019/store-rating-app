import { useEffect, useState } from "react";
import api from "../services/api";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get("/stores");
        setStores(res.data);
      } catch (err) {
        setError("Failed to load stores");
      }
    };
    fetchStores();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>Stores</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {stores.length === 0 ? (
        <p>No stores yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Average Rating</th>
              <th>Total Ratings</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.address}</td>
                <td>{s.averageRating ?? "N/A"}</td>
                <td>{s.totalRatings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
