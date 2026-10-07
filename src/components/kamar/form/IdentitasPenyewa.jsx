export default function IdentitasPenyewa({
  formData,
  handleInputChange,
  handleFileChange,
  errors,
}) {
  // Mengecek apakah foto sudah ada (baik berupa file baru yang dipilih ATAU URL foto lama)
  const isKtpAvailable = Boolean(formData.foto_ktp);
  const isDiriAvailable = Boolean(formData.foto_diri);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
        <h3 className="text-base font-semibold text-slate-800">
          Identitas Penyewa
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">
          Data diri lengkap sesuai identitas resmi.
        </p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* NAMA & NIK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              placeholder="Masukkan nama lengkap"
              value={formData.nama || ""}
              onChange={handleInputChange}
              className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition ${
                errors?.nama
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-900"
              }`}
            />
            {errors?.nama && (
              <p className="mt-1 text-xs text-red-500">{errors.nama}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              NIK KTP (Maks. 16 Digit)
            </label>
            <input
              type="text"
              name="nik"
              maxLength="16"
              placeholder="Masukkan 16 digit NIK"
              value={formData.nik || ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val.length <= 16) {
                  handleInputChange({
                    target: { name: "nik", value: val },
                  });
                }
              }}
              className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition ${
                errors?.nik
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-900"
              }`}
            />
            {errors?.nik && (
              <p className="mt-1 text-xs text-red-500">{errors.nik}</p>
            )}
          </div>
        </div>

        {/* GENDER & NO HP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Jenis Kelamin
            </label>
            <div className="flex gap-6 items-center h-12.5">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                <input
                  type="radio"
                  name="gender"
                  value="Laki-laki"
                  checked={formData.gender === "Laki-laki"}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-slate-900"
                />
                Laki-laki
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                <input
                  type="radio"
                  name="gender"
                  value="Perempuan"
                  checked={formData.gender === "Perempuan"}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-slate-900"
                />
                Perempuan
              </label>
            </div>
            {errors?.gender && (
              <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              No. HP / WhatsApp (Maks. 14 Digit)
            </label>
            <input
              type="tel"
              name="no_hp"
              maxLength="14"
              placeholder="08xxxxxxxxxx"
              value={formData.no_hp || ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val.length <= 14) {
                  handleInputChange({
                    target: { name: "no_hp", value: val },
                  });
                }
              }}
              className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition ${
                errors?.no_hp
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-900"
              }`}
            />
            {errors?.no_hp && (
              <p className="mt-1 text-xs text-red-500">{errors.no_hp}</p>
            )}
          </div>
        </div>

        {/* TEMPAT & TANGGAL LAHIR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Tempat Lahir
            </label>
            <input
              type="text"
              name="tempat_lahir"
              value={formData.tempat_lahir || ""}
              placeholder="Kota kelahiran"
              onChange={handleInputChange}
              className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition ${
                errors?.tempat_lahir
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-900"
              }`}
            />
            {errors?.tempat_lahir && (
              <p className="mt-1 text-xs text-red-500">
                {errors.tempat_lahir}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Tanggal Lahir
            </label>
            <input
              type="date"
              name="tanggal_lahir"
              value={formData.tanggal_lahir || ""}
              onChange={handleInputChange}
              className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition ${
                errors?.tanggal_lahir
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 focus:border-slate-900"
              }`}
            />
            {errors?.tanggal_lahir && (
              <p className="mt-1 text-xs text-red-500">
                {errors.tanggal_lahir}
              </p>
            )}
          </div>
        </div>

        {/* PEKERJAAN */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Pekerjaan
          </label>
          <input
            type="text"
            name="pekerjaan"
            value={formData.pekerjaan || ""}
            placeholder="Contoh : Mahasiswa"
            onChange={handleInputChange}
            className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition ${
              errors?.pekerjaan
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 focus:border-slate-900"
            }`}
          />
          {errors?.pekerjaan && (
            <p className="mt-1 text-xs text-red-500">{errors.pekerjaan}</p>
          )}
        </div>

        {/* ALAMAT */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Alamat Asal
          </label>
          <textarea
            name="alamat"
            rows="2"
            value={formData.alamat || ""}
            placeholder="Masukkan alamat lengkap"
            onChange={handleInputChange}
            className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition ${
              errors?.alamat
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 focus:border-slate-900"
            }`}
          />
          {errors?.alamat && (
            <p className="mt-1 text-xs text-red-500">{errors.alamat}</p>
          )}
        </div>

        {/* SEKSI FOTO - TANPA GAMBAR (HANYA TEKS STATUS & PERINGATAN) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* FOTO KTP */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Foto KTP <span className="text-red-500">*</span>
            </label>

            {isKtpAvailable ? (
              <div className="mb-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                <span className="text-xs font-bold text-emerald-800 block">
                  ✓ Foto Terpasang / Tersimpan
                </span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">
                  Pilih file baru di bawah jika ingin mengganti foto
                </span>
              </div>
            ) : (
              <div className="mb-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                <span className="text-xs font-semibold text-amber-800 block">
                  ⚠️ Foto belum diunggah
                </span>
              </div>
            )}

            <input
              type="file"
              name="foto_ktp"
              accept="image/*"
              onChange={handleFileChange}
              className={`w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border rounded-xl p-1 ${
                errors?.foto_ktp ? "border-red-500" : "border-slate-200"
              }`}
            />
            {errors?.foto_ktp && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.foto_ktp}
              </p>
            )}
          </div>

          {/* FOTO DIRI */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Foto Diri <span className="text-red-500">*</span>
            </label>

            {isDiriAvailable ? (
              <div className="mb-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                <span className="text-xs font-bold text-emerald-800 block">
                  ✓ Foto Terpasang / Tersimpan
                </span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">
                  Pilih file baru di bawah jika ingin mengganti foto
                </span>
              </div>
            ) : (
              <div className="mb-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                <span className="text-xs font-semibold text-amber-800 block">
                  ⚠️ Foto belum diunggah
                </span>
              </div>
            )}

            <input
              type="file"
              name="foto_diri"
              accept="image/*"
              onChange={handleFileChange}
              className={`w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border rounded-xl p-1 ${
                errors?.foto_diri ? "border-red-500" : "border-slate-200"
              }`}
            />
            {errors?.foto_diri && (
              <p className="mt-1 text-xs font-medium text-red-500">
                {errors.foto_diri}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}