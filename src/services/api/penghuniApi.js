import API_BASE_URL from "./config";

const API_URL = `${API_BASE_URL}/penghuni`;

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