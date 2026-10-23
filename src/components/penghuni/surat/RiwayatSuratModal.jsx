import { useEffect, useState } from "react";
import {
  Eye,
  X,
  FileText,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { getRiwayatSuratPenghuni, getDokumenKontrak } from "../../../services/api";

// --- PERBAIKAN DI SINI (Gunakan config pusat) ---
import { getBaseUrl } from "../../../services/api/config"; // Sesuaikan path relative foldernya

// Otomatis berubah ke Railway saat online di Vercel, dan localhost saat di development
const BACKEND_URL = getBaseUrl().replace("/api", "");

export default function RiwayatSuratModal({
  isOpen,
  onClose,
  kontrakId,
  penghuniId,
  namaPenghuni,
  isKontrakAktif = true,
}) {
  const [daftarSurat, setDaftarSurat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const fetchRiwayatSurat = async () => {
      // PERBAIKAN UTAMA: Jika modal dibuka dari Kontrak Mati (Riwayat Penghuni/Kontrak 16),
      // Murni kosongkan daftarSurat dan jangan tarik data tabel.
      if (!isKontrakAktif) {
        if (isMounted) setDaftarSurat([]);
        return;
      }

      // Jika dibuka dari Kontrak Aktif (Penghuni Aktif/Kontrak 22), tarik seluruh dokumen lintas kontrak
      try {
        setLoading(true);
        setError("");

        let hasil = [];
        if (penghuniId) {
          hasil = await getRiwayatSuratPenghuni(penghuniId);
        } else if (kontrakId) {
          hasil = await getDokumenKontrak(kontrakId);
        }

        if (isMounted) {
          const rawDocs = Array.isArray(hasil) ? hasil : [];

          // Saring hanya dokumen berkas bertanda tangan (upload/signed)
          const uploadDocsOnly = rawDocs.filter((surat) => {
            const rawPath = surat.path_file || surat.file_path || surat.url || "";
            const isGenerateType = surat.tipe_dokumen === "GENERATE";
            const isGeneratePath = rawPath.includes("/generate/");

            return !isGenerateType && !isGeneratePath;
          });

          setDaftarSurat(uploadDocsOnly);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Gagal mengambil riwayat dokumen surat.");
          setDaftarSurat([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRiwayatSurat();

    return () => {
      isMounted = false;
    };
  }, [isOpen, penghuniId, kontrakId, isKontrakAktif]);

  if (!isOpen) return null;

  // FUNGSI BUKA SURAT PDF
  const bukaSurat = (surat) => {
    const rawPath = surat.path_file || surat.file_path || surat.url;

    if (!rawPath) {
      alert("Path atau URL dokumen tidak ditemukan.");
      return;
    }

    const fullUrl = rawPath.startsWith("http")
      ? rawPath
      : `${BACKEND_URL}/${rawPath.replace(/^\/+/, "")}`;

    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-xs">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Riwayat Surat Perjanjian Sewa
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 font-medium">
              Penghuni:{" "}
              <span className="font-semibold text-slate-700">
                {namaPenghuni || "-"}
              </span>{" "}
              {kontrakId ? `(Kontrak ID #${kontrakId})` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* PESAN INFORMASI UI BERDASARKAN STATUS KONTRAK */}
        {!isKontrakAktif ? (
          /* UNTUK KONTRAK LAMA / NONAKTIF (KONTRAK 16 DI RIWAYAT PENGHUNI) */
          <div className="mx-6 mt-6 flex items-start gap-3 rounded-xl bg-slate-100 p-4 border border-slate-200 text-xs text-slate-700">
            <AlertCircle size={18} className="shrink-0 text-slate-500 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">Kontrak Sewa Telah Selesai / Diperpanjang</p>
              <p className="mt-1 font-normal text-slate-600 leading-relaxed">
                Kontrak ini telah diperpanjang/selesai. Berkas dokumen surat perjanjian sewa aktif dapat diakses melalui halaman <span className="font-semibold text-slate-900">Penghuni Aktif</span>.
              </p>
            </div>
          </div>
        ) : (
          /* UNTUK KONTRAK AKTIF (KONTRAK 22 DI PENGHUNI AKTIF) */
          <div className="mx-6 mt-4 flex items-center gap-2.5 rounded-xl bg-emerald-50 p-3 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span>
              Status Kontrak: <strong className="uppercase">Aktif Berjalan</strong>. Menampilkan seluruh riwayat berkas surat perjanjian sewa.
            </span>
          </div>
        )}

        {/* BODY TABEL MODAL */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {!isKontrakAktif ? (
            /* TAMPILAN JIKA DIBUKA DARI TAB RIWAYAT PENGHUNI (KONTRAK 16) */
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <FileText size={40} className="mb-2 text-slate-300" />
              <p className="text-xs text-slate-500 font-medium">
                Arsip berkas aktif dikelola pada kontrak berjalan di tab Penghuni Aktif.
              </p>
            </div>
          ) : (
            /* TAMPILAN TABEL DOKUMEN JIKA DIBUKA DARI TAB PENGHUNI AKTIF (KONTRAK 22) */
            <>
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <p className="text-xs font-medium">Memuat riwayat surat...</p>
                </div>
              )}

              {!loading && error && (
                <div className="flex flex-col items-center justify-center py-12 text-red-500">
                  <FileText size={36} className="mb-2 text-red-400" />
                  <p className="text-xs font-semibold">{error}</p>
                </div>
              )}

              {!loading && !error && daftarSurat.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <FileText size={36} className="mb-2 text-slate-300" />
                  <p className="text-xs font-medium">
                    Belum ada berkas surat bertanda tangan yang diunggah.
                  </p>
                </div>
              )}

              {!loading && !error && daftarSurat.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-center border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3 text-left">Nama File</th>
                        <th className="px-4 py-3">Asal Kontrak</th>
                        <th className="px-4 py-3">Status Dokumen</th>
                        <th className="px-4 py-3">Aksi</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                      {daftarSurat.map((surat, index) => {
                        const isLatest = index === 0;

                        return (
                          <tr
                            key={surat.dokumen_id || surat.id || index}
                            className="transition-colors hover:bg-slate-50"
                          >
                            {/* 1. NO */}
                            <td className="px-4 py-3.5 text-xs font-semibold text-slate-600">
                              {index + 1}
                            </td>

                            {/* 2. NAMA FILE */}
                            <td className="px-4 py-3.5 text-left">
                              <div className="flex items-center gap-2">
                                <FileText size={16} className="text-slate-400 shrink-0" />
                                <div>
                                  <span
                                    className="max-w-xs truncate text-xs font-semibold text-slate-800 block"
                                    title={surat.nama_file}
                                  >
                                    {surat.nama_file || "surat_kontrak_signed.pdf"}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {surat.tanggal_dokumen || surat.created_at || surat.tanggal_upload
                                      ? new Date(
                                          surat.tanggal_dokumen ||
                                            surat.created_at ||
                                            surat.tanggal_upload
                                        ).toLocaleDateString("id-ID", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : "-"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* 3. ASAL KONTRAK */}
                            <td className="px-4 py-3.5 text-xs font-medium text-slate-600">
                              Kontrak #{surat.kontrak_id || kontrakId}
                            </td>

                            {/* 4. STATUS DOKUMEN */}
                            <td className="px-4 py-3.5">
                              {isLatest ? (
                                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                                  Aktif Berjalan
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 border border-slate-200">
                                  Diteruskan / Riwayat
                                </span>
                              )}
                            </td>

                            {/* 5. AKSI */}
                            <td className="px-4 py-3.5">
                              <button
                                type="button"
                                onClick={() => bukaSurat(surat)}
                                title="Lihat Dokumen PDF"
                                className="inline-flex items-center gap-1.5 cursor-pointer rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                              >
                                <Eye size={14} />
                                <span>Lihat</span>
                                <ExternalLink size={12} className="opacity-70" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER MODAL */}
        <div className="flex justify-end border-t border-slate-100 px-6 py-3 bg-slate-50/30">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}