import { useEffect, useState } from "react";
import {
  X,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getSaldoDeposit,
  getRiwayatDeposit,
  getTransaksi,
} from "../../services/api";

export default function HistoryDeposit({ isOpen, onClose, penghuni }) {
  const [riwayatDeposit, setRiwayatDeposit] = useState([]);
  const [saldoDeposit, setSaldoDeposit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [halamanAktif, setHalamanAktif] = useState(0);

  useEffect(() => {
    if (!isOpen || !penghuni?.kontrak_id) {
      return;
    }

    const ambilDataDeposit = async () => {
      try {
        setLoading(true);
        setError(null);

        const kontrakId = penghuni.kontrak_id;

        // Ambil data saldo, riwayat_deposit, dan transaksi kas sekaligus
        const [dataSaldo, dataRiwayat, dataTransaksi] = await Promise.all([
          getSaldoDeposit(kontrakId),
          getRiwayatDeposit(kontrakId),
          getTransaksi(),
        ]);

        const listRiwayat = Array.isArray(dataRiwayat) ? dataRiwayat : [];
        const listTransaksi = Array.isArray(dataTransaksi) ? dataTransaksi : [];

        // Track transaksi_id yang sudah ada di riwayat_deposit agar tidak duplikat
        const usedTransaksiIds = new Set(
          listRiwayat
            .map((r) => r.transaksi_id)
            .filter((id) => id !== null && id !== undefined)
        );

        // Ambil denda tunai (Kode Akun 402) dari tabel transaksi yang belum ada di riwayat_deposit
        const dendaTunaiKas = listTransaksi
          .filter(
            (t) =>
              Number(t.kontrak_id) === Number(kontrakId) &&
              (String(t.kode) === "402" || String(t.akun_kode) === "402") &&
              !usedTransaksiIds.has(t.id)
          )
          .map((t) => ({
            id: `transaksi-denda-${t.id}`,
            kontrak_id: t.kontrak_id,
            jenis: "POTONGAN",
            jenis_potongan: "DENDA_TUNAI",
            nominal: Number(t.nominal || 0),
            keterangan: t.keterangan || "Denda dibayar tunai",
            created_at: t.created_at || t.tanggal,
            transaksi_id: t.id,
          }));

        // Gabungkan riwayat_deposit dan denda tunai dari transaksi kas
        const mergedList = [...listRiwayat, ...dendaTunaiKas];

        // Urutkan secara kronologis presisi (Dari transaksi paling awal ke paling baru)
        mergedList.sort((a, b) => {
          if (a.jenis === "DEPOSIT_AWAL") return -1;
          if (b.jenis === "DEPOSIT_AWAL") return 1;

          const getTime = (item) => {
            const dateVal = item.created_at || item.tanggal;
            if (!dateVal) return 0;
            const str = String(dateVal);
            // Format YYYY-MM-DD diberi jam 23:59:59 agar tidak mendahului jam pembuatan transaksi di hari yang sama
            if (str.length === 10) {
              return new Date(`${str}T23:59:59`).getTime();
            }
            return new Date(str).getTime();
          };

          const timeA = getTime(a);
          const timeB = getTime(b);

          if (timeA !== timeB) return timeA - timeB;

          // Tie-breaker ID jika tanggal persis sama
          const idA = Number(String(a.id || 0).replace(/\D/g, "")) || 0;
          const idB = Number(String(b.id || 0).replace(/\D/g, "")) || 0;
          return idA - idB;
        });

        setSaldoDeposit(Number(dataSaldo?.saldo || 0));
        setRiwayatDeposit(mergedList);
        setHalamanAktif(0);
      } catch (err) {
        console.error("Gagal mengambil data deposit:", err);
        setError("Gagal mengambil data riwayat deposit");
      } finally {
        setLoading(false);
      }
    };

    ambilDataDeposit();
  }, [isOpen, penghuni?.kontrak_id]);

  if (!isOpen || !penghuni) {
    return null;
  }

  const formatRupiah = (nominal) => {
    return `Rp ${Number(nominal || 0).toLocaleString("id-ID")}`;
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const hasilTanggal = new Date(tanggal);
    if (Number.isNaN(hasilTanggal.getTime())) return "-";

    return hasilTanggal.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // REKAP SALDO KRONOLOGIS BERSAMBUNG LURUS (PAGE 1 -> PAGE TERAKHIR)
  const riwayatDenganProses = riwayatDeposit.reduce((hasil, item) => {
    const riwayatSebelumnya =
      hasil.length > 0 ? hasil[hasil.length - 1] : null;

    const saldoSebelumnya = riwayatSebelumnya?.saldoSetelah ?? 0;

    const isDepositAwal = item.jenis === "DEPOSIT_AWAL";
    const isPengembalian = item.jenis === "PENGEMBALIAN";
    const isPotongan = item.jenis === "POTONGAN";
    const isDendaTunai = item.jenis_potongan === "DENDA_TUNAI";
    const isDendaPotongan = isPotongan && item.jenis_potongan === "DENDA";
    const isDenda = isDendaPotongan || isDendaTunai;

    const nominalAngka = Number(item.nominal || 0);

    // Denda Tunai tidak memotong saldo deposit (karena dibayar tunai / deposit sudah Rp 0)
    const potonganDeposit = isDendaTunai ? 0 : nominalAngka;
    const dendaTunaiNominal = isDendaTunai ? nominalAngka : 0;

    let perubahan = 0;
    if (isDepositAwal) {
      perubahan = potonganDeposit;
    } else if (isPotongan || isPengembalian) {
      perubahan = -potonganDeposit;
    }

    const saldoSetelah = Math.max(saldoSebelumnya + perubahan, 0);

    return [
      ...hasil,
      {
        ...item,
        saldoSebelumnya,
        perubahan,
        saldoSetelah,
        isDepositAwal,
        isPengembalian,
        isPotongan,
        isDenda,
        isDendaTunai,
        potonganDeposit,
        dendaTunaiNominal,
      },
    ];
  }, []);

  const depositAwal = riwayatDenganProses
    .filter((item) => item.isDepositAwal)
    .reduce((sum, item) => sum + Number(item.potonganDeposit || 0), 0);

  const totalPotonganDeposit = riwayatDenganProses.reduce((sum, item) => {
    return item.isPotongan && !item.isDendaTunai
      ? sum + item.potonganDeposit
      : sum;
  }, 0);

  const totalDendaTunaiTransaksi = riwayatDenganProses.reduce((sum, item) => {
    return item.isDendaTunai ? sum + item.dendaTunaiNominal : sum;
  }, 0);

  const totalDenda = totalPotonganDeposit + totalDendaTunaiTransaksi;
  const sisaDeposit = Number(saldoDeposit || 0);
  const depositHabis = sisaDeposit <= 0;

  const totalHalaman = riwayatDenganProses.length;
  const currentItem = riwayatDenganProses[halamanAktif];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border-2 border-slate-300">
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 px-6 py-4 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Riwayat Deposit & Denda
            </h2>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">
              {penghuni.nama}{" "}
              {penghuni.nomor_kamar ? `(Kamar ${penghuni.nomor_kamar})` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Tutup"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5 space-y-5">
          {loading && (
            <div className="py-12 text-center text-sm font-medium text-slate-500">
              Memuat riwayat deposit...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-200">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* RINGKASAN DEPOSIT */}
              <div className="rounded-xl border-2 border-slate-300 bg-slate-50/80 p-4 shadow-sm space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-200 pb-1.5">
                  Ringkasan Deposit Penghuni
                </p>

                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600">Deposit Awal</span>
                  <span className="font-bold text-slate-800">
                    {formatRupiah(depositAwal)}
                  </span>
                </div>

                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600">Total Akumulasi Denda</span>
                  <span className="font-bold text-amber-700">
                    {formatRupiah(totalDenda)}
                  </span>
                </div>

                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600">Dipotong dari Deposit</span>
                  <span className="font-bold text-red-600">
                    {formatRupiah(totalPotonganDeposit)}
                  </span>
                </div>

                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600">Denda Dibayar Tunai</span>
                  <span className="font-bold text-emerald-700">
                    {formatRupiah(totalDendaTunaiTransaksi)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t-2 border-slate-200 pt-2.5">
                  <div className="flex items-center gap-1.5">
                    {depositHabis ? (
                      <CircleAlert size={16} className="text-red-600" />
                    ) : (
                      <CheckCircle2 size={16} className="text-blue-600" />
                    )}
                    <span className="text-xs font-bold text-slate-800">
                      {depositHabis ? "Deposit Habis" : "Sisa Saldo Deposit"}
                    </span>
                  </div>

                  <span
                    className={`text-sm font-extrabold ${
                      depositHabis ? "text-red-600" : "text-blue-700"
                    }`}
                  >
                    {formatRupiah(sisaDeposit)}
                  </span>
                </div>
              </div>

              {totalHalaman === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <Wallet size={32} className="mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-500">
                    Belum ada catatan riwayat deposit
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* PAGINATION */}
                  <div className="flex items-center justify-between bg-slate-100 p-2 rounded-xl border border-slate-300">
                    <button
                      type="button"
                      disabled={halamanAktif === 0}
                      onClick={() => setHalamanAktif((prev) => prev - 1)}
                      className="p-1.5 rounded-lg text-slate-700 hover:bg-white disabled:opacity-30 transition cursor-pointer"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <span className="text-xs font-bold text-slate-700">
                      Transaksi {halamanAktif + 1} dari {totalHalaman}
                    </span>

                    <button
                      type="button"
                      disabled={halamanAktif === totalHalaman - 1}
                      onClick={() => setHalamanAktif((prev) => prev + 1)}
                      className="p-1.5 rounded-lg text-slate-700 hover:bg-white disabled:opacity-30 transition cursor-pointer"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* KARTU TRANSAKSI AKTIF */}
                  {currentItem && (
                    <div className="rounded-xl border-2 border-slate-300 p-4 bg-white space-y-3 shadow-sm">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              currentItem.isDenda
                                ? "bg-amber-100 text-amber-700"
                                : currentItem.isPengembalian
                                ? "bg-slate-100 text-slate-700"
                                : currentItem.isDepositAwal
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {currentItem.isDenda ? (
                              <AlertTriangle size={16} />
                            ) : currentItem.isDepositAwal ? (
                              <Wallet size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )}
                          </div>

                          <span className="text-xs font-bold uppercase tracking-wide text-slate-800">
                            {currentItem.isDendaTunai
                              ? "Denda Dibayar Tunai"
                              : currentItem.isDenda
                              ? "Denda (Potong Deposit)"
                              : currentItem.isPengembalian
                              ? "Pengembalian Deposit"
                              : currentItem.isDepositAwal
                              ? "Deposit Awal"
                              : "Potongan Deposit"}
                          </span>
                        </div>

                        <span
                          className={`text-sm font-extrabold ${
                            currentItem.isDenda
                              ? "text-amber-700"
                              : currentItem.isDepositAwal
                              ? "text-blue-700"
                              : "text-red-600"
                          }`}
                        >
                          {currentItem.isDepositAwal ? "+" : "-"}
                          {formatRupiah(currentItem.nominal)}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-slate-600">
                        {currentItem.keterangan || "Tidak ada keterangan."}
                      </p>

                      <div className="rounded-xl border border-slate-300 bg-slate-50 p-3 space-y-2 text-xs font-medium">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Proses Perubahan Saldo Deposit
                        </p>

                        <div className="flex justify-between">
                          <span className="text-slate-500">Saldo Sebelum</span>
                          <span className="text-slate-700 font-semibold">
                            {formatRupiah(currentItem.saldoSebelumnya)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Perubahan Saldo</span>
                          <span
                            className={`font-bold flex items-center gap-0.5 ${
                              currentItem.perubahan > 0
                                ? "text-emerald-600"
                                : currentItem.perubahan < 0
                                ? "text-red-600"
                                : "text-slate-500"
                            }`}
                          >
                            {currentItem.perubahan > 0 && <ArrowUp size={12} />}
                            {currentItem.perubahan < 0 && (
                              <ArrowDown size={12} />
                            )}
                            {formatRupiah(Math.abs(currentItem.perubahan))}
                          </span>
                        </div>

                        <div className="border-t border-slate-200 pt-1 flex justify-between">
                          <span className="font-bold text-slate-700">
                            Saldo Setelah
                          </span>
                          <span
                            className={`font-extrabold ${
                              currentItem.saldoSetelah <= 0
                                ? "text-red-600"
                                : "text-blue-700"
                            }`}
                          >
                            {formatRupiah(currentItem.saldoSetelah)}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] font-medium text-slate-400 text-right">
                        Tanggal: {formatTanggal(currentItem.created_at)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t-2 border-slate-200 bg-slate-50 px-6 py-3 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white transition hover:bg-slate-900 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}