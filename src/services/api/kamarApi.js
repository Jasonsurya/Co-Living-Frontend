const API_URL = "http://localhost:5000/api/kamar";

export const getKamar = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Gagal mengambil data kamar");
    }

    return await response.json();
};

export const isiKamar = async (kamarId, data) => {
    // Cek apakah data yang dikirim berupa FormData (mengandung file)
    const isFormData = data instanceof FormData;

    const options = {
        method: "POST",
        body: isFormData ? data : JSON.stringify(data),
    };

    // Jika bukan FormData, set header application/json. 
    // Jika FormData, biarkan browser menangani Content-Type secara otomatis.
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