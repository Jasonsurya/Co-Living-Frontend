import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Upload,
  X,
  ArrowLeft,
  Save,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getKamar,
  getDataSewaAktif,
  getAkun,
  tambahTransaksi,
  tambahTransaksiSewa,
  prosesDendaDeposit,
} from "../../../../services/api";

const getTodayString = () => new Date().toISOString().split("T")[0];

const formatAngka = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const angka = String(value).replace(/\D/g, "");
  if (!angka) return "";
  return new Intl.NumberFormat("id-ID").format(Number(angka));
};

const formatRupiah = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const angka = Number(String(value).replace(/\D/g, ""));
  if (!angka) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(angka);
};

const parseNominal = (value) => {
  if (value === "" || value === null || value === undefined) return 0;
  const angka = String(value)
    .replace(/^Rp\s?/, "")
    .replace(/\./g, "")
    .replace(/,00$/, "")
    .replace(/\D/g, "");
  return Number(angka) || 0;
};

const initialForm = {
  tanggal: getTodayString(),
  kodeAkun: "",
  kategori: "",
  kamarId: null,
  kontrakId: null,
  nomorKamar: "",
  tipeKamar: "",
  penghuniId: null,
  namaPenghuni: "",
  hargaSewa: 0,
  includeDeposit: false,
  nominalDeposit: "",
  keterangan: "",
  nominal: "",
  buktiFoto: [],
};

