import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  getKamar,
  getPenghuniAktif,
  getTransaksi,
  getDataSewaAktif,
} from "../services/api";
import {
  BedDouble,
  DoorOpen,
  DoorClosed,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const formatRupiah = (nominal) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(nominal) || 0);
};

const formatTanggal = (tanggal) => {
  if (!tanggal) return null;
  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) {
    return tanggal;
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const isKamarTerisi = (kamar) => {
  const status = String(kamar.status ?? "").toUpperCase();
  return status === "OCCUPIED" || status === "TERISI";
};

const isKamarKosong = (kamar) => {
  const status = String(kamar.status ?? "").toUpperCase();
  return status === "EMPTY" || status === "KOSONG";
};

function RoomSummaryCard({ title, value, description, icon, iconClass }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
          <p className="text-xs text-slate-400 mt-2">{description}</p>
        </div>
        <div className={`p-3 rounded-xl ${iconClass}`}>{icon}</div>
      </div>
    </div>
  );
}

function FinanceCard({ title, value, icon, iconClass, valueClass }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <h3 className={`text-xl font-bold mt-2 ${valueClass}`}>
            {formatRupiah(value)}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${iconClass}`}>{icon}</div>
      </div>
    </div>
  );
}

function StatusCard({ title, value, background }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-300 shadow-sm">
      <div className={`${background} text-white text-center font-bold py-2 text-sm`}>
        {title}
      </div>
      <div className="bg-white text-center py-2">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function FinanceChart({ transaksiList }) {
  const dataKeuangan = useMemo(() => {
    const bulanNama = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    const tahunSekarang = new Date().getFullYear();

    return bulanNama.map((bulan, index) => {
      const transaksiBulan = transaksiList.filter((item) => {
        if (!item.tanggal) return false;
        const tanggal = new Date(item.tanggal);

        return (
          tanggal.getFullYear() === tahunSekarang &&
          tanggal.getMonth() === index &&
          item.jenis_transaksi === "OPERASIONAL"
        );
      });

      const pendapatan = transaksiBulan
        .filter((item) => item.arah_kas === "MASUK")
        .reduce((total, item) => total + (Number(item.nominal) || 0), 0);

      const pengeluaran = transaksiBulan
        .filter((item) => item.arah_kas === "KELUAR")
        .reduce((total, item) => total + (Number(item.nominal) || 0), 0);

      return {
        bulan,
        pendapatan,
        pengeluaran,
      };
    });
  }, [transaksiList]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-bold text-slate-900">Grafik Keuangan</h3>
          <p className="text-xs text-slate-500 mt-1">
            Pendapatan dan pengeluaran operasional per bulan
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-500">Pendapatan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-slate-500">Pengeluaran</span>
          </div>
        </div>
      </div>

      <div className="w-full h-75">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dataKeuangan}
            margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
          >
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="bulan"
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${value / 1000000}jt`;
                if (value >= 1000) return `${value / 1000}rb`;
                return value;
              }}
            />
            <Tooltip
              formatter={(value) => formatRupiah(value)}
              labelFormatter={(label) => `Bulan: ${label}`}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="pendapatan"
              name="Pendapatan"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: "#10b981" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="pengeluaran"
              name="Pengeluaran"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ef4444" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// LOGIKA EVALUASI STATUS PEMBAYARAN PRESISI
