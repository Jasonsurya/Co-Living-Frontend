// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react'; // Menggunakan ikon modern agar aman dari error path gambar

const loginText = {
  welcome: "Welcome to Co-Living Pagul!",
  subWelcome: "Log in to access your dashboard management account.",
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // FUNGSI LOGIKA CEK LOGIN KE BACKEND API (Otomatis deteksi lokal vs Railway)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const API_URL = window.location.hostname === "localhost"
      ? "http://localhost:5000/api"
      : "https://co-living-backend-production.up.railway.app/api";

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Username atau Password salah!");
      }

      // Simpan status sesi ke localStorage
      localStorage.setItem("admin", JSON.stringify(result.data));

      // Arahkan ke dashboard
      navigate('/dashboard');

    } catch (error) {
      alert(error.message || "Gagal melakukan login");
      setPassword(''); // Reset password jika gagal
    } finally {
      setLoading(false);
    }
  };

  // FUNGSI PENANGANAN LUPA PASSWORD UNTUK PUBLIK
  const handleLupaPasswordClick = (e) => {
    e.preventDefault();
    alert(
      "Sistem pemulihan mandiri dinonaktifkan demi keamanan. Silakan hubungi Pemilik Co-Living Pagul melalui kontak resmi untuk instruksi pemulihan akun."
    );
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden font-sans antialiased">
      <div 
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')` }}
      />
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" />

      <div className="relative bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl border border-slate-100 z-10 text-left">
        
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2.5 mb-3 bg-slate-100 px-3 py-1.5 rounded-full">
            <Building2 className="h-5 w-5 text-slate-900" />
            <span className="text-xs font-black text-slate-950 tracking-tight">CO-LIVING PAGUL</span>
          </div>
          <h3 className="text-xl font-black text-slate-950 tracking-tight mt-2">{loginText.welcome}</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium px-4">{loginText.subWelcome}</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username admin"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-slate-800"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-500 font-medium cursor-pointer">
              <input type="checkbox" className="rounded-sm border-slate-300 accent-slate-900" />
              Ingat Saya
            </label>
            
            <button 
              type="button"
              onClick={handleLupaPasswordClick}
              className="text-slate-500 hover:text-slate-950 transition-colors font-semibold cursor-pointer"
            >
              Lupa Password?
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Link to="/" className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm py-3.5 rounded-xl transition-all active:scale-98 text-center inline-block">
              Batal
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3.5 rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer text-center disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}