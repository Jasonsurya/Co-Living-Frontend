import { AlertTriangle, X, Pencil } from "lucide-react";

export default function ModalTransaksiBelumLengkap({
isOpen,
transaksiBelumLengkap = [],
onClose,
onEdit,
}) {
if (!isOpen) return null;

return (
    <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={onClose}
    >
    <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
    >
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
        <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} className="text-amber-600" />
            </div>

            <div>
            <h3 className="text-lg font-bold text-slate-900">
                Transaksi Belum Lengkap
            </h3>
            <p className="text-sm text-slate-500 mt-1">
                Masih terdapat{" "}
                <strong className="text-slate-700">
                {transaksiBelumLengkap.length} transaksi
                </strong>{" "}
                yang belum lengkap.
            </p>
            </div>
        </div>

        <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        >
            <X size={18} />
        </button>
        </div>

        <div className="px-6 pt-5">
        <p className="text-sm text-slate-600">
            Silakan lengkapi data transaksi berikut sebelum menyimpan semua transaksi.
        </p>
        </div>

        <div className="p-6">
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {transaksiBelumLengkap.map((item, index) => (
            <div
                key={`${item.index}-${index}`}
                className="border border-amber-200 bg-amber-50/50 rounded-xl p-4"
            >
                <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800">
                    Transaksi {item.index + 1}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                    {item.kode
                        ? `${item.kode} - ${item.kategori || "Transaksi"}`
                        : "Transaksi belum memiliki kode akun"}
                    </p>

                    <div className="mt-3">
                    <p className="text-xs font-semibold text-amber-700 mb-1">
                        Data yang perlu dilengkapi:
                    </p>

                    <ul className="space-y-1">
                        {item.kekurangan?.map((field, fieldIndex) => (
                        <li
                            key={fieldIndex}
                            className="text-xs text-slate-600 flex items-start gap-2"
                        >
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{field}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>

                {onEdit && (
                    <button
                    type="button"
                    onClick={() => onEdit(item.index)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
                    >
                    <Pencil size={13} />
                    Lengkapi
                    </button>
                )}
                </div>
            </div>
            ))}
        </div>
        </div>

        <div className="flex justify-end px-6 py-4 bg-slate-50 border-t border-slate-100">
        <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white transition font-medium cursor-pointer"
        >
            Kembali
        </button>
        </div>
    </div>
    </div>
);
}