const tentukanStatusPembayaran = (tanggalBerakhir, sekarang) => {
  if (!tanggalBerakhir) {
    return {
      status: "Terlambat",
      prioritas: 1, // Prioritas 1: Terlambat (paling atas)
      tanggalJatuhTempo: null,
      keterangan: "Belum melakukan pembayaran",
    };
  }

  const tempoDate = new Date(tanggalBerakhir);
  if (Number.isNaN(tempoDate.getTime())) {
    return {
      status: "Terlambat",
      prioritas: 1,
      tanggalJatuhTempo: null,
      keterangan: "Format tanggal salah",
    };
  }

  const hariIni = new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate());
  const tempoTarget = new Date(tempoDate.getFullYear(), tempoDate.getMonth(), tempoDate.getDate());

  const selisihMs = tempoTarget.getTime() - hariIni.getTime();
  const selisihHari = Math.round(selisihMs / (1000 * 60 * 60 * 24));

  if (selisihHari < 0) {
    const jumlahHariTerlambat = Math.abs(selisihHari);
    return {
      status: "Terlambat",
      prioritas: 1, // Terlambat
      tanggalJatuhTempo: tempoDate,
      keterangan: jumlahHariTerlambat === 1 ? "Terlambat 1 hari" : `Terlambat ${jumlahHariTerlambat} hari`,
    };
  }

  if (selisihHari <= 3) {
    const keterangan = selisihHari === 0 ? "Jatuh tempo hari ini" : `H-${selisihHari} jatuh tempo`;
    return {
      status: "Mendekati",
      prioritas: 2, // Prioritas 2: Mendekati (di tengah)
      tanggalJatuhTempo: tempoDate,
      keterangan,
    };
  }

  return {
    status: "Lunas",
    prioritas: 3, // Prioritas 3: Lunas (paling bawah)
    tanggalJatuhTempo: tempoDate,
    keterangan: "Sudah dibayar",
  };
};

