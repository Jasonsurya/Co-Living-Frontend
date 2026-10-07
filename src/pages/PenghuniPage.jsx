import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import TabelPenghuniAktif from "../components/penghuni/MenuTab_Penghuni/PenghuniAktif";
import RiwayatPenghuni from "../components/penghuni/MenuTab_Penghuni/RiwayatPenghuni";
import DetailPenghuni from "../components/penghuni/DetailPenghuni";

// Impor kedua modal secara eksplisit
import ModalUploadSurat from "../components/penghuni/surat/ModalUploadSurat";
import RiwayatSuratModal from "../components/penghuni/surat/RiwayatSuratModal";

import {
  getRiwayatPenghuni,
  getPenghuniAktif,
  getKontrak,
  getPenghuniByKamarId,
  getDetailRiwayatPenghuni,
} from "../services/api";

export default function PenghuniPage() {
  const [activeTab, setActiveTab] = useState("aktif");
  const [searchQuery, setSearchQuery] = useState("");
  const [kontrak, setKontrak] = useState([]);
  const [riwayatPenghuni, setRiwayatPenghuni] = useState([]);
  const [penghuniAktif, setPenghuniAktif] = useState([]);
  const [penghuniVersion, setPenghuniVersion] = useState(0);
  const [selectedPenghuni, setSelectedPenghuni] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // State terpisah untuk masing-masing Modal
  const [uploadSuratData, setUploadSuratData] = useState(null);
  const [riwayatSuratData, setRiwayatSuratData] = useState(null);
  const [suratVersion, setSuratVersion] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Ambil Data Penghuni Aktif & Kontrak
      try {
        const [dataAktif, dataKontrak] = await Promise.all([
          getPenghuniAktif(),
          getKontrak(),
        ]);
        setPenghuniAktif(Array.isArray(dataAktif) ? dataAktif : []);
        setKontrak(Array.isArray(dataKontrak) ? dataKontrak : []);
      } catch (error) {
        console.error("Gagal mengambil data penghuni aktif:", error);
      }

      // 2. Ambil Data Riwayat Penghuni
      try {
        const dataRiwayat = await getRiwayatPenghuni();
        setRiwayatPenghuni(Array.isArray(dataRiwayat) ? dataRiwayat : []);
      } catch (error) {
        console.error("Gagal mengambil riwayat penghuni:", error);
        setRiwayatPenghuni([]);
      }
    };

    fetchData();
  }, [penghuniVersion]);

  useEffect(() => {
    const handlePenghuniUpdated = () => {
      setPenghuniVersion((version) => version + 1);
    };

    window.addEventListener("penghuniUpdated", handlePenghuniUpdated);

    return () => {
      window.removeEventListener("penghuniUpdated", handlePenghuniUpdated);
    };
  }, []);

  const handleOpenDetail = async (penghuniItem) => {
    try {
      if (penghuniItem.tanggal_keluar) {
        const dataDetail = await getDetailRiwayatPenghuni(
          penghuniItem.kontrak_id
        );

        const dataLengkap = {
          ...dataDetail,
          nomorKamar: dataDetail.nomor_kamar || penghuniItem.nomor_kamar,
          statusHunian: "NONAKTIF",
          kontak_darurat: dataDetail.kontak_darurat || dataDetail.kontakDarurat || [],
        };

        setSelectedPenghuni(dataLengkap);
        setIsDetailOpen(true);
        return;
      }

      const dataDetail = await getPenghuniByKamarId(
        penghuniItem.kamar_id
      );

      let kontakDaruratList = dataDetail.kontak_darurat || dataDetail.kontakDarurat || [];

      if (kontakDaruratList.length === 0 && penghuniItem.kontrak_id) {
        try {
          const detailKontrak = await getDetailRiwayatPenghuni(penghuniItem.kontrak_id);
          kontakDaruratList = detailKontrak.kontak_darurat || detailKontrak.kontakDarurat || [];
        } catch (err) {
          console.warn("Gagal mengambil kontak darurat tambahan:", err);
        }
      }

      const dataLengkap = {
        ...penghuniItem,
        ...dataDetail,
        nomorKamar: dataDetail.nomor_kamar || penghuniItem.nomor_kamar,
        statusHunian: "AKTIF",
        kontak_darurat: kontakDaruratList,
      };

      setSelectedPenghuni(dataLengkap);
      setIsDetailOpen(true);
    } catch (error) {
      console.error(
        "Gagal mengambil detail penghuni:",
        error.message
      );
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedPenghuni(null);
  };

  // Helper untuk membuka modal riwayat surat dari Penghuni Aktif vs Riwayat
  const handleShowRiwayatSurat = (data, isAktif) => {
    setRiwayatSuratData({
      ...data,
      isKontrakAktif: isAktif,
    });
  };

  return (
    <MainLayout
      title="Manajemen Penghuni"
      description="Kelola data penghuni aktif dan riwayat hunian Pagul Co-Living"
    >
      <div className="p-6 space-y-6">
        <div className="flex gap-6 border-b border-slate-200 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("aktif")}
            className={`relative pb-3 transition-colors cursor-pointer ${
              activeTab === "aktif"
                ? "border-b-2 border-slate-900 text-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Penghuni Aktif
          </button>

          <button
            onClick={() => setActiveTab("riwayat")}
            className={`relative pb-3 transition-colors cursor-pointer ${
              activeTab === "riwayat"
                ? "border-b-2 border-slate-900 text-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Riwayat Penghuni
          </button>
        </div>

        {activeTab === "aktif" ? (
          <TabelPenghuniAktif
            kontrak={kontrak}
            penghuni={penghuniAktif}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleOpenDetail={handleOpenDetail}
            setShowUploadModal={setUploadSuratData}
            setShowRiwayatModal={(data) => handleShowRiwayatSurat(data, true)}
            suratVersion={suratVersion}
            penghuniVersion={penghuniVersion}
            setPenghuniVersion={setPenghuniVersion}
          />
        ) : (
          <RiwayatPenghuni
            key={penghuniVersion}
            penghuni={riwayatPenghuni}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleOpenDetail={handleOpenDetail}
            setShowRiwayatModal={(data) => handleShowRiwayatSurat(data, false)}
          />
        )}

        {/* 1. DETAIL PENGHUNI */}
        <DetailPenghuni
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          dataPenghuni={selectedPenghuni}
        />

        {/* 2. MODAL UPLOAD SURAT */}
        <ModalUploadSurat
          isOpen={uploadSuratData !== null}
          kontrakId={uploadSuratData?.kontrakId || uploadSuratData?.kontrak_id}
          namaPenghuni={uploadSuratData?.namaPenghuni || uploadSuratData?.nama}
          onClose={() => setUploadSuratData(null)}
          onSuccess={(hasil) => {
            console.log("===== UPLOAD SURAT BERHASIL =====", hasil);
            setUploadSuratData(null);
            setSuratVersion((v) => v + 1);
          }}
        />

        {/* 3. MODAL RIWAYAT SURAT */}
        <RiwayatSuratModal
          key={`${riwayatSuratData?.penghuniId || riwayatSuratData?.penghuni_id || riwayatSuratData?.kontrakId}_${riwayatSuratData?.isKontrakAktif}_${suratVersion}`}
          isOpen={riwayatSuratData !== null}
          kontrakId={riwayatSuratData?.kontrakId || riwayatSuratData?.kontrak_id}
          penghuniId={riwayatSuratData?.penghuniId || riwayatSuratData?.penghuni_id || riwayatSuratData?.id}
          namaPenghuni={riwayatSuratData?.namaPenghuni || riwayatSuratData?.nama}
          isKontrakAktif={riwayatSuratData?.isKontrakAktif ?? (activeTab === "aktif")}
          onClose={() => setRiwayatSuratData(null)}
        />
      </div>
    </MainLayout>
  );
}