const BASE_URL = 
import.meta.env.VITE_API_URL || 
(window.location.hostname === "localhost" 
    ? "http://localhost:5000/api" 
    : "https://co-living-backend-production-1008.up.railway.app/api");

const API_URL = `${BASE_URL}/kamar`;

// --- TAMBAHKAN LOG INI ---
console.log("📍 [DEBUG kamarApi] Hostname saat ini:", window.location.hostname);
console.log("📍 [DEBUG kamarApi] VITE_API_URL dari env:", import.meta.env.VITE_API_URL);
console.log("📍 [DEBUG kamarApi] BASE_URL yang aktif:", BASE_URL);
console.log("📍 [DEBUG kamarApi] API_URL final:", API_URL);
// -------------------------

export const getKamar = async () => {
    console.log("🚀 [DEBUG kamarApi] Memanggil getKamar() ke URL:", API_URL);
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