import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateStore() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("/stores", {
        name,
        email,
        address,
        owner_id: Number(ownerId),
      });
      setMessage("Store created successfully");
      // Optional: redirect to list after a short delay
      setTimeout(() => navigate("/stores"), 800);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create store"
      );
    }
  };
  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Create Store</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Owner ID</label>
          <input
            type="number"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            required
          />
        </div>
        <button style={{ marginTop: 16 }} type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
