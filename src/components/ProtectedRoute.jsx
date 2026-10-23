// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Cek ke sessionStorage (akan otomatis null jika tab ditutup)
  const isAuthenticated = sessionStorage.getItem("token") || sessionStorage.getItem("isAdminLoggedIn");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}