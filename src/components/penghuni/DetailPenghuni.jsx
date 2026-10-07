import HeaderDetail from "./detail/HeaderDetail";
import DetailIdentitas from "./detail/DetailIdentitas";
import DetailKontakDarurat from "./detail/DetailKontakDarurat";
import DetailLampiran from "./detail/DetailLampiran";

export default function DetailPenghuni({
isOpen,
onClose,
dataPenghuni,
}) {
if (!isOpen) return null;

const penghuni = dataPenghuni || {};

console.log("=== DATA PENGHUNI UTAMA ===", penghuni);
console.log("=== ISI KONTAK DARURAT ===", penghuni.kontak_darurat || penghuni.kontakDarurat);

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
        onClick={onClose}
    />

    <div className="relative bg-white w-full max-w-xl p-6 rounded-2xl shadow-2xl border border-slate-200 z-10 max-h-[90vh] overflow-y-auto">
        <HeaderDetail
        nama={penghuni.nama}
        nomorKamar={penghuni.nomorKamar || penghuni.nomor_kamar}
        statusHunian={penghuni.statusHunian || penghuni.status_hunian}
        onClose={onClose}
        />

        <div className="space-y-5 mt-4">
        <DetailIdentitas dataPenghuni={penghuni} />
        <DetailKontakDarurat dataPenghuni={penghuni} />
        <DetailLampiran dataPenghuni={penghuni} />
        </div>

        <div className="flex justify-end pt-4 mt-6 border-t border-slate-100">
        <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold transition-all cursor-pointer text-xs"
        >
            Selesai & Tutup
        </button>
        </div>
    </div>
    </div>
);
}