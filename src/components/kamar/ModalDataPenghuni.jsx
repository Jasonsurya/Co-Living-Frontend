import { useState } from "react";
import SectionPerjanjian from "./form/SectionPerjanjian";
import SectionIdentitas from "./form/IdentitasPenyewa";
import SectionKontakDarurat from "./form/KontakDarurat";
import ModalValidasi from "./ModalValidasi";

const getTodayLocal = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const initialKontakDarurat = {
  nama: "",
  hubungan: "",
  no_hp: "",
};

const initialFormData = {
  tanggal_perjanjian: getTodayLocal(),
  tanggal_mulai: "",
  tanggal_berakhir: "",

  nama: "",
  nik: "",
  alamat: "",
  gender: "Laki-laki",
  tempat_lahir: "",
  tanggal_lahir: "",
  no_hp: "",
  pekerjaan: "",

  foto_ktp: null,
  foto_diri: null,

  kontak_darurat: [{ ...initialKontakDarurat }],
};

const prepareInitialData = (data) => {
  if (!data) {
    return {
      ...initialFormData,
      kontak_darurat: [{ ...initialKontakDarurat }],
    };
  }

  // PERBAIKAN 1: Ambil kontak_darurat ATAU kontrak_darurat dari backend
  const rawKontak =
    (Array.isArray(data.kontak_darurat) && data.kontak_darurat.length > 0)
      ? data.kontak_darurat
      : (Array.isArray(data.kontrak_darurat) && data.kontrak_darurat.length > 0)
      ? data.kontrak_darurat
      : [];

  const kontakMapped =
    rawKontak.length > 0
      ? rawKontak.map((k) => ({
          id: k.id || null,
          nama: k.nama || "",
          hubungan: k.hubungan || k.status || "",
          no_hp: k.no_hp || k.no_telepon || "",
        }))
      : [{ ...initialKontakDarurat }];

  return {
    ...initialFormData,
    ...data,

    tanggal_lahir: data.tanggal_lahir
      ? String(data.tanggal_lahir).slice(0, 10)
      : "",

    tanggal_perjanjian: data.tanggal_perjanjian
      ? String(data.tanggal_perjanjian).slice(0, 10)
      : getTodayLocal(),

    tanggal_mulai: data.tanggal_mulai
      ? String(data.tanggal_mulai).slice(0, 10)
      : "",

    tanggal_berakhir: data.tanggal_berakhir
      ? String(data.tanggal_berakhir).slice(0, 10)
      : "",

    // Pastikan foto tetap tersimpan jika berupa string dari database
    foto_ktp: data.foto_ktp || null,
    foto_diri: data.foto_diri || null,

    kontak_darurat: kontakMapped,
  };
};

