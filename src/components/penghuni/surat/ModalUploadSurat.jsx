import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { uploadSuratKontrak } from "../../../services/api";

export default function ModalUploadSurat({
  isOpen,
  kontrakId,
  namaPenghuni,
  onClose,
  onSuccess,
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Silakan pilih file surat terlebih dahulu.");
      return;
    }

    if (!kontrakId) {
      alert("Kontrak penghuni tidak ditemukan.");
      return;
    }

    try {
      setLoading(true);

      // Panggil API baru untuk mengunggah berkas kontrak bertanda tangan
      const hasil = await uploadSuratKontrak(kontrakId, file);

      alert("Surat bertanda tangan berhasil diunggah!");

      if (typeof onSuccess === "function") {
        onSuccess(hasil);
      }

      setFile(null);
      onClose();
    } catch (error) {
      console.error("Gagal upload surat:", error);
      alert(error.message || "Surat gagal diupload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Upload Surat Kontrak (Signed)
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Penghuni:{" "}
              <span className="font-semibold text-slate-700">
                {namaPenghuni || "-"}
              </span>{" "}
              (Kontrak ID #{kontrakId})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM UPLOAD */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pilih Berkas Surat
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-5 py-8 transition hover:border-blue-400 hover:bg-blue-50/30">
              <FileText size={36} className="mb-2 text-slate-400" />

              <span className="text-sm font-medium text-slate-600 text-center">
                {file ? file.name : "Klik untuk memilih file"}
              </span>

              <span className="mt-1.5 text-xs text-slate-400">
                PDF, JPG, PNG, atau WEBP (Maksimal berkas fisik)
              </span>

              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0] || null;
                  setFile(selectedFile);
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* INFORMASI BERKAS TERPILIH */}
          {file && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Berkas Terpilih
              </p>
              <p className="mt-0.5 break-all text-xs font-semibold text-slate-700">
                {file.name}
              </p>
            </div>
          )}

          {/* FOOTER & BUTTONS */}
          <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 transition"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading || !file}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition shadow-xs"
            >
              <Upload size={16} />
              {loading ? "Mengunggah..." : "Simpan Berkas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}