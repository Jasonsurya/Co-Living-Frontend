import { useState } from "react";
import {
  FileText,
  History,
  Eye,
  CheckCircle,
  ArrowRightCircle,
} from "lucide-react";

import HistoryDeposit from "../../penghuni/historyDeposit";
import RiwayatSuratModal from "../surat/RiwayatSuratModal";

export default function RiwayatPenghuni({
  penghuni = [],
  searchQuery,
  setSearchQuery,
  handleOpenDetail,
  setShowRiwayatModal, // Prop dari PenghuniPage jika ada
}) {
  const [depositHistoryPenghuni, setDepositHistoryPenghuni] = useState(null);
  const [riwayatSuratPenghuni, setRiwayatSuratPenghuni] = useState(null);

  // Safe filtering berdasarkan nama & nomor kamar
  const filteredData = Array.isArray(penghuni)
    ? penghuni.filter((item) => {
        const query = searchQuery ? searchQuery.toLowerCase() : "";
        const nama = item.nama ? item.nama.toLowerCase() : "";
        const nomorKamar = item.nomor_kamar
          ? item.nomor_kamar.toString().toLowerCase()
          : "";

        return nama.includes(query) || nomorKamar.includes(query);
      })
    : [];

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

  // Handler klik tombol mata
  const handleOpenRiwayatSurat = (dataPenghuni) => {
    const payload = {
      kontrakId: dataPenghuni.kontrak_id,
      penghuniId: dataPenghuni.penghuni_id || dataPenghuni.id,
      namaPenghuni: dataPenghuni.nama,
      isKontrakAktif: false, // PASTI FALSE KARENA DIBUKA DARI TAB RIWAYAT PENGHUNI
    };

    if (setShowRiwayatModal) {
      setShowRiwayatModal(payload);
    } else {
      setRiwayatSuratPenghuni(payload);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* SEARCH BAR */}
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Cari nama atau nomor kamar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-72 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-800 font-medium"
          />
        </div>

        {/* TABEL RIWAYAT */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-widest text-slate-800">
                  <th className="whitespace-nowrap px-6 py-4">No Kamar</th>
                  <th className="whitespace-nowrap px-6 py-4">Nama Penghuni</th>
                  <th className="whitespace-nowrap px-6 py-4">No. HP</th>
                  <th className="whitespace-nowrap px-6 py-4">Tanggal Masuk</th>
                  <th className="whitespace-nowrap px-6 py-4">Tanggal Keluar</th>
                  <th className="whitespace-nowrap px-6 py-4">Status Deposit</th>
                  <th className="whitespace-nowrap px-6 py-4">Laporan</th>
                  <th className="whitespace-nowrap px-6 py-4">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400 text-sm italic font-medium">
                      Riwayat penghuni tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((dataPenghuni, index) => {
                    const totalDepositAwal = Number(dataPenghuni?.deposit || 0);
                    const totalDenda = Number(dataPenghuni?.denda || 0);
                    const totalPengembalian = Number(dataPenghuni?.pengembalian || 0);
                    const hasDepositRecord = Boolean(dataPenghuni?.has_deposit_record);
                    const isDikembalikanExplicit = Boolean(dataPenghuni?.is_dikembalikan);

                    // Cek Apakah Deposit Diteruskan / Diperpanjang
                    const isTransferred = dataPenghuni?.status_deposit === "TRANSFERRED";

                    // Sisa Balans Deposit Setelah Dipotong Denda & Pengembalian
                    const netBalanceSebelumPengembalian = totalDepositAwal - totalDenda;
                    const sisaDeposit = Math.max(
                      netBalanceSebelumPengembalian - totalPengembalian,
                      0
                    );

                    // Deteksi Apakah Deposit Sudah Dikembalikan (Status Hijau)
                    const statusDikembalikan =
                      isDikembalikanExplicit ||
                      totalPengembalian > 0 ||
                      (hasDepositRecord &&
                        netBalanceSebelumPengembalian > 0 &&
                        sisaDeposit === 0);

                    return (
                      <tr
                        key={
                          dataPenghuni.kontrak_id ||
                          dataPenghuni.penghuni_id ||
                          index
                        }
                        className="transition-colors hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-700">
                          {dataPenghuni.nomor_kamar || "-"}
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-700">
                          {dataPenghuni.nama || "-"}
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-700">
                          {dataPenghuni?.no_hp || "-"}
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-700">
                          {formatTanggal(dataPenghuni?.tanggal_mulai)}
                        </td>

                        <td className="px-6 py-4 font-semibold text-rose-600">
                          {formatTanggal(dataPenghuni?.tanggal_keluar)}
                        </td>

                        {/* STATUS DEPOSIT / DENDA */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {isTransferred ? (
                              <div
                                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm"
                                title="Deposit dialihkan/diteruskan ke kontrak baru"
                              >
                                <ArrowRightCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                                <div className="flex flex-col text-center leading-tight">
                                  <span>Kontrak</span>
                                  <span>Diperpanjang</span>
                                </div>
                              </div>
                            ) : statusDikembalikan ? (
                              <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50/60 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
                                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                                <div className="flex flex-col text-center leading-tight">
                                  <span>Deposit</span>
                                  <span>Dikembalikan</span>
                                </div>
                              </div>
                            ) : sisaDeposit > 0 ? (
                              <>
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  Deposit
                                </span>
                                <span className="font-semibold text-slate-700">
                                  {formatRupiah(sisaDeposit)}
                                </span>
                              </>
                            ) : netBalanceSebelumPengembalian < 0 ? (
                              <>
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                  Denda
                                </span>
                                <span className="font-semibold text-amber-700">
                                  {formatRupiah(
                                    Math.abs(netBalanceSebelumPengembalian)
                                  )}
                                </span>
                              </>
                            ) : totalDepositAwal > 0 ? (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                Deposit Habis
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-400">
                                Tanpa Deposit
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
                        </td>

                        {/* LAPORAN SURAT */}
                        <td className="px-5 py-4">
                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={() => handleOpenRiwayatSurat(dataPenghuni)}
                              title="Lihat Riwayat Surat"
                              className="rounded-lg bg-slate-100 px-3 py-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-800 cursor-pointer"
                            >
                              <Eye size={17} />
                            </button>
                          </div>
                        </td>

                        {/* AKSI DETAIL */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(dataPenghuni)}
                            title="Detail Penghuni"
                            className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-3 py-2 text-white transition hover:bg-slate-900 cursor-pointer"
                          >
                            <FileText size={17} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL RIWAYAT DEPOSIT */}
      {depositHistoryPenghuni && (
        <HistoryDeposit
          isOpen={true}
          onClose={() => setDepositHistoryPenghuni(null)}
          penghuni={depositHistoryPenghuni}
        />
      )}

      {/* MODAL RIWAYAT SURAT LOKAL (PASTI isKontrakAktif={false}) */}
      {riwayatSuratPenghuni && (
        <RiwayatSuratModal
          isOpen={true}
          onClose={() => setRiwayatSuratPenghuni(null)}
          kontrakId={riwayatSuratPenghuni.kontrakId}
          penghuniId={riwayatSuratPenghuni.penghuniId}
          namaPenghuni={riwayatSuratPenghuni.namaPenghuni}
          isKontrakAktif={false} 
        />
      )}
    </>
  );
}