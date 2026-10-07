// src/pages/AdminRecoveryPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, Mail, ShieldCheck, ArrowLeft, Lock, User } from "lucide-react";
import OtpModal from "../components/OtpModal";

const BACKEND_URL = "http://localhost:5000";

export default function AdminRecoveryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Ambil secretKey sekali saja saat komponen dimuat (Lazy Initial State)
  const [secretKey] = useState(() => searchParams.get("key") || "");

  const [step, setStep] = useState(1); // 1 = Input Email, 2 = Form Kredensial Baru
  const [email, setEmail] = useState("");
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Bersihkan parameter ?key=... dari address bar browser
  useEffect(() => {
    if (searchParams.get("key")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  // JIKA TIDAK ADA SECRET KEY
  if (!secretKey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4 text-white">
        <div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 text-center border border-slate-700 shadow-xl">
          <ShieldCheck size={48} className="mx-auto text-rose-500 mb-4" />
          <h2 className="text-xl font-bold">Akses Ditolak (404)</h2>
          <p className="mt-2 text-xs text-slate-400">
            Halaman pemulihan akun tidak ditemukan atau kunci rahasia tidak valid.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-slate-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-600 transition cursor-pointer"
          >
            Kembali ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  // TAHAP 1: REQUEST OTP KE EMAIL
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return setMessage({ type: "error", text: "Email wajib diisi" });

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const res = await fetch(`${BACKEND_URL}/api/auth/lupa-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim(), 
          secretKey: secretKey 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengirimkan OTP.");
      }

      setMessage({ type: "success", text: data.message });
      setShowOtpModal(true); // Buka OtpModal
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // HANDLER DARI OTP MODAL SAAT KLIK KONFIRMASI
  const handleVerifyOtpFromModal = (finalOtp) => {
    setVerifiedOtp(finalOtp);
    setShowOtpModal(false);
    setStep(2); // Pindah ke Form Kredensial Baru
    setMessage({ type: "success", text: "Kode OTP dikonfirmasi. Silakan buat Username & Password baru." });
  };

  // TAHAP 2: SIMPAN USERNAME BARU & PASSWORD BARU
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newUsername || !newPassword || !confirmPassword) {
      return setMessage({
        type: "error",
        text: "Seluruh kolom wajib diisi!",
      });
    }

    if (newPassword !== confirmPassword) {
      return setMessage({
        type: "error",
        text: "Password Baru dan Konfirmasi Password tidak cocok!",
      });
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: verifiedOtp,
          newUsername: newUsername.trim(),
          newPassword: newPassword,
          secretKey: secretKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal memperbarui kredensial.");
      }

      alert("Pemulihan Akun Berhasil! Silakan Login dengan Kredensial Baru Anda.");
      navigate("/");
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 font-sans">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-slate-100 space-y-6">
        
        {/* HEADER */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
            <KeyRound size={22} />
          </div>
          <h1 className="text-lg font-bold text-slate-800">
            Pemulihan Akun Admin
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Co-Living Pagul System Management
          </p>
        </div>

        {/* NOTIFIKASI ERROR / SUCCESS */}
        {message.text && (
          <div
            className={`rounded-xl p-3.5 text-xs font-semibold ${
              message.type === "error"
                ? "bg-rose-50 border border-rose-200 text-rose-700"
                : "bg-emerald-50 border border-emerald-200 text-emerald-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* STEP 1: FORM INPUT EMAIL ADMIN */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alamat Email Admin Terdaftar
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  placeholder="Masukkan email admin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-slate-800 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 cursor-pointer shadow-md"
            >
              {loading ? "Mengirim OTP..." : "Kirim Kode OTP Ke Email"}
            </button>
          </form>
        )}

        {/* STEP 2: FORM BUAT USERNAME BARU & PASSWORD BARU (+ KONFIRMASI) */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username Baru
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  required
                  placeholder="Masukkan username baru"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-slate-800 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password Baru
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  required
                  placeholder="Masukkan password baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-slate-800 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  required
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-slate-800 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer shadow-md"
            >
              {loading ? "Memproses..." : "Simpan Kredensial Baru"}
            </button>
          </form>
        )}

        {/* FOOTER */}
        <div className="border-t border-slate-100 pt-4 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <ArrowLeft size={14} /> Kembali ke Login
          </button>
        </div>
      </div>

      {/* POP-UP MODAL INPUT 5 KOTAK OTP */}
      <OtpModal
        isOpen={showOtpModal}
        emailTujuan={email}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtpFromModal}
      />
    </div>
  );
}