export default function DashboardPage() {
  const [dataKamar, setDataKamar] = useState([]);
  const [dataPenghuni, setDataPenghuni] = useState([]);
  const [dataSewaAktifList, setDataSewaAktifList] = useState([]);
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sekarang, setSekarang] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setSekarang(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [kamar, penghuni, transaksi, sewaAktif] = await Promise.all([
          getKamar(),
          getPenghuniAktif(),
          getTransaksi(),
          getDataSewaAktif(),
        ]);

        if (isMounted) {
          setDataKamar(Array.isArray(kamar) ? kamar : []);
          setDataPenghuni(Array.isArray(penghuni) ? penghuni : []);
          setTransaksiList(Array.isArray(transaksi) ? transaksi : []);
          setDataSewaAktifList(Array.isArray(sewaAktif) ? sewaAktif : []);
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        if (isMounted) {
          setDataKamar([]);
          setDataPenghuni([]);
          setTransaksiList([]);
          setDataSewaAktifList([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalKamar = dataKamar.length;
  const kamarTerisi = dataKamar.filter((kamar) => isKamarTerisi(kamar)).length;
  const kamarKosong = dataKamar.filter((kamar) => isKamarKosong(kamar)).length;

  const bulanSekarang = sekarang.getMonth();
  const tahunSekarang = sekarang.getFullYear();

  const transaksiBulanIni = useMemo(() => {
    return transaksiList.filter((item) => {
      if (!item.tanggal) return false;
      const tanggal = new Date(item.tanggal);
      return (
        tanggal.getMonth() === bulanSekarang &&
        tanggal.getFullYear() === tahunSekarang
      );
    });
  }, [transaksiList, bulanSekarang, tahunSekarang]);

  const transaksiOperasionalBulanIni = useMemo(() => {
    return transaksiBulanIni.filter((item) => item.jenis_transaksi === "OPERASIONAL");
  }, [transaksiBulanIni]);

  const uangMasukBulanIni = useMemo(() => {
    return transaksiOperasionalBulanIni
      .filter((item) => item.arah_kas === "MASUK")
      .reduce((total, item) => total + (Number(item.nominal) || 0), 0);
  }, [transaksiOperasionalBulanIni]);

  const uangKeluarBulanIni = useMemo(() => {
    return transaksiOperasionalBulanIni
      .filter((item) => item.arah_kas === "KELUAR")
      .reduce((total, item) => total + (Number(item.nominal) || 0), 0);
  }, [transaksiOperasionalBulanIni]);

  const labaBersih = uangMasukBulanIni - uangKeluarBulanIni;

  const saldo = useMemo(() => {
    return transaksiList.reduce((total, item) => {
      const nominal = Number(item.nominal) || 0;
      if (item.arah_kas === "MASUK") return total + nominal;
      if (item.arah_kas === "KELUAR") return total - nominal;
      return total;
    }, 0);
  }, [transaksiList]);

  // MENYUSUN TABEL STATUS PEMBAYARAN: URUT BERDASARKAN STATUS (TERLAMBAT -> MENDEKATI -> LUNAS), LALU NOMOR KAMAR
 const dataTabelPenghuni = useMemo(() => {
    let rawData;

    if (dataSewaAktifList.length > 0) {
      rawData = dataSewaAktifList.map((sewa) => {
        let tanggalBerakhir = sewa.tanggal_berakhir;
        if (sewa.tanggal_mulai && sewa.tanggal_berakhir) {
          const tglMulai = new Date(sewa.tanggal_mulai).toDateString();
          const tglBerakhir = new Date(sewa.tanggal_berakhir).toDateString();
          if (tglMulai === tglBerakhir) {
            tanggalBerakhir = sewa.tanggal_mulai;
          }
        }

        const hasilStatus = tentukanStatusPembayaran(tanggalBerakhir, sekarang);

        return {
          id: sewa.kontrak_id || sewa.penghuni_id,
          kontrakId: sewa.kontrak_id,
          nomorKamar: sewa.nomor_kamar ?? "-",
          nama: sewa.nama_penghuni ?? "-",
          noHp: sewa.no_hp ?? "-",
          tanggalJatuhTempo: hasilStatus.tanggalJatuhTempo,
          status: hasilStatus.status,
          prioritas: hasilStatus.prioritas,
          keterangan: hasilStatus.keterangan,
        };
      });
    } else {
      rawData = dataPenghuni.map((penghuni) => {
        const kamar = dataKamar.find(
          (item) => Number(item.id) === Number(penghuni.kamar_id)
        );

        const penghuniId = penghuni.penghuni_id ?? penghuni.id;
        const kontrakId = penghuni.kontrak_id ?? null;
        const tanggalBerakhir =
          penghuni.tanggal_berakhir ??
          penghuni.tanggalBerakhir ??
          null;

        const hasilStatus = tentukanStatusPembayaran(tanggalBerakhir, sekarang);

        return {
          id: penghuniId,
          kontrakId,
          nomorKamar: penghuni.nomor_kamar ?? kamar?.nomor_kamar ?? "-",
          nama: penghuni.nama ?? "-",
          noHp: penghuni.no_hp ?? penghuni.noHp ?? "-",
          tanggalJatuhTempo: hasilStatus.tanggalJatuhTempo,
          status: hasilStatus.status,
          prioritas: hasilStatus.prioritas,
          keterangan: hasilStatus.keterangan,
        };
      });
    }

    // PENGURUTAN UTAMA:
    // 1. Berdasarkan prioritas status (1 = Terlambat di atas, 2 = Mendekati di tengah, 3 = Lunas di bawah)
    // 2. Jika prioritas sama, diurutkan berdasarkan Nomor Kamar secara rapi (1 sampai selesai)
    return rawData.sort((a, b) => {
      if (a.prioritas !== b.prioritas) {
        return a.prioritas - b.prioritas;
      }

      const numA = parseInt(String(a.nomorKamar).replace(/\D/g, ""), 10);
      const numB = parseInt(String(b.nomorKamar).replace(/\D/g, ""), 10);

      if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
        return numA - numB;
      }

      return String(a.nomorKamar).localeCompare(String(b.nomorKamar), undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [dataSewaAktifList, dataPenghuni, dataKamar, sekarang]);

  const penghuniLunas = dataTabelPenghuni.filter((item) => item.status === "Lunas").length;
  const jumlahMendekati = dataTabelPenghuni.filter((item) => item.status === "Mendekati").length;
  const jumlahTerlambat = dataTabelPenghuni.filter((item) => item.status === "Terlambat").length;

  return (
    <MainLayout
      title="Dashboard"
      description="Selamat datang di Sistem Administrasi Pagul Co-Living"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <RoomSummaryCard
          title="Total Kamar"
          value={loading ? "..." : totalKamar}
          description="Jumlah seluruh kamar"
          icon={<BedDouble size={24} className="text-blue-600" />}
          iconClass="bg-blue-50"
        />

        <RoomSummaryCard
          title="Kamar Terisi"
          value={loading ? "..." : kamarTerisi}
          description="Kamar sedang dihuni"
          icon={<DoorClosed size={24} className="text-emerald-600" />}
          iconClass="bg-emerald-50"
        />

        <RoomSummaryCard
          title="Kamar Kosong"
          value={loading ? "..." : kamarKosong}
          description="Kamar yang tersedia"
          icon={<DoorOpen size={24} className="text-orange-600" />}
          iconClass="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 mb-8">
        <div className="xl:col-span-3">
          <FinanceChart transaksiList={transaksiList} />
        </div>

        <div className="flex flex-col gap-5">
          <FinanceCard
            title="Uang Masuk Bulan Ini"
            value={uangMasukBulanIni}
            icon={<ArrowDownToLine size={22} className="text-emerald-600" />}
            iconClass="bg-emerald-50"
            valueClass="text-emerald-600"
          />

          <FinanceCard
            title="Uang Keluar Bulan Ini"
            value={uangKeluarBulanIni}
            icon={<ArrowUpFromLine size={22} className="text-red-600" />}
            iconClass="bg-red-50"
            valueClass="text-red-600"
          />

          <FinanceCard
            title="Laba Bersih"
            value={labaBersih}
            icon={<TrendingUp size={22} className="text-blue-600" />}
            iconClass="bg-blue-50"
            valueClass="text-blue-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Saldo Kas</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {formatRupiah(saldo)}
            </h3>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50">
            <TrendingUp size={24} className="text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">
            Status Pembayaran Penghuni
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatusCard
            title="Lunas"
            value={loading ? "..." : penghuniLunas}
            background="bg-green-500"
          />
          <StatusCard
            title="Mendekati"
            value={loading ? "..." : jumlahMendekati}
            background="bg-yellow-400"
          />
          <StatusCard
            title="Terlambat"
            value={loading ? "..." : jumlahTerlambat}
            background="bg-red-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Status Pembayaran Penghuni
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Urutan berdasarkan urgensi status (Terlambat di atas, Mendekati di tengah, Lunas di bawah) dan nomor kamar.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-slate-700 text-xs uppercase tracking-wider">
                <th className="px-5 py-4 text-center">Nomor Kamar</th>
                <th className="px-5 py-4 text-left">Nama Penghuni</th>
                <th className="px-5 py-4 text-left">No. HP</th>
                <th className="px-5 py-4 text-center">Jatuh Tempo</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-center">Keterangan</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {dataTabelPenghuni.length > 0 ? (
                dataTabelPenghuni.map((penghuni) => {
                  let statusClass = "bg-yellow-100 text-yellow-700";

                  if (penghuni.status === "Lunas") {
                    statusClass = "bg-green-100 text-green-700";
                  }

                  if (penghuni.status === "Terlambat") {
                    statusClass = "bg-red-100 text-red-700";
                  }

                  return (
                    <tr key={penghuni.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-4 text-center">
                        <span className="font-bold text-slate-700">
                          {penghuni.nomorKamar}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-800">
                          {penghuni.nama}
                        </span>
                      </td>

                      <td className="px-5 py-4">{penghuni.noHp}</td>

                      <td className="px-5 py-4 text-center">
                        {penghuni.tanggalJatuhTempo ? (
                          formatTanggal(penghuni.tanggalJatuhTempo)
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}>
                          {penghuni.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="text-slate-600 text-sm">
                          {penghuni.keterangan || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-slate-400">
                    {loading ? "Memuat data penghuni..." : "Belum ada penghuni aktif."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}