export default function FormPemasukan({ onBack, onSubmit }) {
  const [daftarForm, setDaftarForm] = useState([{ ...initialForm }]);
  const [halamanAktif, setHalamanAktif] = useState(0);
  const [warningKamar, setWarningKamar] = useState({});

  const [popupNotifikasi, setPopupNotifikasi] = useState({
    tampil: false,
    pesan: "",
  });

  const [daftarKamar, setDaftarKamar] = useState([]);
  const [daftarSewaAktif, setDaftarSewaAktif] = useState([]);
  const [akunPemasukan, setAkunPemasukan] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const ambilData = async () => {
      try {
        const [kamar, sewaAktif, akun] = await Promise.all([
          getKamar(),
          getDataSewaAktif(),
          getAkun(),
        ]);

        if (isMounted) {
          setDaftarKamar(Array.isArray(kamar) ? kamar : []);
          setDaftarSewaAktif(Array.isArray(sewaAktif) ? sewaAktif : []);

          const pemasukan = (Array.isArray(akun) ? akun : [])
            .filter(
              (item) => item.jenis === "PEMASUKAN" && item.kode !== "201"
            )
            .map((item) => ({
              ...item,
              kategori: item.nama,
            }));

          setAkunPemasukan(pemasukan);
        }
      } catch (error) {
        console.error("Gagal mengambil data Form Pemasukan:", error);
        alert(error.message || "Gagal mengambil data Form Pemasukan.");
      }
    };

    ambilData();

    return () => {
      isMounted = false;
    };
  }, []);

  const tampilkanPopup = (pesan) => {
    setPopupNotifikasi({ tampil: true, pesan });
  };

  const tutupPopup = () => {
    setPopupNotifikasi({ tampil: false, pesan: "" });
  };

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setDaftarForm((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [name]: type === "checkbox" ? checked : value }
          : item
      )
    );
  };

  const handleNominalChange = (index, e) => {
    const val = formatAngka(e.target.value);
    setDaftarForm((prev) =>
      prev.map((item, i) => (i === index ? { ...item, nominal: val } : item))
    );
  };

  const handleDepositChange = (index, e) => {
    const val = formatAngka(e.target.value);
    setDaftarForm((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, nominalDeposit: val } : item
      )
    );
  };

  const handleNominalBlur = (index) => {
    setDaftarForm((prev) =>
      prev.map((item, i) => {
        if (i !== index || !item.nominal) return item;
        return {
          ...item,
          nominal: formatRupiah(parseNominal(item.nominal)),
        };
      })
    );
  };

  const handleNominalFocus = (index) => {
    setDaftarForm((prev) =>
      prev.map((item, i) => {
        if (i !== index || !item.nominal) return item;
        return {
          ...item,
          nominal: formatAngka(parseNominal(item.nominal)),
        };
      })
    );
  };

  const handleDepositBlur = (index) => {
    setDaftarForm((prev) =>
      prev.map((item, i) => {
        if (i !== index || !item.nominalDeposit) return item;
        return {
          ...item,
          nominalDeposit: formatRupiah(parseNominal(item.nominalDeposit)),
        };
      })
    );
  };

  const handleDepositFocus = (index) => {
    setDaftarForm((prev) =>
      prev.map((item, i) => {
        if (i !== index || !item.nominalDeposit) return item;
        return {
          ...item,
          nominalDeposit: formatAngka(parseNominal(item.nominalDeposit)),
        };
      })
    );
  };

  const handleKodeChange = (index, e) => {
    const kode = e.target.value;
    const akun = akunPemasukan.find((item) => item.kode === kode);

    setDaftarForm((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        if (!akun) {
          return {
            ...item,
            kodeAkun: "",
            kategori: "",
            kamarId: null,
            kontrakId: null,
            nomorKamar: "",
            tipeKamar: "",
            penghuniId: null,
            namaPenghuni: "",
            hargaSewa: 0,
            nominal: "",
            nominalDeposit: "",
            includeDeposit: false,
            keterangan: "",
          };
        }

        return {
          ...item,
          kodeAkun: akun.kode,
          kategori: akun.kategori,
          kamarId: null,
          kontrakId: null,
          nomorKamar: "",
          tipeKamar: "",
          penghuniId: null,
          namaPenghuni: "",
          hargaSewa: 0,
          nominal: "",
          nominalDeposit: "",
          includeDeposit: false,
          keterangan:
            akun.kode === "401"
              ? "Pembayaran sewa kamar"
              : akun.kode === "402"
              ? "Pembayaran denda"
              : "",
        };
      })
    );

    setWarningKamar((prev) => ({ ...prev, [index]: "" }));
  };

  const handleKamarChange = (index, e) => {
    const nomorKamar = e.target.value;
    const kamar = daftarKamar.find((item) => item.nomor_kamar === nomorKamar);

    setDaftarForm((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        if (!kamar) {
          return {
            ...item,
            nomorKamar: "",
            kamarId: null,
            kontrakId: null,
            tipeKamar: "",
            penghuniId: null,
            namaPenghuni: "",
            hargaSewa: 0,
            nominal: "",
            nominalDeposit: "",
          };
        }

        const sewaAktif = daftarSewaAktif.find(
          (s) => Number(s.kamar_id) === Number(kamar.id)
        );

        if (!sewaAktif) {
          setWarningKamar((wPrev) => ({
            ...wPrev,
            [index]: `Kamar ${kamar.nomor_kamar} belum memiliki penghuni aktif. Transaksi tidak dapat diarahkan ke penghuni kamar ini.`,
          }));
        } else {
          setWarningKamar((wPrev) => ({ ...wPrev, [index]: "" }));
        }

        const nominalAwal =
          item.kodeAkun === "401" && sewaAktif
            ? formatAngka(Number(sewaAktif.harga_sewa))
            : "";

        const nominalDepositAwal =
          item.kodeAkun === "401" && sewaAktif
            ? formatAngka(Math.round(Number(sewaAktif.harga_sewa) * 0.5))
            : "";

        // Mengambil ID Kontrak (mencakup kemungkinan nama properti: kontrak_id, id, atau id_kontrak)
        const idKontrakFix = sewaAktif
          ? sewaAktif.kontrak_id || sewaAktif.id || sewaAktif.id_kontrak || null
          : null;

        return {
          ...item,
          nomorKamar: kamar.nomor_kamar,
          kamarId: kamar.id,
          kontrakId: idKontrakFix,
          tipeKamar: kamar.tipe,
          penghuniId: sewaAktif ? sewaAktif.penghuni_id : null,
          namaPenghuni: sewaAktif ? sewaAktif.nama_penghuni : "",
          hargaSewa: Number(kamar.harga_sewa),
          nominal: nominalAwal,
          nominalDeposit: nominalDepositAwal,
        };
      })
    );
  };

  const handleFileChange = (index, e) => {
    const files = Array.from(e.target.files || []);
    setDaftarForm((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, buktiFoto: files } : item
      )
    );
  };

  const removeFile = (formIndex, fileIndex) => {
    setDaftarForm((prev) =>
      prev.map((item, i) =>
        i === formIndex
          ? {
              ...item,
              buktiFoto: item.buktiFoto.filter((_, fI) => fI !== fileIndex),
            }
          : item
      )
    );
  };

  const handleTambahTransaksi = () => {
    setDaftarForm((prev) => [
      ...prev,
      {
        ...initialForm,
        tanggal: getTodayString(),
      },
    ]);
    setHalamanAktif(daftarForm.length);
  };

  const hapusForm = (index) => {
    if (daftarForm.length === 1) return;
    setDaftarForm((prev) => prev.filter((_, i) => i !== index));

    if (halamanAktif >= index && halamanAktif > 0) {
      setHalamanAktif((prev) => prev - 1);
    }
  };

  const simpanSemua = async () => {
    try {
      const transaksiKosong = [];

      daftarForm.forEach((form, index) => {
        const isKosong =
          !form.kodeAkun &&
          !form.nominal &&
          !form.keterangan &&
          !form.nomorKamar;

        if (isKosong) {
          transaksiKosong.push(index + 1);
        }
      });

      if (transaksiKosong.length > 0) {
        let pesan;
        if (transaksiKosong.length === 1) {
          pesan = `Transaksi ${transaksiKosong[0]} belum diisi.`;
        } else if (transaksiKosong.length === 2) {
          pesan = `Transaksi ${transaksiKosong[0]} dan ${transaksiKosong[1]} belum diisi.`;
        } else {
          const nomorTerakhir = transaksiKosong[transaksiKosong.length - 1];
          const nomorAwal = transaksiKosong.slice(0, -1).join(", ");
          pesan = `Transaksi ${nomorAwal}, dan ${nomorTerakhir} belum diisi.`;
        }

        tampilkanPopup(pesan);
        return;
      }

      const semuaPayload = [];

      for (let i = 0; i < daftarForm.length; i++) {
        const form = daftarForm[i];

        if (!form.tanggal) {
          setHalamanAktif(i);
          tampilkanPopup(`Tanggal transaksi ${i + 1} belum dipilih.`);
          return;
        }

        if (!form.kodeAkun) {
          setHalamanAktif(i);
          tampilkanPopup(`Kode akun transaksi ${i + 1} belum dipilih.`);
          return;
        }

        if (
          (form.kodeAkun === "401" || form.kodeAkun === "402") &&
          !form.kamarId
        ) {
          setHalamanAktif(i);
          tampilkanPopup(`Kamar untuk transaksi ${i + 1} belum dipilih.`);
          return;
        }

        if (
          (form.kodeAkun === "401" || form.kodeAkun === "402") &&
          !form.penghuniId
        ) {
          setHalamanAktif(i);
          tampilkanPopup(
            `Kamar ${form.nomorKamar || ""} pada transaksi ${
              i + 1
            } belum memiliki penghuni aktif.`
          );
          return;
        }

        if (form.kodeAkun === "402" && !form.kontrakId) {
          setHalamanAktif(i);
          tampilkanPopup(
            `ID Kontrak sewa untuk Kamar ${form.nomorKamar || ""} tidak ditemukan.`
          );
          return;
        }

        if (!form.keterangan.trim()) {
          setHalamanAktif(i);
          tampilkanPopup(`Keterangan transaksi ${i + 1} belum diisi.`);
          return;
        }

        const nominalUtama = parseNominal(form.nominal);

        if (!nominalUtama || nominalUtama <= 0) {
          setHalamanAktif(i);
          tampilkanPopup(`Nominal transaksi ${i + 1} tidak valid.`);
          return;
        }

        const formDataPayload = new FormData();
        formDataPayload.append("tanggal", form.tanggal);
        if (form.kamarId) formDataPayload.append("kamar_id", form.kamarId);
        if (form.penghuniId) formDataPayload.append("penghuni_id", form.penghuniId);
        if (form.kontrakId) formDataPayload.append("kontrak_id", form.kontrakId);
        formDataPayload.append("keterangan", form.keterangan);

        if (form.buktiFoto && form.buktiFoto.length > 0) {
          form.buktiFoto.forEach((file) => {
            formDataPayload.append("bukti_foto", file);
          });
        }

        if (form.kodeAkun === "401") {
          let nominalDeposit = 0;

          if (form.includeDeposit) {
            nominalDeposit = parseNominal(form.nominalDeposit);

            if (!nominalDeposit || nominalDeposit <= 0) {
              setHalamanAktif(i);
              tampilkanPopup(
                `Nominal deposit untuk transaksi ${i + 1} tidak valid.`
              );
              return;
            }
          }

          formDataPayload.append("nominal_sewa", nominalUtama);
          formDataPayload.append("include_deposit", form.includeDeposit);
          formDataPayload.append("nominal_deposit", nominalDeposit);

          await tambahTransaksiSewa(formDataPayload);

          semuaPayload.push({
            kode_akun: "401",
            nominal_sewa: nominalUtama,
            include_deposit: form.includeDeposit,
            nominal_deposit: nominalDeposit,
          });

          continue;
        }

        if (form.kodeAkun === "402") {
          formDataPayload.append("nominal", nominalUtama);

          const hasilDenda = await prosesDendaDeposit(formDataPayload);

          semuaPayload.push({
            kode_akun: "402",
            nominal: nominalUtama,
            hasil_denda: hasilDenda,
          });

          continue;
        }

        const akun = akunPemasukan.find(
          (item) => item.kode === form.kodeAkun
        );

        if (akun?.id) formDataPayload.append("akun_id", akun.id);
        formDataPayload.append("nominal", nominalUtama);
        formDataPayload.append("jenis_transaksi", "OPERASIONAL");
        formDataPayload.append("arah_kas", "MASUK");

        await tambahTransaksi(formDataPayload);

        semuaPayload.push({
          kode_akun: form.kodeAkun,
          nominal: nominalUtama,
        });
      }

      if (onSubmit) {
        onSubmit(semuaPayload);
      }

      setDaftarForm([{ ...initialForm }]);
      setHalamanAktif(0);
      setWarningKamar({});

      alert("Semua transaksi berhasil disimpan.");
    } catch (error) {
      console.error("Gagal menyimpan transaksi:", error);
      alert(
        error.message || "Terjadi kesalahan saat menyimpan transaksi."
      );
    }
  };

  const currentForm = daftarForm[halamanAktif] || initialForm;

  return (
    <div className="p-6 md:p-8 space-y-6 w-full max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Form Pemasukan</h3>
          <p className="text-sm text-slate-500 mt-1">
            Catat transaksi pemasukan sewa, denda, maupun pendapatan lainnya
            secara terstruktur.
          </p>
        </div>

        {/* Bar Navigasi Halaman [1][2][3] */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            type="button"
            disabled={halamanAktif === 0}
            onClick={() => setHalamanAktif((prev) => prev - 1)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1">
            {daftarForm.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHalamanAktif(idx)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  halamanAktif === idx
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:shadow-sm"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={halamanAktif === daftarForm.length - 1}
            onClick={() => setHalamanAktif((prev) => prev + 1)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Tampilan Form Halaman Aktif */}
      <div className="p-6 rounded-2xl border border-slate-200/80 bg-white space-y-6 relative shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Transaksi #{halamanAktif + 1} dari {daftarForm.length}
          </span>
          {daftarForm.length > 1 && (
            <button
              type="button"
              onClick={() => hapusForm(halamanAktif)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
            >
              <Trash2 size={15} />
              Hapus Transaksi Ini
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Tanggal Transaksi
          </label>
          <input
            type="date"
            name="tanggal"
            value={currentForm.tanggal}
            onChange={(e) => handleChange(halamanAktif, e)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition font-medium text-slate-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Kode Akun
            </label>
            <select
              name="kodeAkun"
              value={currentForm.kodeAkun}
              onChange={(e) => handleKodeChange(halamanAktif, e)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition font-medium text-slate-700"
            >
              <option value="">Pilih Kode Akun</option>
              {akunPemasukan.map((akun) => (
                <option key={akun.kode} value={akun.kode}>
                  {akun.kode} - {akun.kategori}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Kategori
            </label>
            <input
              type="text"
              value={currentForm.kategori}
              readOnly
              placeholder="Kategori otomatis"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-semibold text-sm focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Pilih Kamar
              </label>
              <select
                name="nomorKamar"
                value={currentForm.nomorKamar}
                onChange={(e) => handleKamarChange(halamanAktif, e)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition font-medium text-slate-700"
              >
                <option value="">-- Tidak Terkait Kamar --</option>
                {daftarKamar.map((kamar) => (
                  <option key={kamar.id} value={kamar.nomor_kamar}>
                    {kamar.nomor_kamar}{" "}
                    {kamar.nama_penghuni
                      ? `- ${kamar.nama_penghuni}`
                      : "- Kosong"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nama Penghuni
              </label>
              <input
                type="text"
                value={currentForm.namaPenghuni}
                readOnly
                placeholder="Otomatis terisi jika kamar dipilih"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-semibold text-sm focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {currentForm.tipeKamar && (
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3">
              <span className="text-xs font-semibold text-slate-500">
                Tipe Kamar
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-lg ${
                  currentForm.tipeKamar === "PREMIUM"
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {currentForm.tipeKamar}
              </span>
            </div>
          )}

          {warningKamar[halamanAktif] && (
            <div className="flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs font-medium">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{warningKamar[halamanAktif]}</span>
            </div>
          )}

          {currentForm.nomorKamar && currentForm.penghuniId && (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs font-medium">
              <ShieldCheck size={16} className="shrink-0" />
              <span>
                Kamar <strong>{currentForm.nomorKamar}</strong> sedang
                ditempati oleh <strong>{currentForm.namaPenghuni}</strong>.
              </span>
            </div>
          )}
        </div>

        {currentForm.kodeAkun === "401" && (
          <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-2xl space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="includeDeposit"
                checked={currentForm.includeDeposit}
                onChange={(e) => handleChange(halamanAktif, e)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs md:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-blue-600" />
                Sertakan Pembayaran Deposit Pertama
              </span>
            </label>

            {currentForm.includeDeposit && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Nominal Deposit
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={currentForm.nominalDeposit}
                    onChange={(e) => handleDepositChange(halamanAktif, e)}
                    onFocus={() => handleDepositFocus(halamanAktif)}
                    onBlur={() => handleDepositBlur(halamanAktif)}
                    placeholder="0"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition text-slate-700 font-medium"
                  />
                </div>
                {currentForm.hargaSewa > 0 && (
                  <p className="text-xs text-slate-500 mt-2">
                    Deposit awal dihitung sebesar <strong>50%</strong> dari harga
                    sewa kamar.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Keterangan Transaksi
          </label>
          <input
            type="text"
            name="keterangan"
            value={currentForm.keterangan}
            onChange={(e) => handleChange(halamanAktif, e)}
            placeholder="Contoh: Pembayaran sewa kamar K01"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition text-slate-700 font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nominal
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                name="nominal"
                value={currentForm.nominal}
                onChange={(e) => handleNominalChange(halamanAktif, e)}
                onFocus={() => handleNominalFocus(halamanAktif)}
                onBlur={() => handleNominalBlur(halamanAktif)}
                placeholder="0"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition text-slate-700 font-medium"
              />
            </div>
            {currentForm.kodeAkun === "401" && currentForm.hargaSewa > 0 && (
              <p className="text-xs text-slate-500 mt-2">
                Harga sewa per bulan:{" "}
                <strong>{formatRupiah(currentForm.hargaSewa)}</strong>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Bukti Foto
            </label>
            <label className="flex items-center justify-between p-1.5 border border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition min-h-12">
              <div className="bg-slate-900 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Upload size={14} />
                CHOOSE FILES
              </div>
              <span className="text-xs text-slate-400 truncate px-3 flex-1 text-right">
                {currentForm.buktiFoto.length > 0
                  ? `${currentForm.buktiFoto.length} file dipilih`
                  : "Upload satu atau beberapa file..."}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(halamanAktif, e)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {currentForm.buktiFoto.length > 0 && (
          <div className="space-y-2">
            {currentForm.buktiFoto.map((file, fileIdx) => (
              <div
                key={`${file.name}-${fileIdx}`}
                className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
              >
                <span className="text-xs text-slate-600 truncate">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(halamanAktif, fileIdx)}
                  className="text-red-500 hover:text-red-700 transition cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold w-full sm:w-auto transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleTambahTransaksi}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold transition cursor-pointer"
          >
            <Plus size={17} />
            Tambah Transaksi
          </button>

          <button
            type="button"
            onClick={simpanSemua}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-semibold transition cursor-pointer"
          >
            <Save size={17} />
            Simpan Semua ({daftarForm.length})
          </button>
        </div>
      </div>

      {popupNotifikasi.tampil && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-amber-100 text-amber-600 shrink-0">
                  <AlertTriangle size={22} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Transaksi Belum Lengkap
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {popupNotifikasi.pesan}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={tutupPopup}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition cursor-pointer"
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}