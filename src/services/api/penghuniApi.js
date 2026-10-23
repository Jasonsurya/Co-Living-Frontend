import API_BASE_URL from "./config";

// Pengaman agar otomatis lari ke Railway jika bukan di localhost
const BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (window.location.hostname === "localhost" ? API_BASE_URL : "https://co-living-backend-production-1008.up.railway.app/api");

const API_URL = `${BASE_URL}/penghuni`;

export const getPenghuniByKamarId = async (kamarId) => {
  const response = await fetch(`${API_URL}/kamar/${kamarId}`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data penghuni kamar");
  }

  return await response.json();
};

export const updatePenghuni = async (penghuniId, data) => {
  const isFormData = data instanceof FormData;

  const options = {
    method: "PUT",
    body: isFormData ? data : JSON.stringify(data),
  };

  if (!isFormData) {
    options.headers = {
      "Content-Type": "application/json",
    };
  }

  const response = await fetch(`${API_URL}/${penghuniId}`, options);

  if (!response.ok) {
    throw new Error("Gagal mengubah data penghuni");
  }

  return await response.json();
};

export const getRiwayatPenghuni = async () => {
  const response = await fetch(`${API_URL}/riwayat`);

  if (!response.ok) {
    throw new Error("Gagal mengambil riwayat penghuni");
  }

  return await response.json();
};

export const getPenghuniAktif = async () => {
  const response = await fetch(`${API_URL}/aktif`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data penghuni aktif");
  }

  return await response.json();
};