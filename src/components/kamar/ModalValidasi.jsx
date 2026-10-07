export default function ModalValidasi({
isOpen,
onClose,
}) {
if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
    <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
        onClick={onClose}
    />

    <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6">
        <div className="text-center">
        <h3 className="text-lg font-bold text-slate-900">
            Data Belum Lengkap
        </h3>

        <p className="mt-2 text-sm text-slate-500">
            Tolong lengkapi data ini untuk bisa disimpan.
        </p>

        <button
            type="button"
            onClick={onClose}
            className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition cursor-pointer"
        >
            Tutup
        </button>
        </div>
    </div>
    </div>
);
}