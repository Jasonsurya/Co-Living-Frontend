import { useState } from "react";
import { Phone, Trash2, RotateCcw } from "lucide-react";

const initialKontak = {
  nama: "",
  hubungan: "",
  no_hp: "",
};

const PILIHAN_HUBUNGAN = ["Ayah", "Ibu", "Saudara", "Teman"];

function KontakItem({
  kontak,
  index,
  itemError,
  onChangeKontak,
  onHapusKontak,
  isOnlyOne,
}) {
  const isPreset = PILIHAN_HUBUNGAN.includes(kontak.hubungan);

  // State untuk mode input teks kustom
  const [isCustom, setIsCustom] = useState(
    () => !isPreset && Boolean(kontak.hubungan)
  );
  const [prevHubungan, setPrevHubungan] = useState(kontak.hubungan);

  // Sinkronisasi state saat prop kontak.hubungan berubah dari luar
  if (prevHubungan !== kontak.hubungan) {
    setPrevHubungan(kontak.hubungan);
    if (!PILIHAN_HUBUNGAN.includes(kontak.hubungan) && kontak.hubungan) {
      setIsCustom(true);
    } else {
      setIsCustom(false);
    }
  }

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === "Lainnya") {
      setIsCustom(true);
      onChangeKontak(index, "hubungan", "");
    } else {
      setIsCustom(false);
      onChangeKontak(index, "hubungan", val);
    }
  };

  const handleSwitchToSelect = () => {
    setIsCustom(false);
    onChangeKontak(index, "hubungan", "");
  };

  return (
    <div className="rounded-xl border border-slate-200 p-5 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h4 className="font-semibold text-slate-700">
          Kontak Darurat {index + 1}
        </h4>

        {!isOnlyOne && (
          <button
            type="button"
            onClick={() => onHapusKontak(index)}
            className="flex items-center gap-1 text-red-500 hover:text-red-700 transition cursor-pointer text-sm font-medium"
          >
            <Trash2 size={16} />
            Hapus
          </button>
        )}
      </div>

      {/* Input Nama Lengkap */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-600 mb-2">
          Nama Lengkap
        </label>
        <input
          type="text"
          placeholder="Masukkan nama lengkap"
          value={kontak.nama || ""}
          onChange={(e) => onChangeKontak(index, "nama", e.target.value)}
          className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition ${
            itemError.nama
              ? "border-red-500 focus:border-red-500"
              : "border-slate-300 focus:border-slate-900"
          }`}
        />
        {itemError.nama && (
          <p className="mt-1 text-xs text-red-500">{itemError.nama}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Hubungan (Dropdown vs Input Teks Kustom) */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Hubungan
          </label>

          {!isCustom ? (
            <select
              value={kontak.hubungan || ""}
              onChange={handleSelectChange}
              className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition bg-white ${
                itemError.hubungan
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-900"
              }`}
            >
              <option value="">Pilih Hubungan</option>
              {PILIHAN_HUBUNGAN.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              <option value="Lainnya">Lainnya</option>
            </select>
          ) : (
            <div className="relative flex items-center">
              <input
                type="text"
                autoFocus
                placeholder="Ketik hubungan (misal: Paman, Sahabat)"
                value={kontak.hubungan || ""}
                onChange={(e) => onChangeKontak(index, "hubungan", e.target.value)}
                className={`w-full rounded-xl border pl-4 pr-28 py-3 focus:outline-none transition ${
                  itemError.hubungan
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-300 focus:border-slate-900"
                }`}
              />
              <button
                type="button"
                onClick={handleSwitchToSelect}
                title="Kembali ke pilihan dropdown"
                className="absolute right-2 px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                Daftar
              </button>
            </div>
          )}

          {itemError.hubungan && (
            <p className="mt-1 text-xs text-red-500">{itemError.hubungan}</p>
          )}
        </div>

        {/* Input Nomor HP */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Nomor HP (Maks. 12 Digit)
          </label>
          <input
            type="tel"
            placeholder="08xxxxxxxxxx"
            value={kontak.no_hp || ""}
            onChange={(e) => onChangeKontak(index, "no_hp", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition ${
              itemError.no_hp
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 focus:border-slate-900"
            }`}
          />
          {itemError.no_hp && (
            <p className="mt-1 text-xs text-red-500">{itemError.no_hp}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SectionKontakDarurat({
  formData,
  setFormData,
  errors,
}) {
  const handleTambahKontak = () => {
    setFormData((prev) => ({
      ...prev,
      kontak_darurat: [
        ...(prev.kontak_darurat || []),
        { ...initialKontak },
      ],
    }));
  };

  const handleHapusKontak = (index) => {
    if (formData.kontak_darurat?.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      kontak_darurat: prev.kontak_darurat.filter((_, i) => i !== index),
    }));
  };

  const handleChangeKontak = (index, field, value) => {
    if (field === "no_hp") {
      const hnyAngka = value.replace(/\D/g, "");
      if (hnyAngka.length > 12) return;
      value = hnyAngka;
    }

    setFormData((prev) => ({
      ...prev,
      kontak_darurat: (prev.kontak_darurat || []).map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  };

  const listKontak = Array.isArray(formData.kontak_darurat) && formData.kontak_darurat.length > 0
    ? formData.kontak_darurat
    : [{ ...initialKontak }];

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
        <h3 className="text-base font-semibold text-slate-800">
          Kontak Darurat
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">
          Orang yang dapat dihubungi apabila terjadi keadaan darurat.
        </p>
      </div>

      <div className="px-5 py-5 space-y-5">
        {listKontak.map((kontak, index) => {
          const itemError = errors?.kontak_darurat?.[index] || {};

          return (
            <KontakItem
              key={kontak.id || index}
              kontak={kontak}
              index={index}
              itemError={itemError}
              onChangeKontak={handleChangeKontak}
              onHapusKontak={handleHapusKontak}
              isOnlyOne={listKontak.length === 1}
            />
          );
        })}

        <button
          type="button"
          onClick={handleTambahKontak}
          className="w-full rounded-xl border-2 border-dashed border-slate-300 py-3 flex items-center justify-center gap-2 text-slate-600 hover:border-slate-900 hover:text-slate-900 transition cursor-pointer font-medium"
        >
          <Phone size={18} />
          Tambah Kontak Darurat
        </button>
      </div>
    </div>
  );
}