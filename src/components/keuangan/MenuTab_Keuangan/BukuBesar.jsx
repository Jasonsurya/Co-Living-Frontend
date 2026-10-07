import { useEffect, useState } from "react";
import { getTransaksi } from "../../../services/api";

const masterAkun = [
  { kode: "401", nama: "Pendapatan Sewa Kamar" },
  { kode: "402", nama: "Denda" },
  { kode: "403", nama: "Transaksi Lainnya (Masuk)" },
  { kode: "501", nama: "Biaya Listrik" },
  { kode: "502", nama: "Biaya Internet" },
  { kode: "503", nama: "Gaji Karyawan" },
  { kode: "504", nama: "Biaya Kebersihan" },
  { kode: "505", nama: "Biaya Perbaikan" },
  { kode: "506", nama: "ATK" },
  { kode: "507", nama: "Pengeluaran Lain" },
];

const namaBulan = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function BukuBesar({ bulan, tahun }) {
  const [transaksiList, setTransaksiList] = useState([]);
  const [selectedKodes, setSelectedKodes] = useState([]);
  const [tempSelectedKodes, setTempSelectedKodes] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchTransaksi = async () => {
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

    fetchTransaksi();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTempKode = (kode) => {
    setTempSelectedKodes((prev) =>
      prev.includes(kode) ? prev.filter((k) => k !== kode) : [...prev, kode]
    );
  };

  const handleOpenFilter = () => {
    setTempSelectedKodes([...selectedKodes]);
    setIsFilterOpen(true);
  };

  const handleApplyFilter = () => {
    setSelectedKodes([...tempSelectedKodes]);
    setIsFilterOpen(false);
  };

  const handleCancelFilter = () => {
    setTempSelectedKodes([...selectedKodes]);
    setIsFilterOpen(false);
  };

  const handleSelectAll = () => {
    setTempSelectedKodes(masterAkun.map((a) => a.kode));
  };

  const handleClearAll = () => {
    setTempSelectedKodes([]);
  };

  const filteredAkun = masterAkun
    .filter(
      (akun) =>
        selectedKodes.length === 0 || selectedKodes.includes(akun.kode)
    )
    .map((akun) => {
      const transaksiAkun = transaksiList
        .filter((item) => String(item.kode) === akun.kode)
        .filter((item) => item.jenis_transaksi === "OPERASIONAL")
        .filter((item) => {
          if (!item.tanggal) return false;
          const itemDate = new Date(item.tanggal);
          return (
            itemDate.getMonth() + 1 === bulan &&
            itemDate.getFullYear() === tahun
          );
        });

      return {
        ...akun,
        transaksi: transaksiAkun.map((item) => ({
          tanggal: String(item.tanggal ?? "").slice(0, 10),
          keterangan:
            item.keterangan ||
            item.nomor_kamar ||
            "-",
          masuk:
            item.arah_kas === "MASUK"
              ? Number(item.nominal)
              : 0,
          keluar:
            item.arah_kas === "KELUAR"
              ? Number(item.nominal)
              : 0,
        })),
      };
    });

  const formatRupiah = (nominal) => {
    if (!nominal) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(nominal);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-900">
          {namaBulan[bulan - 1]} {tahun}
        </h3>

        <div className="relative">
          <button
            type="button"
            onClick={handleOpenFilter}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs cursor-pointer"
          >
            <i className="fas fa-filter text-slate-500" />
            <span>Filter Akun</span>
            {selectedKodes.length > 0 && (
              <span className="ml-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {selectedKodes.length}
              </span>
            )}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-4 animate-fadeIn">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Kode Akun
                </span>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Semua
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-slate-500 hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="max-h-52 overflow-y-auto pr-1 grid grid-cols-2 gap-2 custom-scrollbar">
                {masterAkun.map((akun) => (
                  <label
                    key={akun.kode}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 border border-slate-100 cursor-pointer text-xs font-bold text-slate-800 transition"
                  >
                    <input
                      type="checkbox"
                      checked={tempSelectedKodes.includes(akun.kode)}
                      onChange={() => toggleTempKode(akun.kode)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>{akun.kode}</span>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCancelFilter}
                  className="w-full py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  className="w-full py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition shadow-xs cursor-pointer"
                >
                  Pilih
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8 min-h-75">
        {filteredAkun.length > 0 ? (
          filteredAkun.map((akun) => {
            const totalMasuk = akun.transaksi.reduce((total, item) => total + item.masuk, 0);
            const totalKeluar = akun.transaksi.reduce((total, item) => total + item.keluar, 0);

            return (
              <div key={akun.kode} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900">
                    Akun {akun.kode} - {akun.nama}
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white border-b border-slate-200 text-slate-600">
                        <th className="px-5 py-3 text-left font-semibold">Tanggal</th>
                        <th className="px-5 py-3 text-left font-semibold">Kode</th>
                        <th className="px-5 py-3 text-left font-semibold">Keterangan</th>
                        <th className="px-5 py-3 text-right font-semibold">Uang Masuk</th>
                        <th className="px-5 py-3 text-right font-semibold">Uang Keluar</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {akun.transaksi.length > 0 ? (
                        akun.transaksi.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3 text-slate-700">{item.tanggal}</td>
                            <td className="px-5 py-3 font-semibold text-slate-700">{akun.kode}</td>
                            <td className="px-5 py-3 text-slate-700">{item.keterangan}</td>
                            <td className="px-5 py-3 text-right font-medium text-emerald-600">
                              {formatRupiah(item.masuk)}
                            </td>
                            <td className="px-5 py-3 text-right font-medium text-rose-600">
                              {formatRupiah(item.keluar)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-5 py-5 text-center text-slate-400">
                            -
                          </td>
                        </tr>
                      )}
                    </tbody>

                    {akun.transaksi.length > 0 && (
                      <tfoot>
                        <tr className="bg-slate-50 border-t border-slate-200">
                          <td colSpan="3" className="px-5 py-3 text-right font-bold text-slate-700">
                            Total
                          </td>
                          <td className="px-5 py-3 text-right font-bold text-emerald-600">
                            {formatRupiah(totalMasuk)}
                          </td>
                          <td className="px-5 py-3 text-right font-bold text-rose-600">
                            {formatRupiah(totalKeluar)}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-400">
            Tidak ada data akun yang sesuai dengan filter.
          </div>
        )}
      </div>
    </div>
  );
}