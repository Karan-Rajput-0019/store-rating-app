import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Stores from "./pages/Stores";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div>
      <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
        <Link to="/stores" style={{ marginRight: 10 }}>
          Stores
        </Link>
        {!isLoggedIn ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/stores"
          element={
            <PrivateRoute>
              <Stores />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/stores" replace />} />
      </Routes>
    </div>
  );
}

