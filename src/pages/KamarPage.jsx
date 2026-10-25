import { useEffect, useState } from "react";
import {
  DoorOpen,
  DoorClosed,
  MoreVertical,
  Edit3,
  Calendar,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import {
  getKamar,
  isiKamar,
} from "../services/api/kamarApi";
import {
  getPenghuniByKamarId,
  updatePenghuni,
} from "../services/api/penghuniApi";
import {
  perpanjangKontrak,
  keluarKamar,
} from "../services/api/kontrakApi";
import ModalDataPenghuni from "../components/kamar/ModalDataPenghuni";
import PopUp_Kamar from "../components/kamar/PopUp_Kamar";

export default function KamarPage() {
  const [kamarList, setKamarList] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [selectedKamar, setSelectedKamar] = useState(null);
  const [selectedPenghuniData, setSelectedPenghuniData] = useState(null);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [selectedPenghuniName, setSelectedPenghuniName] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    const fetchKamar = async () => {
      try {
        const data = await getKamar();
        console.log("🟢 [KamarPage] Data Kamar berhasil dimuat:", data);
        setKamarList(data);
      } catch (error) {
        console.error("❌ [KamarPage] Gagal mengambil data kamar:", error.message);
      }
    };

    fetchKamar();
  }, []);

  const handleOpenCreateModal = (kamar) => {
    setSelectedKamar(kamar);
    setSelectedPenghuniData(null);
    setModalMode("create");
  };

  const handleOpenEditModal = async (kamar) => {
    try {
      console.log("🔍 [KamarPage] Mengambil data penghuni untuk kamar ID:", kamar.id);
      const dataLengkap = await getPenghuniByKamarId(kamar.id);
      console.log("🟢 [KamarPage] Data lengkap penghuni didapat:", dataLengkap);

      setSelectedKamar(kamar);
      setSelectedPenghuniData(dataLengkap);
      setModalMode("edit");
      setMenuOpen(null);

    } catch (error) {
      console.error("❌ [KamarPage] Gagal mengambil data penghuni:", error.message);
    }
  };

  const handleOpenExtendModal = (kamar) => {
    setSelectedKamar(kamar);
    setSelectedPenghuniData(null);
    setModalMode("extend");
    setMenuOpen(null);
  };

  const handleOpenPopUpKeluar = (kamar) => {
    console.log("🚪 [KamarPage] Modal Keluar Kamar dibuka untuk Kamar:", kamar);
    setSelectedKamar(kamar);
    setSelectedPenghuniName(kamar.nama_penghuni || "");
    setIsPopUpOpen(true);
  };

  const handleKeluarKamar = async () => {
    try {
      console.log("🚀 [KamarPage] Tombol konfirmasi keluar kamar diklik.");
      console.log("📍 [KamarPage] Objek selectedKamar saat ini:", selectedKamar);

      // Cek apakah yang dikirim harusnya id kontrak atau id kamar
      // Perhatikan properti apa saja yang ada di dalam objek selectedKamar (misal: selectedKamar.kontrak_id atau selectedKamar.id)
      const idYangDikirim = selectedKamar.kontrak_id || selectedKamar.id;
      console.log("📍 [KamarPage] ID yang akan dikirim ke fungsi keluarKamar:", idYangDikirim);

      await keluarKamar(idYangDikirim);

      window.dispatchEvent(new Event("penghuniUpdated"));

      const dataKamarTerbaru = await getKamar();
      setKamarList(dataKamarTerbaru);

      setIsPopUpOpen(false);
      setSelectedKamar(null);
      setSelectedPenghuniName("");

      console.log("✅ [KamarPage] Kamar berhasil dikosongkan");
    } catch (error) {
      console.error("❌ [KamarPage] Gagal memproses keluar kamar:", error.message);
    }
  };

  const handleSaveModal = async (formData) => {
    if (modalMode === "create") {
      try {
        let parsedKontakDarurat = [];
        try {
          const rawKontak = formData.get("kontak_darurat");
          if (rawKontak) parsedKontakDarurat = JSON.parse(rawKontak);
        } catch {
          parsedKontakDarurat = [];
        }

        const dataForm = new FormData();
        dataForm.append("nama", formData.get("nama") || "");
        dataForm.append("nik", formData.get("nik") || "");
        dataForm.append("gender", formData.get("gender") || "Laki-laki");
        dataForm.append("tempat_lahir", formData.get("tempat_lahir") || "");
        dataForm.append("tanggal_lahir", formData.get("tanggal_lahir") || "");
        dataForm.append("alamat", formData.get("alamat") || "");
        dataForm.append("no_hp", formData.get("no_hp") || "");
        dataForm.append("pekerjaan", formData.get("pekerjaan") || "");

        dataForm.append("kontak_darurat", JSON.stringify(parsedKontakDarurat));
        dataForm.append("tanggal_perjanjian", formData.get("tanggal_perjanjian") || "");
        dataForm.append("tanggal_mulai", formData.get("tanggal_mulai") || "");
        dataForm.append("tanggal_berakhir", formData.get("tanggal_berakhir") || "");

        const fotoKtpFile = formData.get("foto_ktp");
        const fotoDiriFile = formData.get("foto_diri");
        if (fotoKtpFile instanceof File) dataForm.append("foto_ktp", fotoKtpFile);
        if (fotoDiriFile instanceof File) dataForm.append("foto_diri", fotoDiriFile);

        await isiKamar(selectedKamar.id, dataForm);
        console.log("✅ [KamarPage] Kamar berhasil diisi");

        window.dispatchEvent(new Event("penghuniUpdated"));
        const dataKamarTerbaru = await getKamar();
        setKamarList(dataKamarTerbaru);

      } catch (error) {
        console.error("❌ [KamarPage] Gagal mengisi kamar:", error.message);
      }
    }

    if (modalMode === "edit") {
      try {
        await updatePenghuni(selectedPenghuniData.id, formData);
        console.log("✅ [KamarPage] Data penghuni berhasil diperbarui");

        window.dispatchEvent(new Event("penghuniUpdated"));
        const dataKamarTerbaru = await getKamar();
        setKamarList(dataKamarTerbaru);

      } catch (error) {
        console.error("❌ [KamarPage] Gagal mengubah data penghuni:", error.message);
        return;
      }
    }

    if (modalMode === "extend") {
      try {
        const data = {
          tanggal_perjanjian: formData.get("tanggal_perjanjian"),
          tanggal_mulai: formData.get("tanggal_mulai"),
          tanggal_berakhir: formData.get("tanggal_berakhir"),
        };

        await perpanjangKontrak(selectedKamar.id, data);
        console.log("✅ [KamarPage] Kontrak berhasil diperpanjang");

        window.dispatchEvent(new Event("penghuniUpdated"));
        const dataKamarTerbaru = await getKamar();
        setKamarList(dataKamarTerbaru);

      } catch (error) {
        console.error("❌ [KamarPage] Gagal memperpanjang kontrak:", error.message);
        return;
      }
    }

    setModalMode(null);
    setSelectedKamar(null);
    setSelectedPenghuniData(null);
  };

  return (
    <MainLayout
      title="Manajemen Kamar"
      description="Kelola data kamar Co-Living Pagul"
    >
      <div className="grid grid-cols-4 gap-6">
        {kamarList.map((kamar) => {
          const isTerisi = kamar.status === "OCCUPIED";

          return (
            <div
              key={kamar.id}
              className="relative rounded-2xl border border-slate-300 bg-white shadow-sm overflow-visible"
            >
              <div
                className={`rounded-t-2xl py-3 text-center ${
                  isTerisi
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                <h2 className="text-2xl font-bold">{kamar.nomor_kamar}</h2>
              </div>

              <div className="flex min-h-52 flex-col items-center justify-center px-6 py-8">
                {isTerisi ? (
                  <>
                    <DoorClosed className="mb-4 h-14 w-14 text-emerald-600" />
                    <p className="text-center text-base font-semibold text-slate-800">
                      {kamar.nama_penghuni || "Nama penghuni belum tersedia"}
                    </p>
                  </>
                ) : (
                  <>
                    <DoorOpen className="mb-4 h-14 w-14 text-slate-400" />
                    <p className="text-center text-base font-semibold text-slate-500">
                      Belum ada penghuni
                    </p>
                  </>
                )}
              </div>

              <div className="border-t border-slate-200 p-4">
                {isTerisi ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenPopUpKeluar(kamar)}
                      className="flex-1 rounded-xl bg-red-500 py-3 text-white font-semibold hover:bg-red-600 cursor-pointer"
                    >
                      Keluar Kamar
                    </button>

                    <button
                      onClick={() =>
                        setMenuOpen(menuOpen === kamar.id ? null : kamar.id)
                      }
                      className="w-12 rounded-xl border border-slate-300 flex justify-center items-center hover:bg-slate-100 cursor-pointer"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenCreateModal(kamar)}
                    className="w-full rounded-xl bg-slate-900 py-3 text-white font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    Isi Kamar
                  </button>
                )}
              </div>

              {menuOpen === kamar.id && (
                <div className="absolute right-4 bottom-16 w-48 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden z-10">
                  <button
                    onClick={() => handleOpenEditModal(kamar)}
                    className="flex w-full items-center gap-2 px-4 py-3 hover:bg-slate-50 cursor-pointer"
                  >
                    <Edit3 size={16} />
                    Edit Data
                  </button>

                  <button
                    onClick={() => handleOpenExtendModal(kamar)}
                    className="flex w-full items-center gap-2 px-4 py-3 hover:bg-slate-50 border-t cursor-pointer"
                  >
                    <Calendar size={16} />
                    Perpanjang Sewa
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <PopUp_Kamar
        isOpen={isPopUpOpen}
        onClose={() => setIsPopUpOpen(false)}
        onConfirm={handleKeluarKamar}
        nomorKamar={selectedKamar?.nomor_kamar}
        namaPenghuni={selectedPenghuniName}
      />

      <ModalDataPenghuni
        key={`${modalMode}-${selectedKamar?.id}-${selectedPenghuniData?.id || "new"}`}
        isOpen={!!modalMode}
        onClose={() => {
          setModalMode(null);
          setSelectedKamar(null);
          setSelectedPenghuniData(null);
        }}
        nomorKamar={selectedKamar?.nomor_kamar}
        onSave={handleSaveModal}
        mode={modalMode}
        initialData={selectedPenghuniData}
      />
    </MainLayout>
  );
}