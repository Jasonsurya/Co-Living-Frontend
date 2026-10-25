// KITA BYPASS VITE_API_URL KARENA SETTINGANNYA KURANG 'https://'
const BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5000/api" 
    : "https://co-living-backend-production-1008.up.railway.app/api";

const API_URL = `${BASE_URL}/kontrak`;

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
        throw new Error(errorData?.message || "Gagal memperpanjang kontrak");
    }

    return await response.json();
};

export const keluarKamar = async (kamarId) => {
    const targetUrl = `${API_URL}/keluar/${kamarId}`;
    
    console.log("🚀 [DEBUG KONTRAK API] Menembak URL:", targetUrl);

    try {
        const response = await fetch(targetUrl, {
            method: "POST", // Harus sama dengan router.post di backend
        });

        console.log("🚀 [DEBUG KONTRAK API] Status HTTP:", response.status);

        const responseText = await response.text();
        
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error("❌ [DEBUG KONTRAK API] Server membalas bukan JSON:", responseText);
            throw new Error(`Error ${response.status}: Server tidak membalas JSON`, { cause: e });
        }

        if (!response.ok) {
            throw new Error(result.message || `Gagal (HTTP ${response.status})`);
        }

        console.log("✅ [DEBUG KONTRAK API] Sukses:", result);
        return result;
    } catch (error) {
        console.error("❌ [DEBUG KONTRAK API] Error Fetch:", error.message);
        throw error;
    }
};