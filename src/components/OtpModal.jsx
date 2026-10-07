// src/components/OtpModal.jsx
import { useState } from 'react';

export default function OtpModal({ isOpen, emailTujuan = "", onClose, onVerify }) {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '']);

  if (!isOpen) return null;

  const handleClose = () => {
    setOtpValues(['', '', '', '', '']);
    if (onClose) onClose();
  };

  const maskEmail = (str) => {
    if (!str || !str.includes('@')) return "email terdaftar";
    const [name, domain] = str.split('@');
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.substring(0, 2)}***@${domain}`;
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.toUpperCase();
    if (value.length > 1) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      e.target.previousSibling?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().toUpperCase();
    if (pasteData.length === 5) {
      setOtpValues(pasteData.split(''));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalOtp = otpValues.join("");
    if (finalOtp.length < 5) {
      alert("Masukkan 5 karakter kode OTP secara lengkap!");
      return;
    }
    onVerify(finalOtp);
    setOtpValues(['', '', '', '', '']);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
        
        <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3 text-xl font-bold">
          ✉️
        </div>

        <h3 className="text-lg font-black text-slate-950">Verifikasi Kode OTP</h3>
        
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed px-1">
          Silakan masukkan 5 karakter kode OTP yang telah dikirimkan ke{" "}
          <span className="font-bold text-slate-800">
            {maskEmail(emailTujuan)}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otpValues.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                required
                value={data}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-11 h-12 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-black focus:outline-hidden focus:border-slate-900 focus:bg-white transition-all text-slate-800 uppercase shadow-xs"
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              type="button" 
              onClick={handleClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-3 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Konfirmasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}