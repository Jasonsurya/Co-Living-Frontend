export default function PopUp_Kamar({ isOpen, onClose, onConfirm, nomorKamar, namaPenghuni }) {
  // Jika modal tidak aktif, jangan tampilkan apa-apa
if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Lapisan Latar Belakang Gelap Halus (Backdrop Blur) */}
    <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose} 
    />

      {/* Konten Kotak Pop-up */}
    <div className="relative bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl border border-slate-100 z-10 text-center animate-fadeIn">
        
        {/* Ikon Peringatan */}
        <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border border-rose-100 shadow-xs">
        <i className="fas fa-door-open"></i>
        </div>

        {/* Teks Validasi */}
        <h3 className="text-base font-black text-slate-950 tracking-tight">
        Kosongkan Kamar {nomorKamar}
        </h3>
        
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
        Apakah Anda yakin ingin mengeluarkan <span className="font-bold text-slate-950">{namaPenghuni}</span> dari kamar ini dan mengubah status kamar menjadi tersedia kembali?
        </p>

        {/* Tombol Aksi (Iya / Tidak) */}
        <div className="grid grid-cols-2 gap-3 mt-6">
        <button 
            type="button"
            onClick={onClose} 
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer active:scale-95"
        >
            Tidak, Batal
        </button>
        
        <button 
            type="button"
            onClick={onConfirm} 
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-rose-600/10 transition-all cursor-pointer active:scale-95"
        >
            Ya, Keluarkan
        </button>
        </div>

    </div>
    </div>
);
}