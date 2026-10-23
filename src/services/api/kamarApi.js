// Menggunakan deteksi domain Vercel secara langsung agar 100% aman dari cache build & .env
const getDynamicBaseUrl = () => {
    // Jika domain saat ini mengandung '.vercel.app' atau bukan localhost, paksa gunakan Railway!
    if (window.location.hostname.includes("vercel.app") || window.location.hostname !== "localhost") {
        return "https://co-living-backend-production-1008.up.railway.app/api";
    }
    // Jika benar-benar sedang dibuka di laptop lokal
    return "http://localhost:5000/api";
};

const BASE_URL = getDynamicBaseUrl();
const API_URL = `${BASE_URL}/kamar`;

// --- LOG DEBUGGING UNTUK MEMASTIKAN DI BROWSER ---
console.log("📍 [DEBUG kamarApi] Hostname Browser:", window.location.hostname);
console.log("📍 [DEBUG kamarApi] BASE_URL Final yang Dipakai:", BASE_URL);
console.log("📍 [DEBUG kamarApi] API_URL Target:", API_URL);
// --------------------------------------------------

export const getKamar = async () => {
    console.log("🚀 [DEBUG kamarApi] Mengirim request getKamar() ke:", API_URL);
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Gagal mengambil data kamar");
    }

    return await response.json();
};

export const isiKamar = async (kamarId, data) => {
    const isFormData = data instanceof FormData;

    const options = {
        method: "POST",
        body: isFormData ? data : JSON.stringify(data),
    };

    if (!isFormData) {
        options.headers = {
            "Content-Type": "application/json",
        };
    }

    const response = await fetch(`${API_URL}/${kamarId}/isi`, options);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal mengisi kamar");
    }

    return await response.json();
};

export const keluarKamar = async (kamarId) => {
    const response = await fetch(`${API_URL}/${kamarId}/keluar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal memproses keluar kamar");
    }

    return await response.json();
};