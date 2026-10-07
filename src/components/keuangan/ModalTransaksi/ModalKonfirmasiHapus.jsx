// ModalKonfirmasiHapus.jsx

export default function ModalKonfirmasiHapus({
    isOpen,
    onClose,
    onConfirm,
    title = "Hapus Data?",
    message = "Data yang dihapus tidak dapat dikembalikan.",
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
                onClick={(e) => e.stopPropagation()}
            >

                {/* ICON */}

                <div className="flex justify-center mb-4">

                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                        <i className="fas fa-trash text-xl text-red-600"></i>
                    </div>

                </div>

                {/* JUDUL */}

                <h3 className="text-lg font-bold text-slate-900 text-center">
                    {title}
                </h3>

                {/* PESAN */}

                <p className="text-sm text-slate-500 text-center mt-2">
                    {message}
                </p>

                {/* BUTTON */}

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition font-medium cursor-pointer"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold cursor-pointer"
                    >
                        Hapus
                    </button>

                </div>

            </div>
        </div>
    );
}