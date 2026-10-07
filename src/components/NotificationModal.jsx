// src/components/NotificationModal.jsx
export default function NotificationModal({ isOpen, title, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
        
        {/* Ikon Email / Pesan */}
        <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3 text-xl font-bold">
          ✉️
        </div>

        <h3 className="text-lg font-black text-slate-950">{title || "Informasi"}</h3>
        
        <p className="text-xs text-slate-500 mt-2 leading-relaxed px-2">
          {message || "Kode verifikasi OTP telah dikirimkan melalui email Anda. Silakan periksa kotak masuk atau folder spam."}
        </p>

        {/* Tombol Tutup / Lanjutkan */}
        <div className="pt-5">
          <button 
            type="button" 
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Tutup & Masukkan OTP
          </button>
        </div>
      </div>
    </div>
  );
}