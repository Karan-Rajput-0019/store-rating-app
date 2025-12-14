import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Stores from "./pages/Stores";
import Signup from "./pages/Signup";
import CreateStore from "./pages/CreateStore";
import Home from "./pages/Home";
import MyRatings from "./pages/MyRatings";
import "./App.css";

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
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  return (
    <div>
      <nav className="app-nav">
        <div className="app-nav-left">
          <span className="brand">Store Rating</span>

          {isLoggedIn && (
            <>
              <Link className="nav-link" to="/">
                Home
              </Link>
              <Link className="nav-link" to="/stores">
                Stores
              </Link>
              <Link className="nav-link" to="/stores/create">
                New Store
              </Link>
              <Link className="nav-link" to="/my-ratings">
                My Ratings
              </Link>
            </>
          )}
        </div>

        <div className="app-nav-right">
          {user && (
            <Link to="/" className="badge">
              {user.name?.split(" ")[0] || user.email}
            </Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link className="nav-link" to="/signup">
                Sign up
              </Link>
              <Link className="button secondary" to="/login">
                Login
              </Link>
            </>
          ) : (
            <button className="button-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/stores"
          element={
            <PrivateRoute>
              <Stores />
            </PrivateRoute>
          }
        />

        <Route
          path="/stores/create"
          element={
            <PrivateRoute>
              <CreateStore />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-ratings"
          element={
            <PrivateRoute>
              <MyRatings />
            </PrivateRoute>
          }
        />

        {/* default */}
        <Route
          path="*"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}
