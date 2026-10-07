import { useEffect, useState, useCallback } from "react";
import ModalTransaksi from "../ModalTransaksi/ModalTransaksi";
import ModalKonfirmasiHapus from "../ModalTransaksi/ModalKonfirmasiHapus";
import MonthYearPicker from "../../penghuni/MonthYearPicker";
import {
  getTransaksi,
  hapusTransaksi,
} from "../../../services/api";

// URL dasar folder penyimpanan file upload dari backend
const API_UPLOADS_URL = "http://localhost:5000/uploads";

// Helper fungsi untuk membentuk URL foto bukti yang valid
const getImageUrl = (filename) => {
  if (!filename) return "";
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  
  const cleanPath = String(filename).trim().replace(/^\/+/, "");

  // Jika di database sudah ada prefix 'uploads/'
  if (cleanPath.startsWith("uploads/")) {
    return `http://localhost:5000/${cleanPath}`;
  }
  // Jika di database sudah ada prefix 'bukti/'
  if (cleanPath.startsWith("bukti/")) {
    return `${API_UPLOADS_URL}/${cleanPath}`;
  }

  // Jika di database hanya nama file saja (misal: "bukti-123.jpg")
  return `${API_UPLOADS_URL}/bukti/${cleanPath}`;
};

const KODE_OPTIONS = [
  { kode: "201", label: "201 - Deposit Awal" },
  { kode: "202", label: "202 - Pengembalian Deposit" },

  { kode: "401", label: "401 - Pendapatan Sewa Kamar" },
  { kode: "402", label: "402 - Denda" },
  { kode: "403", label: "403 - Transaksi Lainnya" },

  { kode: "501", label: "501 - Biaya Listrik" },
  { kode: "502", label: "502 - Biaya Internet" },
  { kode: "503", label: "503 - Gaji Karyawan" },
  { kode: "504", label: "504 - Biaya Kebersihan" },
  { kode: "505", label: "505 - Biaya Perbaikan" },
  { kode: "506", label: "506 - ATK" },
  { kode: "507", label: "507 - Pengeluaran Lain" },
];

const getArahKas = (item) => {
  return String(item.arah_kas ?? "").toUpperCase();
};

const isPemasukan = (item) => {
  return getArahKas(item) === "MASUK";
};

const isPengeluaran = (item) => {
  return getArahKas(item) === "KELUAR";
};

const getKode = (item) => {
  return String(item.kode ?? "");
};

const getNominal = (item) => {
  return Number(item.nominal) || 0;
};

const getTanggal = (item) => {
  return String(item.tanggal ?? "").slice(0, 10);
};

const formatRupiah = (angka) => {
  return `Rp ${Number(angka || 0).toLocaleString("id-ID")}`;
};

