import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';   
import DashboardPage from './pages/DashboardPage';
import KamarPage from './pages/KamarPage';
import PenghuniPage from './pages/PenghuniPage';
import KeuanganPage from './pages/KeuanganPage';
import AdminRecoveryPage from "./pages/AdminRecoveryPage";
import ProtectedRoute from "./components/ProtectedRoute"; // <-- Import komponen pelindung rute

export default function App() {

  return (
    <Router>
      <Routes>
        {/* Rute Publik (Bisa diakses siapa saja) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/admin/recovery" element={<AdminRecoveryPage />} />

        {/* Rute Privat / Dilindungi (Wajib Login) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/kamar" 
          element={
            <ProtectedRoute>
              <KamarPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/penghuni" 
          element={
            <ProtectedRoute>
              <PenghuniPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/keuangan" 
          element={
            <ProtectedRoute>
              <KeuanganPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}