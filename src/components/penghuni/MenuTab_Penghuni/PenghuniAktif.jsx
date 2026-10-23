import { useState } from "react";
import {
  FileText,
  Download,
  Upload,
  History,
  Eye,
} from "lucide-react";

import { generateSuratKontrak } from "../../../services/api";
import HistoryDeposit from "../../penghuni/historyDeposit";

// --- PERBAIKAN DI SINI (Gunakan config pusat) ---
import { getBaseUrl } from "../../../services/api/config"; // Sesuaikan path relative foldernya

const BACKEND_URL = getBaseUrl().replace("/api", ""); 

export default function PenghuniAktif({
  handleOpenDetail,
  setShowUploadModal,   // Membuka ModalUploadSurat.jsx di parent
  setShowRiwayatModal,  // Membuka RiwayatSuratModal.jsx di parent
  penghuni = [],
}) {
  const [depositHistoryPenghuni, setDepositHistoryPenghuni] = useState(null);
  const [loadingGenerateId, setLoadingGenerateId] = useState(null);

  // FUNGSI GENERATE PDF DARI TEMPLATE
  const handleGenerateSurat = async (dataPenghuni) => {
    const kontrakId = dataPenghuni?.kontrak_id;

    if (!kontrakId) {
      alert("Kontrak penghuni tidak ditemukan.");
      return;
    }

    try {
      setLoadingGenerateId(kontrakId);
      const hasil = await generateSuratKontrak(kontrakId);
      const pathFile = hasil?.data?.path_file;

      if (!pathFile) {
        throw new Error("File PDF hasil generate tidak ditemukan.");
      }

      const fullPdfUrl = `${BACKEND_URL}/${pathFile}`;
      window.open(fullPdfUrl, "_blank");
    } catch (error) {
      console.error("ERROR GENERATE SURAT:", error);
      alert(error.message || "Gagal membuat surat dari template.");
    } finally {
      setLoadingGenerateId(null);
    }
  };

  const formatRupiah = (nominal) => {
    return `Rp ${Number(nominal || 0).toLocaleString("id-ID")}`;
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const tanggalString = String(tanggal).slice(0, 10);
    const [tahun, bulan, hari] = tanggalString.split("-");
    if (!tahun || !bulan || !hari) return "-";
    return `${hari}-${bulan}-${tahun}`;
  };

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-widest text-slate-800">
                <th className="whitespace-nowrap px-6 py-4">No Kamar</th>
                <th className="whitespace-nowrap px-6 py-4">Nama Penghuni</th>
                <th className="whitespace-nowrap px-6 py-4">No. HP</th>
                <th className="whitespace-nowrap px-6 py-4">Tanggal Masuk</th>
                <th className="whitespace-nowrap px-6 py-4">Deposit / Denda</th>
                <th className="whitespace-nowrap px-6 py-4">Dokumen Surat</th>
                <th className="whitespace-nowrap px-6 py-4">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {penghuni.map((dataPenghuni) => {
                const sisaDeposit = Number(dataPenghuni?.deposit || 0);
                const totalDenda = Number(dataPenghuni?.denda || 0);
                const hasDepositRecord = Boolean(dataPenghuni?.has_deposit_record);

                const netBalance = sisaDeposit - totalDenda;
                const isGenerating = loadingGenerateId === dataPenghuni.kontrak_id;

                return (
                  <tr
                    key={dataPenghuni.kontrak_id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {dataPenghuni.nomor_kamar}
                    </td>

                    <td className="px-6 py-4">
                      {dataPenghuni ? (
                        <span className="font-medium text-slate-700">
                          {dataPenghuni.nama}
                        </span>
                      ) : (
                        <span className="italic text-slate-400">
                          Kamar Kosong
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-700">
                      {dataPenghuni?.no_hp || "-"}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-700">
                      {formatTanggal(dataPenghuni?.tanggal_mulai)}
                    </td>

                    {/* KOLOM DEPOSIT / DENDA */}
                    <td className="px-6 py-4">
                      {dataPenghuni ? (
                        <div className="flex items-center justify-center gap-2">
                          {netBalance > 0 ? (
                            <>
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                Deposit
                              </span>
                              <span className="font-semibold text-slate-700">
                                {formatRupiah(netBalance)}
                              </span>
                            </>
                          ) : netBalance < 0 ? (
                            <>
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                Denda
                              </span>
                              <span className="font-semibold text-amber-700">
                                {formatRupiah(Math.abs(netBalance))}
                              </span>
                            </>
                          ) : hasDepositRecord || sisaDeposit > 0 ? (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Deposit Habis
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-400 border border-slate-200/60">
                              Belum Diisi Deposit
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => setDepositHistoryPenghuni(dataPenghuni)}
                            title="Riwayat Deposit"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 cursor-pointer ml-1"
                          >
                            <History size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* KOLOM DOKUMEN SURAT */}
                    <td className="px-5 py-4">
                      {dataPenghuni ? (
                        <div className="flex justify-center gap-2">
                          {/* 1. TOMBOL GENERATE SURAT */}
                          <button
                            type="button"
                            onClick={() => handleGenerateSurat(dataPenghuni)}
                            disabled={isGenerating}
                            title="Generate & Buka PDF Surat"
                            className="rounded-lg bg-orange-100 px-3 py-2 text-orange-700 transition hover:bg-orange-200 cursor-pointer disabled:opacity-50"
                          >
                            <Download size={17} />
                          </button>

                          {/* 2. TOMBOL UPLOAD SURAT -> Buka ModalUploadSurat.jsx */}
                          <button
                            type="button"
                            onClick={() =>
                              setShowUploadModal &&
                              setShowUploadModal({
                                kontrakId: dataPenghuni.kontrak_id,
                                namaPenghuni: dataPenghuni.nama,
                              })
                            }
                            title="Upload Surat Bertanda Tangan (Signed)"
                            className="rounded-lg bg-blue-100 px-3 py-2 text-blue-700 transition hover:bg-blue-200 cursor-pointer"
                          >
                            <Upload size={17} />
                          </button>

                          {/* 3. TOMBOL IKON MATA -> Buka RiwayatSuratModal.jsx */}
                          <button
                            type="button"
                            onClick={() =>
                              setShowRiwayatModal &&
                              setShowRiwayatModal({
                                kontrakId: dataPenghuni.kontrak_id,
                                namaPenghuni: dataPenghuni.nama,
                                isKontrakAktif: true,
                              })
                            }
                            title="Riwayat Berkas Surat Kontrak"
                            className="rounded-lg bg-slate-100 px-3 py-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-800 cursor-pointer"
                          >
                            <Eye size={17} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* KOLOM AKSI DETAIL PENGHUNI */}
                    <td className="px-5 py-4">
                      {dataPenghuni ? (
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(dataPenghuni)}
                          title="Detail Penghuni"
                          className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-3 py-2 text-white transition hover:bg-slate-900 cursor-pointer"
                        >
                          <FileText size={17} />
                        </button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL RIWAYAT DEPOSIT TETAP DISINI */}
      {depositHistoryPenghuni && (
        <HistoryDeposit
          isOpen={true}
          onClose={() => setDepositHistoryPenghuni(null)}
          penghuni={depositHistoryPenghuni}
        />
      )}
    </>
  );
}