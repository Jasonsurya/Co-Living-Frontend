export default function SectionPerjanjian({
formData,
handleInputChange,
errors,
}) {
const calculateDurasiSewa = () => {
    if (!formData.tanggal_mulai || !formData.tanggal_berakhir) {
    return "";
    }

    const start = new Date(formData.tanggal_mulai);
    const end = new Date(formData.tanggal_berakhir);
    const diffDays = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 0) {
    return "Tanggal tidak valid";
    }

    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;

    let hasil = "";
    if (months > 0) hasil += `${months} Bulan `;
    if (days > 0) hasil += `${days} Hari`;

    return hasil.trim();
};

const durasiSewa = calculateDurasiSewa();

return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
    <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
        <h3 className="text-base font-semibold text-slate-800">
        Informasi Perjanjian
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">
        Informasi dasar masa sewa penghuni.
        </p>
    </div>

    <div className="px-5 py-4 space-y-4">
        <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">
            Tanggal Perjanjian
        </label>
        <input
            type="date"
            name="tanggal_perjanjian"
            value={formData.tanggal_perjanjian || ""}
            onChange={handleInputChange}
            className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition ${
            errors?.tanggal_perjanjian
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 focus:border-slate-900"
            }`}
        />
        {errors?.tanggal_perjanjian && (
            <p className="mt-1 text-xs text-red-500">
            {errors.tanggal_perjanjian}
            </p>
        )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
            Tanggal Mulai Sewa
            </label>
            <input
            type="date"
            name="tanggal_mulai"
            value={formData.tanggal_mulai || ""}
            onChange={handleInputChange}
            className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition ${
                errors?.tanggal_mulai
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 focus:border-slate-900"
            }`}
            />
            {errors?.tanggal_mulai && (
            <p className="mt-1 text-xs text-red-500">
                {errors.tanggal_mulai}
            </p>
            )}
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
            Tanggal Berakhir Sewa
            </label>
            <input
            type="date"
            name="tanggal_berakhir"
            value={formData.tanggal_berakhir || ""}
            onChange={handleInputChange}
            className={`w-full rounded-xl border px-4 py-3 focus:outline-none transition ${
                errors?.tanggal_berakhir
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 focus:border-slate-900"
            }`}
            />
            {errors?.tanggal_berakhir && (
            <p className="mt-1 text-xs text-red-500">
                {errors.tanggal_berakhir}
            </p>
            )}
        </div>
        </div>

        <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">
            Durasi Sewa
        </label>
        <input
            type="text"
            value={durasiSewa}
            readOnly
            placeholder="Otomatis terhitung"
            className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-700 font-medium"
        />
        </div>
    </div>
    </div>
);
}