// Sub-komponen internal agar Form ter-reset sempurna berdasarkan key unik
function FormIsiKamar({
  nomorKamar,
  onSave,
  mode,
  initialData,
  handleCloseModal,
}) {
  const [formData, setFormData] = useState(() => prepareInitialData(initialData));
  const [errors, setErrors] = useState({});
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === "create" || mode === "edit") {
      if (!formData.nama?.trim()) {
        newErrors.nama = "Tolong isi nama penghuni";
      }

      if (!formData.nik?.trim()) {
        newErrors.nik = "Tolong isi NIK penghuni";
      }

      if (!formData.gender?.trim()) {
        newErrors.gender = "Tolong pilih jenis kelamin";
      }

      if (!formData.tempat_lahir?.trim()) {
        newErrors.tempat_lahir = "Tolong isi tempat lahir";
      }

      if (!formData.tanggal_lahir) {
        newErrors.tanggal_lahir = "Tolong isi tanggal lahir";
      }

      if (!formData.alamat?.trim()) {
        newErrors.alamat = "Tolong isi alamat penghuni";
      }

      if (!formData.no_hp?.trim()) {
        newErrors.no_hp = "Tolong isi nomor HP";
      }

      if (!formData.pekerjaan?.trim()) {
        newErrors.pekerjaan = "Tolong isi pekerjaan";
      }

      // PERBAIKAN 2: VALIDASI FOTO KTP & FOTO DIRI (Khusus mode create, atau mode edit jika foto tidak ada sama sekali)
      if (mode === "create") {
        if (!formData.foto_ktp) {
          newErrors.foto_ktp = "Tolong sertakan foto KTP";
        }
        if (!formData.foto_diri) {
          newErrors.foto_diri = "Tolong sertakan foto diri";
        }
      }

      // VALIDASI KONTAK DARURAT
      if (
        !Array.isArray(formData.kontak_darurat) ||
        formData.kontak_darurat.length === 0
      ) {
        newErrors.kontak_darurat = [
          {
            general: "Minimal harus ada 1 kontak darurat",
          },
        ];
      } else {
        const kontakErrors = formData.kontak_darurat.map((kontak) => {
          const error = {};

          if (!kontak.nama?.trim()) {
            error.nama = "Tolong isi nama kontak";
          }

          if (!kontak.hubungan?.trim()) {
            error.hubungan = "Tolong isi hubungan";
          }

          if (!kontak.no_hp?.trim()) {
            error.no_hp = "Tolong isi nomor HP kontak";
          }

          return error;
        });

        const adaErrorKontak = kontakErrors.some(
          (error) => Object.keys(error).length > 0
        );

        if (adaErrorKontak) {
          newErrors.kontak_darurat = kontakErrors;
        }
      }
    }

    if (mode === "create" || mode === "extend") {
      if (!formData.tanggal_perjanjian) {
        newErrors.tanggal_perjanjian = "Tolong isi tanggal perjanjian";
      }

      if (!formData.tanggal_mulai) {
        newErrors.tanggal_mulai = "Tolong isi tanggal mulai";
      }

      if (!formData.tanggal_berakhir) {
        newErrors.tanggal_berakhir = "Tolong isi tanggal berakhir";
      }
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      setShowValidationPopup(true);
    }

    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      const dataForm = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          key !== "foto_ktp" &&
          key !== "foto_diri" &&
          key !== "kontak_darurat"
        ) {
          dataForm.append(key, formData[key] || "");
        }
      });

      // Kirim array kontak_darurat secara utuh
      dataForm.append(
        "kontak_darurat",
        JSON.stringify(formData.kontak_darurat)
      );

      if (formData.foto_ktp instanceof File) {
        dataForm.append("foto_ktp", formData.foto_ktp);
      } else if (typeof formData.foto_ktp === "string") {
        dataForm.append("foto_ktp", formData.foto_ktp);
      }

      if (formData.foto_diri instanceof File) {
        dataForm.append("foto_diri", formData.foto_diri);
      } else if (typeof formData.foto_diri === "string") {
        dataForm.append("foto_diri", formData.foto_diri);
      }

      await onSave?.(dataForm);
      handleCloseModal();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    }
  };

  const modalConfig = {
    create: {
      title: "Pendataan Penghuni Baru",
      button: "Simpan Data",
    },
    edit: {
      title: "Ubah Data Penghuni",
      button: "Simpan Perubahan",
    },
    extend: {
      title: "Perpanjang Masa Sewa",
      button: "Perpanjang Sewa",
    },
  };

  return (
    <>
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white">
          <div>
            <h3 className="text-lg font-black text-slate-950">
              {modalConfig[mode]?.title || "Form Penghuni"}
            </h3>
            <p className="text-sm text-slate-500">Kamar {nomorKamar}</p>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="max-h-[65vh] overflow-y-auto px-6 py-5 space-y-6">
            {(mode === "create" || mode === "extend") && (
              <SectionPerjanjian
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
              />
            )}

            {(mode === "create" || mode === "edit") && (
              <>
                <SectionIdentitas
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleFileChange={handleFileChange}
                  errors={errors}
                />
                <SectionKontakDarurat
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition cursor-pointer shadow-md"
            >
              {modalConfig[mode]?.button || "Simpan"}
            </button>
          </div>
        </form>
      </div>

      <ModalValidasi
        isOpen={showValidationPopup}
        onClose={() => setShowValidationPopup(false)}
      />
    </>
  );
}

// Komponen Utama Modal dengan Key Reset
export default function ModalIsiKamar({
  isOpen,
  onClose,
  nomorKamar,
  onSave,
  mode = "create",
  initialData = null,
}) {
  if (!isOpen) return null;

  // Key unik gabungan ID & mode agar form selalu terefresh saat data berganti
  const formKey = `${initialData?.id || initialData?.penghuni_id || "new"}_${mode}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
        onClick={onClose}
      />
      <FormIsiKamar
        key={formKey}
        nomorKamar={nomorKamar}
        onSave={onSave}
        mode={mode}
        initialData={initialData}
        handleCloseModal={onClose}
      />
    </div>
  );
}