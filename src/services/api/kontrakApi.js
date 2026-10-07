const API_URL = "http://localhost:5000/api/kontrak";

export const perpanjangKontrak = async (kamarId, data) => {
    const response = await fetch(`${API_URL}/perpanjang/${kamarId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
            errorData?.message || "Gagal memperpanjang kontrak"
        );
    }

    return await response.json();
};

export const keluarKamar = async (kamarId) => {
    const response = await fetch(`${API_URL}/keluar/${kamarId}`, {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
            errorData?.message || "Gagal memproses keluar kamar"
        );
    }

    return await response.json();
};