export default function KasHarian({ onTransaksiSuccess }) {
  const [transaksiList, setTransaksiList] = useState([]);
  const [filterTransaksi, setFilterTransaksi] = useState("Semua");
  const [filterBulan, setFilterBulan] = useState(new Date().getMonth() + 1);
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear());
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedKodes, setSelectedKodes] = useState([]);
  const [tempSelectedKodes, setTempSelectedKodes] = useState([]);
  const [isKodeDropdownOpen, setIsKodeDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // State khusus untuk Modal Preview Bukti Foto
  const [isBuktiModalOpen, setIsBuktiModalOpen] = useState(false);
  const [selectedBuktiFiles, setSelectedBuktiFiles] = useState([]);
  const [activeBuktiIndex, setActiveBuktiIndex] = useState(0);

  const loadTransaksi = useCallback(async () => {
    try {
      const data = await getTransaksi();
      setTransaksiList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
      setTransaksiList([]);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await getTransaksi();
        if (isMounted) {
          setTransaksiList(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Gagal mengambil data transaksi:", error);
        if (isMounted) {
          setTransaksiList([]);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveTransaksi = async () => {
    await loadTransaksi();
    setIsModalOpen(false);
    
    // TRIGGER REFRESH KE PARENT (KeuanganPage)
    if (onTransaksiSuccess) {
      onTransaksiSuccess();
    }
  };

  const handleOpenDelete = (item) => {
    setSelectedTransaction(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTransaction) return;

    try {
      await hapusTransaksi(selectedTransaction.id);
      await loadTransaksi();
      setIsDeleteModalOpen(false);
      setSelectedTransaction(null);

      // TRIGGER REFRESH KE PARENT (KeuanganPage) SETELAH HAPUS
      if (onTransaksiSuccess) {
        onTransaksiSuccess();
      }
    } catch (error) {
      console.error("Gagal menghapus transaksi:", error);
      alert(error.message || "Transaksi gagal dihapus.");
    }
  };

  // Fungsi membuka Modal Bukti Foto
  const handleOpenBukti = (buktiData) => {
    if (!buktiData) return;

    let files = [];
    if (Array.isArray(buktiData)) {
      files = buktiData;
    } else if (typeof buktiData === "string") {
      try {
        const parsed = JSON.parse(buktiData);
        files = Array.isArray(parsed) ? parsed : [buktiData];
      } catch {
        // Jika berupa string terpisah koma (contoh: "foto1.jpg,foto2.png")
        files = buktiData.split(",").map((f) => f.trim()).filter(Boolean);
      }
    }

    setSelectedBuktiFiles(files);
    setActiveBuktiIndex(0);
    setIsBuktiModalOpen(true);
  };

  const handleMonthYearChange = ({ month, year }) => {
    setFilterBulan(month + 1);
    setFilterTahun(year);
  };

  const openKodeDropdown = () => {
    setTempSelectedKodes(selectedKodes);
    setIsKodeDropdownOpen(true);
  };

  const handleToggleKode = (kode) => {
    setTempSelectedKodes((prev) =>
      prev.includes(kode)
        ? prev.filter((item) => item !== kode)
        : [...prev, kode]
    );
  };

  const handleSelectAll = () => {
    const semuaKode = KODE_OPTIONS.map((item) => item.kode);
    setSelectedKodes(semuaKode);
    setTempSelectedKodes(semuaKode);
  };

  const handleReset = () => {
    setTempSelectedKodes([]);
  };

  const handleApplyFilter = () => {
    setSelectedKodes(tempSelectedKodes);
    setIsKodeDropdownOpen(false);
  };

  const filteredTransaksi = transaksiList.filter((item) => {
    const kode = getKode(item);
    const keyword = searchKeyword.trim().toLowerCase();
    const tanggal = getTanggal(item);
    const [tahun, bulan] = tanggal.split("-").map(Number);

    let matchesTipe = true;
    if (filterTransaksi === "Pemasukan") {
      matchesTipe = isPemasukan(item);
    }
    if (filterTransaksi === "Pengeluaran") {
      matchesTipe = isPengeluaran(item);
    }

    const matchesSearch =
      kode.toLowerCase().includes(keyword) ||
      String(item.kategori ?? "").toLowerCase().includes(keyword) ||
      String(item.keterangan ?? "").toLowerCase().includes(keyword) ||
      String(item.nama_penghuni ?? "").toLowerCase().includes(keyword) ||
      String(item.nomor_kamar ?? "").toLowerCase().includes(keyword);

    const matchesBulan = filterBulan === 0 || bulan === Number(filterBulan);
    const matchesTahun = filterTahun === 0 || tahun === Number(filterTahun);
    const matchesKode =
      selectedKodes.length === 0 || selectedKodes.includes(kode);

    return (
      matchesTipe &&
      matchesSearch &&
      matchesBulan &&
      matchesTahun &&
      matchesKode
    );
  });

  return (
    <>
      <div className="bg-white border border-slate-300 rounded-xl p-4 mb-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex gap-2">
            {["Semua", "Pemasukan", "Pengeluaran"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setFilterTransaksi(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                  filterTransaksi === filter
                    ? filter === "Pemasukan"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : filter === "Pengeluaran"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-slate-900 text-white shadow-xs"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-xs cursor-pointer"
          >
            + Transaksi
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-4 items-center justify-between">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Cari kode, kategori, keterangan, atau penghuni..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center justify-end">
            <div className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={openKodeDropdown}
                className="w-full sm:w-auto flex items-center justify-between gap-3 px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-filter text-slate-500" />
                  <span>
                    {selectedKodes.length === 0
                      ? "Semua Kode"
                      : `${selectedKodes.length} Kode Terpilih`}
                  </span>
                </div>
                <i
                  className={`fas fa-chevron-down text-xs transition-transform ${
                    isKodeDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isKodeDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsKodeDropdownOpen(false)}
                  />

                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 p-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900 tracking-wider">
                        KODE AKUN
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          Semua
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="text-slate-500 hover:text-slate-700 cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto my-3 pr-1 grid grid-cols-1 gap-2">
                      {KODE_OPTIONS.map((item) => {
                        const isChecked = tempSelectedKodes.includes(item.kode);
                        return (
                          <label
                            key={item.kode}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer select-none ${
                              isChecked
                                ? "border-blue-200 bg-blue-50/50 text-blue-900"
                                : "border-slate-100 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleKode(item.kode)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span>{item.label}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsKodeDropdownOpen(false)}
                        className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyFilter}
                        className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
                      >
                        Pilih
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <MonthYearPicker onChange={handleMonthYearChange} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-275 w-full text-sm">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                <th className="px-6 py-4 text-left">Tanggal</th>
                <th className="px-4 py-4 text-left">Kode</th>
                <th className="px-6 py-4 text-left">Kategori</th>
                <th className="px-6 py-4 text-left">Keterangan</th>
                <th className="px-6 py-4 text-right">Nominal</th>
                <th className="px-6 py-4 text-center">Bukti</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredTransaksi.length > 0 ? (
                filteredTransaksi.map((item) => {
                  const pemasukan = isPemasukan(item);
                  const nominal = getNominal(item);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {getTanggal(item)}
                      </td>

                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-800 border border-slate-300 px-2 py-1 rounded-md text-xs font-bold">
                          {getKode(item)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-800 font-medium whitespace-nowrap">
                        {item.kategori}
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {item.keterangan}
                      </td>

                      <td
                        className={`px-6 py-4 text-right font-bold whitespace-nowrap ${
                          pemasukan ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-lg font-bold">
                            {pemasukan ? "+" : "-"}
                          </span>
                          <span>{formatRupiah(nominal)}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        {item.bukti ? (
                          <button
                            type="button"
                            onClick={() => handleOpenBukti(item.bukti)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition text-xs font-bold cursor-pointer"
                          >
                            <i className="fas fa-image" />
                            Lihat
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Tidak ada
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(item)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition text-xs font-bold cursor-pointer"
                        >
                          <i className="fas fa-trash" />
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-8 text-slate-400 font-medium"
                  >
                    Tidak ada data transaksi yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Preview Bukti Foto */}
      {isBuktiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <i className="fas fa-image text-sky-600" />
                Bukti Transaksi ({selectedBuktiFiles.length} File)
              </h3>
              <button
                type="button"
                onClick={() => setIsBuktiModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                <i className="fas fa-times text-lg" />
              </button>
            </div>

            {/* Gambar Utama */}
            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-900/5 rounded-xl p-3 min-h-64 border border-slate-100">
              {selectedBuktiFiles.length > 0 && selectedBuktiFiles[activeBuktiIndex] ? (
                <img
                  src={getImageUrl(selectedBuktiFiles[activeBuktiIndex])}
                  alt={`Bukti Transaksi ${activeBuktiIndex + 1}`}
                  className="max-h-[55vh] max-w-full object-contain rounded-lg shadow-xs"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400?text=Foto+Tidak+Ditemukan";
                  }}
                />
              ) : (
                <p className="text-sm text-slate-400">Bukti foto tidak ditemukan.</p>
              )}
            </div>

            {/* Thumbnails Foto Jika Banyak File */}
            {selectedBuktiFiles.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1">
                {selectedBuktiFiles.map((file, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveBuktiIndex(idx)}
                    className={`relative rounded-xl overflow-hidden border-2 shrink-0 w-16 h-16 transition cursor-pointer ${
                      activeBuktiIndex === idx
                        ? "border-sky-600 ring-2 ring-sky-200"
                        : "border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={getImageUrl(file)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/100x100?text=Error";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Aksi Buka Tab Baru & Tutup */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              {selectedBuktiFiles[activeBuktiIndex] ? (
                <a
                  href={getImageUrl(selectedBuktiFiles[activeBuktiIndex])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1.5 transition"
                >
                  <i className="fas fa-external-link-alt" />
                  Buka Ukuran Penuh
                </a>
              ) : <div />}

              <button
                type="button"
                onClick={() => setIsBuktiModalOpen(false)}
                className="px-5 py-2.5 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalTransaksi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaksi}
      />

      <ModalKonfirmasiHapus
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTransaction(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Transaksi?"
        message="Transaksi yang dihapus tidak dapat dikembalikan."
      />
    </>
  );
}