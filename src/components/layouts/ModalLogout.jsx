import { AlertTriangle } from "lucide-react";

export default function ModalLogout({
isOpen,
onCancel,
onConfirm,
}) {
if (!isOpen) return null;

return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

    <div className="bg-white rounded-xl shadow-xl w-105">

        {/* Header */}
        <div className="flex flex-col items-center p-6 border-b">
        <div className="bg-red-100 p-4 rounded-full mb-3">
            <AlertTriangle
            size={40}
            className="text-red-600"
            />
        </div>

        <h2 className="text-xl font-bold">
            Konfirmasi Keluar
        </h2>
        <p className="text-gray-500 text-center mt-2">
            Apakah Anda yakin ingin keluar dari sistem?
        </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5">
        <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
        >
            Batal
        </button>

        <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
            Keluar
        </button>
        </div>
    </div>
    </div>
);
}