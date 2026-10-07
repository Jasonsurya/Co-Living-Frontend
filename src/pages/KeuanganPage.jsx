import { useEffect, useMemo, useState, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import MonthYearPicker from "../components/penghuni/MonthYearPicker";
import KasHarian from "../components/keuangan/MenuTab_Keuangan/KasHarian";
import BukuBesar from "../components/keuangan/MenuTab_Keuangan/BukuBesar";
import { getTransaksi } from "../services/api";

const formatRupiah = (value) => {
  const angka = Number(value) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
};

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

export default function KeuanganPage() {
  const [tabAktif, setTabAktif] = useState("kas");
  const [rekapBulan, setRekapBulan] = useState(new Date().getMonth() + 1);
  const [rekapTahun, setRekapTahun] = useState(new Date().getFullYear());
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);

  // STATE REFRESH TRIGGER
  const [refreshVersion, setRefreshVersion] = useState(0);

  // Callback function untuk merefresh data transaksi di parent
  const triggerRefresh = useCallback(() => {
    setRefreshVersion((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchTransaksiData = async () => {
      try {
        setLoading(true);
        const data = await getTransaksi();
        if (isMounted) {
          setTransaksiList(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Gagal mengambil data transaksi:", error);
        if (isMounted) {
          setTransaksiList([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTransaksiData();

    return () => {
      isMounted = false;
    };
  }, [refreshVersion]); // Dijalankan ulang setiap kali refreshVersion berubah

  const handleRekapMonthYearChange = ({ month, year }) => {
    setRekapBulan(month + 1);
    setRekapTahun(year);
  };

  const transaksiBulanPilihan = useMemo(() => {
    return transaksiList.filter((item) => {
      if (!item.tanggal) return false;
      const tgl = new Date(item.tanggal);
      return (
        tgl.getMonth() + 1 === rekapBulan &&
        tgl.getFullYear() === rekapTahun &&
        item.jenis_transaksi === "OPERASIONAL"
      );
    });
  }, [transaksiList, rekapBulan, rekapTahun]);

  const totalPendapatan = useMemo(() => {
    return transaksiBulanPilihan
      .filter((item) => item.arah_kas === "MASUK")
      .reduce((total, item) => total + (Number(item.nominal) || 0), 0);
  }, [transaksiBulanPilihan]);

  const totalPengeluaran = useMemo(() => {
    return transaksiBulanPilihan
      .filter((item) => item.arah_kas === "KELUAR")
      .reduce((total, item) => total + (Number(item.nominal) || 0), 0);
  }, [transaksiBulanPilihan]);

  const estimasiBersih = totalPendapatan - totalPengeluaran;

  const hitungTotalByKode = (kodeTarget, arahKas) => {
    return transaksiBulanPilihan
      .filter(
        (item) =>
          String(item.kode) === String(kodeTarget) &&
          item.arah_kas === arahKas
      )
      .reduce(
        (total, item) => total + (Number(item.nominal) || 0),
        0
      );
  };

  const daftarPendapatan = [
    {
      nama: "Pendapatan Sewa Kamar (401)",
      nominal: hitungTotalByKode("401", "MASUK"),
    },
    {
      nama: "Denda (402)",
      nominal: hitungTotalByKode("402", "MASUK"),
    },
    {
      nama: "Transaksi Lainnya Masuk (403)",
      nominal: hitungTotalByKode("403", "MASUK"),
    },
  ];

  const daftarPengeluaran = [
    {
      nama: "Biaya Listrik (501)",
      nominal: hitungTotalByKode("501", "KELUAR"),
    },
    {
      nama: "Biaya Internet (502)",
      nominal: hitungTotalByKode("502", "KELUAR"),
    },
    {
      nama: "Gaji Karyawan (503)",
      nominal: hitungTotalByKode("503", "KELUAR"),
    },
    {
      nama: "Biaya Kebersihan (504)",
      nominal: hitungTotalByKode("504", "KELUAR"),
    },
    {
      nama: "Biaya Perbaikan (505)",
      nominal: hitungTotalByKode("505", "KELUAR"),
    },
    {
      nama: "ATK (506)",
      nominal: hitungTotalByKode("506", "KELUAR"),
    },
    {
      nama: "Transaksi Lainnya Keluar (507)",
      nominal: hitungTotalByKode("507", "KELUAR"),
    },
  ];

  return (
    <MainLayout
      title="Akuntansi & Keuangan"
      description="Kelola pencatatan kas harian dan buku besar operasional"
    >
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-xs mb-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Rekap Bulanan — {namaBulan[rekapBulan - 1]} {rekapTahun}
            </h2>
            <p className="text-xs text-slate-500">
              Ringkasan akumulasi saldo pendapatan dan pengeluaran operasional.
            </p>
          </div>
          <MonthYearPicker onChange={handleRekapMonthYearChange} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-linear-to-br from-emerald-100 via-emerald-50 to-teal-50 border border-emerald-300 shadow-xs">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Total Pendapatan
            </span>
            <p className="text-2xl font-black text-emerald-700 mt-1">
              {loading ? "..." : formatRupiah(totalPendapatan)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-linear-to-br from-rose-100 via-rose-50 to-pink-50 border border-rose-300 shadow-xs">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Total Pengeluaran
            </span>
            <p className="text-2xl font-black text-rose-700 mt-1">
              {loading ? "..." : formatRupiah(totalPengeluaran)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-linear-to-br from-slate-200 via-slate-100 to-slate-50 border border-slate-300 shadow-xs">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Estimasi Bersih
            </span>
            <p
              className={`text-2xl font-black mt-1 ${
                estimasiBersih >= 0 ? "text-slate-900" : "text-rose-700"
              }`}
            >
              {loading ? "..." : formatRupiah(estimasiBersih)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="border border-slate-300 rounded-xl overflow-hidden h-fit shadow-xs">
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pendapatan
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-200 text-emerald-800 border border-emerald-300">
                3 Akun
              </span>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-200">
                {daftarPendapatan.map((item) => (
                  <tr key={item.nama} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-700">{item.nama}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {item.nominal > 0 ? formatRupiah(item.nominal) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border border-slate-300 rounded-xl overflow-hidden h-fit shadow-xs">
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pengeluaran
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-rose-200 text-rose-800 border border-rose-300">
                7 Akun
              </span>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-200">
                {daftarPengeluaran.map((item) => (
                  <tr key={item.nama} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-700">{item.nama}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {item.nominal > 0 ? formatRupiah(item.nominal) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-300 mb-6">
        <button
          type="button"
          onClick={() => setTabAktif("kas")}
          className={`px-6 py-3 font-semibold border-b-2 transition cursor-pointer ${
            tabAktif === "kas"
              ? "text-slate-900 border-slate-900"
              : "text-slate-500 border-transparent hover:text-slate-900"
          }`}
        >
          Kas Harian
        </button>

        <button
          type="button"
          onClick={() => setTabAktif("buku")}
          className={`px-6 py-3 font-semibold border-b-2 transition cursor-pointer ${
            tabAktif === "buku"
              ? "text-slate-900 border-slate-900"
              : "text-slate-500 border-transparent hover:text-slate-900"
          }`}
        >
          Buku Besar
        </button>
      </div>

      {tabAktif === "kas" && <KasHarian onTransaksiSuccess={triggerRefresh} />}
      {tabAktif === "buku" && (
        <BukuBesar
          bulan={rekapBulan}
          tahun={rekapTahun}
          refreshKey={refreshVersion}
        />
      )}
    </MainLayout>
  );
}