import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) {
    return (
      <div className="card" style={{ maxWidth: 480, margin: "40px auto" }}>
        <h2 className="page-title">Welcome</h2>
        <p className="page-subtitle">
          Log in or sign up to start rating stores.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
      <h2 className="page-title">Hi, {user.name || user.email}</h2>
      <p className="page-subtitle">
        This is your profile overview for Store Rating.
      </p>

      <div className="profile-grid">
        <div className="profile-item">
          <span className="profile-label">Name</span>
          <span className="profile-value">{user.name || "–"}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Email</span>
          <span className="profile-value">{user.email}</span>
        </div>
        {user.role && (
          <div className="profile-item">
            <span className="profile-label">Role</span>
            <span className="profile-value">{user.role}</span>
          </div>
        )}
      </div>
    </div>
  );
}
