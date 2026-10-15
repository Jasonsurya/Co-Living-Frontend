import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';   
import DashboardPage from './pages/DashboardPage';
import KamarPage from './pages/KamarPage';
import PenghuniPage from './pages/PenghuniPage';
import KeuanganPage from './pages/KeuanganPage';
import AdminRecoveryPage from "./pages/AdminRecoveryPage";

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={<LoginPage />} /> 

        <Route path="/admin/recovery" element={<AdminRecoveryPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/kamar" element={<KamarPage />} />

        <Route path="/penghuni" element={<PenghuniPage />} />

        <Route path="/keuangan" element={<KeuanganPage />} />
      </Routes>

    </Router>
  );
}