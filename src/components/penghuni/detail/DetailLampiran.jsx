import { getBaseUrl, getUploadsUrl } from "../../../services/api/config"; // Sesuaikan path relative foldernya

export default function DetailLampiran({ dataPenghuni }) {
    const fotoKtp = dataPenghuni?.foto_ktp || dataPenghuni?.fotoKtp;
    const fotoDiri = dataPenghuni?.foto_diri || dataPenghuni?.fotoDiri;

    // Base URL Backend & Uploads Dinamis
    const API_UPLOADS_URL = getUploadsUrl();
    const BACKEND_URL = getBaseUrl().replace("/api", "");

    // Helper untuk mengecek apakah data file valid
    const isValidFile = (file) => {
        if (!file) return false;
        const str = String(file).trim();
        return str !== "" && str !== "{}" && str !== "null" && str !== "undefined";
    };

    // Helper untuk membentuk URL file yang presisi
    const getFileUrl = (fileName) => {
        if (!isValidFile(fileName)) return "";
        const str = String(fileName).trim();

        // 1. Jika sudah URL lengkap
        if (str.startsWith("http://") || str.startsWith("https://")) {
            return str;
        }

        const cleanPath = str.replace(/^\/+/, "");

        // 2. Jika di database sudah tersimpan path dengan "uploads/"
        if (cleanPath.startsWith("uploads/")) {
            return `${BACKEND_URL}/${cleanPath}`;
        }

        // 3. Jika di database tersimpan dengan prefix subfolder "bukti/"
        if (cleanPath.startsWith("bukti/")) {
            return `${API_UPLOADS_URL}/${cleanPath}`;
        }

        // 4. Jika di database tersimpan dengan prefix subfolder "penghuni/"
        if (cleanPath.startsWith("penghuni/")) {
            return `${API_UPLOADS_URL}/${cleanPath}`;
        }

        // 5. DEFAULT FALLBACK:
        // Tambahkan subfolder /bukti/ atau sesuaikan untuk nama file murni
        return `${API_UPLOADS_URL}/bukti/${cleanPath}`;
    };

    // Helper untuk menampilkan nama file bersih di UI
    const getDisplayName = (fileName) => {
        if (!isValidFile(fileName)) return "Belum ada file";
        return String(fileName).split("/").pop();
    };

    // Fungsi untuk membuka file di tab baru browser
    const handleLihatFile = (namaFile) => {
        const fileUrl = getFileUrl(namaFile);
        if (!fileUrl) return;
        window.open(fileUrl, "_blank");
    };

    const isKtpValid = isValidFile(fotoKtp);
    const isDiriValid = isValidFile(fotoDiri);

    return (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-base font-semibold text-slate-900">
                    Lampiran Dokumen
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Dokumen identitas penghuni.
                </p>
            </div>

            {/* Daftar File */}
            <div className="p-5 space-y-3">

                {/* Foto KTP */}
                <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                            Foto KTP
                        </p>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                            {getDisplayName(fotoKtp)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleLihatFile(fotoKtp)}
                        disabled={!isKtpValid}
                        className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                            isKtpValid
                                ? "bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        Lihat File
                    </button>
                </div>

                {/* Foto Diri */}
                <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                            Foto Penghuni
                        </p>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                            {getDisplayName(fotoDiri)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleLihatFile(fotoDiri)}
                        disabled={!isDiriValid}
                        className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                            isDiriValid
                                ? "bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        Lihat File
                    </button>
                </div>

            </div>
        </div>
    );
}