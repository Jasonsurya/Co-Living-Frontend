import { X } from "lucide-react";

export default function HeaderDetail({
    nama,
    nomorKamar,
    statusHunian,
    onClose,
}) {
    const isAktif =
        String(statusHunian).toUpperCase() === "AKTIF";

    return (
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                        {nama || "Detail Penghuni"}
                    </h2>

                    <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isAktif
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                    >
                        {isAktif ? "Aktif" : "Nonaktif"}
                    </span>
                </div>

                <p className="text-xs text-slate-500 font-medium">
                    Penghuni Kamar:{" "}
                    <span className="font-semibold text-slate-800">
                        {nomorKamar ? `Kamar ${nomorKamar}` : "-"}
                    </span>
                </p>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
                <X size={18} />
            </button>
        </div>
    );
}