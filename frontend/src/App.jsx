import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StoresListPage from './pages/StoresListPage';
import StoreDetailPage from './pages/StoreDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminStoresPage from './pages/AdminStoresPage';
import OwnerDashboard from './pages/OwnerDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/stores"
            element={
              <ProtectedRoute allowedRoles={['NORMAL_USER']}>
                <StoresListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stores/:id"
            element={
              <ProtectedRoute allowedRoles={['NORMAL_USER']}>
                <StoreDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                <AdminStoresPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
