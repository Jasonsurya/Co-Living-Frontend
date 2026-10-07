const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";

  const tanggalString = String(tanggal).slice(0, 10);
  const [tahun, bulan, hari] = tanggalString.split("-");

  if (!tahun || !bulan || !hari) return "-";

  return `${hari}-${bulan}-${tahun}`;
};

export default function DetailIdentitas({ dataPenghuni }) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-base font-semibold text-slate-900">
          Identitas Penyewa
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Informasi pribadi penghuni yang terdaftar.
        </p>
      </div>

      <div className="px-5 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Nama Lengkap
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {dataPenghuni?.nama || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              NIK
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {dataPenghuni?.nik || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Jenis Kelamin
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {dataPenghuni?.gender || dataPenghuni?.jenisKelamin || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Nomor HP
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {dataPenghuni?.no_hp || dataPenghuni?.noHp || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Tempat Lahir
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {dataPenghuni?.tempat_lahir || dataPenghuni?.tempatLahir || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Tanggal Lahir
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {formatTanggal(
                dataPenghuni?.tanggal_lahir || dataPenghuni?.tanggalLahir
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Pekerjaan
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {dataPenghuni?.pekerjaan || "-"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Alamat
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 leading-relaxed">
              {dataPenghuni?.alamat || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}