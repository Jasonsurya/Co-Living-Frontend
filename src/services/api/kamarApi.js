// Menggunakan URL Railway langsung secara aman tanpa perlu file config terpisah
const BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (window.location.hostname === "localhost" ? "http://localhost:5000/api" : "https://co-living-backend-production-1008.up.railway.app/api");

const API_URL = `${BASE_URL}/kamar`;

export const getKamar = async () => {
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