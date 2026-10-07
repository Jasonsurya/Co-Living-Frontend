import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Upload,
  X,
  ArrowLeft,
  Save,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getAkun,
  tambahTransaksi,
  getKontrakDeposit,
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
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
};

const parseNominal = (value) => {
  if (value === "" || value === null || value === undefined) return 0;
  const angka = String(value)
    .replace(/^Rp\s?/i, "")
    .replace(/\./g, "")
    .replace(/,00$/, "")
    .replace(/\D/g, "");
  return Number(angka) || 0;
};

const initialForm = {
  tanggal: getTodayString(),
  mode: "OPERASIONAL",
  kodeAkun: "",
  kategori: "",
  kamarId: null,
  nomorKamar: "",
  penghuniId: null,
  namaPenghuni: "",
  kontrakId: null,
  keterangan: "",
  nominal: "",
  buktiFoto: [],
};

export default function FormPengeluaran({ onBack, onSubmit }) {
  const [daftarForm, setDaftarForm] = useState([{ ...initialForm }]);
  const [halamanAktif, setHalamanAktif] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [popupNotifikasi, setPopupNotifikasi] = useState({
    tampil: false,
    pesan: "",
  });

  const [daftarKontrakDeposit, setDaftarKontrakDeposit] = useState([]);
  const [akunPengeluaran, setAkunPengeluaran] = useState([]);
  const [akunDeposit, setAkunDeposit] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const ambilData = async () => {
      try {
        const [akun, kontrakDeposit] = await Promise.all([
          getAkun(),
          getKontrakDeposit(),
        ]);

        if (isMounted) {
          setDaftarKontrakDeposit(
            Array.isArray(kontrakDeposit) ? kontrakDeposit : []
          );

          const pengeluaran = Array.isArray(akun)
            ? akun
                .filter((item) => {
                  const kode = Number(item.kode);
                  return (
                    item.jenis === "PENGELUARAN" &&
                    kode >= 500 &&
                    kode < 600 &&
                    String(item.kode) !== "202"
                  );
                })
                .map((item) => ({
                  ...item,
                  kategori: item.nama,
                }))
            : [];

          setAkunPengeluaran(pengeluaran);

          const deposit = Array.isArray(akun)
            ? akun.find((item) => String(item.kode) === "202")
            : null;

          setAkunDeposit(
            deposit
              ? {
                  ...deposit,
                  kategori: deposit.nama || "Pengembalian Deposit",
                }
              : {
                  id: null,
                  kode: "202",
                  nama: "Pengembalian Deposit",
                  kategori: "Pengembalian Deposit",
                  jenis: "PENGELUARAN",
                }
          );
        }
      } catch (error) {
        console.error("Gagal mengambil data Form Pengeluaran:", error);
        alert(error.message || "Gagal mengambil data Form Pengeluaran.");
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
    const { name, value } = e.target;
    setDaftarForm((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };

  const handleNominalChange = (index, e) => {
    const val = formatAngka(e.target.value);
    setDaftarForm((prev) =>
      prev.map((item, i) => (i === index ? { ...item, nominal: val } : item))
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

  const handleKodeChange = (index, e) => {
    const kode = e.target.value;
    const akun = akunPengeluaran.find(
      (item) => String(item.kode) === String(kode)
    );

    setDaftarForm((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        if (!akun) {
          return {
            ...item,
            mode: "OPERASIONAL",
            kodeAkun: "",
            kategori: "",
            kamarId: null,
            nomorKamar: "",
            penghuniId: null,
            namaPenghuni: "",
            kontrakId: null,
            keterangan: "",
            nominal: "",
          };
        }
        return {
          ...item,
          mode: "OPERASIONAL",
          kodeAkun: akun.kode,
          kategori: akun.nama,
          kamarId: null,
          nomorKamar: "",
          penghuniId: null,
          namaPenghuni: "",
          kontrakId: null,
          keterangan: "",
          nominal: "",
        };
      })
    );
  };

  const aktifkanModeDeposit = (index) => {
    setDaftarForm((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              mode: "DEPOSIT",
              kodeAkun: akunDeposit?.kode ?? "202",
              kategori: akunDeposit?.nama ?? "Pengembalian Deposit",
              kamarId: null,
              nomorKamar: "",
              penghuniId: null,
              namaPenghuni: "",
              kontrakId: null,
              keterangan: "Pengembalian Deposit",
              nominal: "",
            }
          : item
      )
    );
  };

  const handleSelectTargetDeposit = (index, e) => {
    const selectedKontrakId = e.target.value;

    const target = daftarKontrakDeposit.find(
      (item) => String(item.kontrak_id) === String(selectedKontrakId)
    );

    if (!target) {
      setDaftarForm((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                kontrakId: null,
                kamarId: null,
                nomorKamar: "",
                penghuniId: null,
                namaPenghuni: "",
                nominal: "",
                keterangan: "Pengembalian Deposit",
              }
            : item
        )
      );
      return;
    }

    const sisaSaldo = Number(target.sisa_deposit ?? target.saldo ?? 0);
    const namaFix = target.nama_penghuni || target.nama || "";

    setDaftarForm((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              kontrakId: target.kontrak_id,
              kamarId: target.kamar_id,
              nomorKamar: target.nomor_kamar,
              penghuniId: target.penghuni_id,
              namaPenghuni: namaFix,
              nominal: sisaSaldo > 0 ? formatAngka(sisaSaldo) : "",
              keterangan: `Pengembalian Deposit Kamar ${target.nomor_kamar} - ${namaFix}`,
            }
          : item
      )
    );
  };

  const batalkanModeDeposit = (index) => {
    setDaftarForm((prev) =>
      prev.map((item, i) =>
        i === index ? { ...initialForm, tanggal: item.tanggal } : item
      )
    );
  };

  const handleFileChange = (index, e) => {
    const files = Array.from(e.target.files || []);
    setDaftarForm((prev) =>
      prev.map((item, i) => (i === index ? { ...item, buktiFoto: files } : item))
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
      { ...initialForm, tanggal: getTodayString() },
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
          !form.keterangan;

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

      setIsSaving(true);

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

        const isDeposit = form.mode === "DEPOSIT";

        let akun;
        if (isDeposit) {
          akun = akunDeposit;
        } else {
          akun = akunPengeluaran.find(
            (item) => String(item.kode) === String(form.kodeAkun)
          );
        }

        if (!akun || !akun.id) {
          setHalamanAktif(i);
          tampilkanPopup(`Akun/ID Akun untuk transaksi ${i + 1} tidak ditemukan.`);
          return;
        }

        if (isDeposit && !form.kontrakId) {
          setHalamanAktif(i);
          tampilkanPopup(
            `Target Kamar dan Penghuni pengembalian deposit pada transaksi ${
              i + 1
            } harus dipilih.`
          );
          return;
        }

        // KONTROK PAYLOAD FORMDATA
        const formDataPayload = new FormData();
        formDataPayload.append("tanggal", form.tanggal);
        formDataPayload.append("akun_id", akun.id);
        formDataPayload.append("nominal", nominalUtama);
        formDataPayload.append("keterangan", form.keterangan);
        formDataPayload.append(
          "jenis_transaksi",
          isDeposit ? "DEPOSIT" : "OPERASIONAL"
        );
        formDataPayload.append("arah_kas", "KELUAR");

        // Hanya append jika ID bernilai valid (bukan null / undefined / "")
        if (form.kamarId) {
          formDataPayload.append("kamar_id", form.kamarId);
        }
        if (form.penghuniId) {
          formDataPayload.append("penghuni_id", form.penghuniId);
        }
        if (form.kontrakId) {
          formDataPayload.append("kontrak_id", form.kontrakId);
        }

        if (form.buktiFoto && form.buktiFoto.length > 0) {
          form.buktiFoto.forEach((file) => {
            formDataPayload.append("bukti_foto", file);
          });
        }

        await tambahTransaksi(formDataPayload);
      }

      if (onSubmit) {
        onSubmit(daftarForm);
      }

      setDaftarForm([{ ...initialForm, tanggal: getTodayString() }]);
      setHalamanAktif(0);
      alert("Semua transaksi pengeluaran berhasil disimpan.");
    } catch (error) {
      console.error("Gagal menyimpan transaksi pengeluaran:", error);
      alert(
        error.message || "Terjadi kesalahan saat menyimpan transaksi."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const currentForm = daftarForm[halamanAktif] || initialForm;
  const isDeposit = currentForm.mode === "DEPOSIT";

  return (
    <div className="p-6 md:p-8 space-y-6 w-full max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            Form Pengeluaran
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Catat transaksi pengeluaran operasional atau pengembalian deposit.
          </p>
        </div>

        {/* Bar Navigasi Halaman [1][2][3] */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            type="button"
            disabled={halamanAktif === 0 || isSaving}
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
                disabled={isSaving}
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
            disabled={halamanAktif === daftarForm.length - 1 || isSaving}
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
              disabled={isSaving}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer disabled:opacity-50"
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
            disabled={isSaving}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition font-medium text-slate-700 disabled:bg-slate-100"
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
              disabled={isSaving || isDeposit}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition font-medium text-slate-700 ${
                isDeposit
                  ? "bg-slate-100 cursor-not-allowed"
                  : "bg-white"
              }`}
            >
              <option value="">Pilih Kode Akun</option>
              <optgroup label="Pengeluaran Operasional">
                {akunPengeluaran.map((akun) => (
                  <option key={akun.kode} value={akun.kode}>
                    {akun.kode} - {akun.nama}
                  </option>
                ))}
              </optgroup>
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

        {currentForm.mode === "OPERASIONAL" ? (
          <div>
            <button
              type="button"
              onClick={() => aktifkanModeDeposit(halamanAktif)}
              disabled={isSaving}
              className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-700 font-semibold text-sm hover:bg-amber-100 transition cursor-pointer disabled:opacity-50"
            >
              Pengembalian Deposit
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div>
              <p className="text-sm font-bold text-amber-800">
                Mode Pengembalian Deposit
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Form pengeluaran operasional dinonaktifkan.
              </p>
            </div>
            <button
              type="button"
              onClick={() => batalkanModeDeposit(halamanAktif)}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-amber-300 text-amber-700 text-sm font-semibold hover:bg-amber-100 transition cursor-pointer disabled:opacity-50"
            >
              <X size={15} /> Batal
            </button>
          </div>
        )}

        {isDeposit && (
          <div className="space-y-5 bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80">
            <div>
              <p className="text-base font-bold text-amber-800">
                Pengembalian Deposit
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Pilih penghuni non-aktif (sudah keluar) yang masih memiliki saldo deposit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Kode Akun
                </label>
                <input
                  type="text"
                  value="202"
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-semibold text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Kategori
                </label>
                <input
                  type="text"
                  value="Pengembalian Deposit"
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-semibold text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* DROPDOWN TARGET KAMAR & PENGHUNI NON-AKTIF */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Pilih Target Penghuni Non-Aktif (Sisa Deposit)
              </label>
              <select
                value={currentForm.kontrakId || ""}
                onChange={(e) => handleSelectTargetDeposit(halamanAktif, e)}
                disabled={isSaving}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 transition font-medium text-slate-700"
              >
                <option value="">-- Pilih Penghuni Non-Aktif (Keluar) --</option>
                {daftarKontrakDeposit
                  .filter(
                    (item) =>
                      Number(item.sisa_deposit ?? item.saldo ?? 0) > 0
                  )
                  .map((item) => {
                    const namaShow =
                      item.nama_penghuni || item.nama || "-";
                    const sisa = Number(
                      item.sisa_deposit ?? item.saldo ?? 0
                    );
                    const tglKeluar = item.tanggal_keluar
                      ? new Date(item.tanggal_keluar).toLocaleDateString("id-ID")
                      : "-";

                    return (
                      <option
                        key={item.kontrak_id}
                        value={item.kontrak_id}
                      >
                        {`[KELUAR: ${tglKeluar}] Kamar ${item.nomor_kamar} - ${namaShow} (Sisa Depo: Rp ${sisa.toLocaleString("id-ID")})`}
                      </option>
                    );
                  })}
              </select>
              <p className="text-xs text-amber-700 mt-2">
                * Hanya menampilkan penghuni yang sudah mengakhiri sewa (keluar) dan masih memiliki saldo deposit.
              </p>
            </div>
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
            disabled={isSaving}
            placeholder={
              isDeposit
                ? "Contoh: Pengembalian deposit K01 - Luigi Bros"
                : "Contoh: Pembayaran listrik bulan April"
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition text-slate-700 font-medium disabled:bg-slate-100"
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
                disabled={isSaving}
                placeholder="0"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition text-slate-700 font-medium disabled:bg-slate-100"
              />
            </div>
            {isDeposit && currentForm.nominal && (
              <p className="text-xs text-slate-500 mt-2">
                Saldo deposit diambil otomatis dari sisa deposit, tetapi dapat disesuaikan.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Bukti Foto
            </label>
            <label className="flex items-center justify-between p-1.5 border border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition min-h-12">
              <div className="bg-slate-900 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Upload size={14} /> CHOOSE FILES
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
                disabled={isSaving}
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
                  disabled={isSaving}
                  className="text-red-500 hover:text-red-700 transition cursor-pointer disabled:opacity-50"
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
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold w-full sm:w-auto transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleTambahTransaksi}
            disabled={isSaving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={17} /> Tambah Transaksi
          </button>

          <button
            type="button"
            onClick={simpanSemua}
            disabled={isSaving}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
              isSaving
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
            }`}
          >
            <Save size={17} /> {isSaving ? "Menyimpan..." : `Simpan Semua (${daftarForm.length})`}
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