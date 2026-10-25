// src/services/api.js

const API_URL = "https://co-living-backend-production-1008.up.railway.app/api";

console.log("[API CONFIG FINAL - FIXED]", {
  hostname: window.location.hostname,
  envUrl: import.meta.env.VITE_API_URL,
  finalUrl: API_URL,
});

export default API_URL;

// ==========================================
// 1. KAMAR & PENGHUNI
// ==========================================

export const getKamar = async () => {
  const response = await fetch(`${API_URL}/kamar`);
  if (!response.ok) throw new Error("Gagal mengambil data kamar");
  return await response.json();
};

export const isiKamar = async (kamarId, data) => {
  const isFormData = data instanceof FormData;
  const options = {
    method: "POST",
    body: isFormData ? data : JSON.stringify(data),
  };
  if (!isFormData) options.headers = { "Content-Type": "application/json" };
  
  const response = await fetch(`${API_URL}/kamar/${kamarId}/isi`, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Gagal mengisi kamar");
  }
  return await response.json();
};

export const getPenghuni = async () => {
  const response = await fetch(`${API_URL}/penghuni`);
  if (!response.ok) throw new Error("Gagal mengambil data penghuni");
  return await response.json();
};

export const getPenghuniAktif = async () => {
  const response = await fetch(`${API_URL}/penghuni/aktif`);
  if (!response.ok) throw new Error("Gagal mengambil data penghuni aktif");
  return await response.json();
};

export const getPenghuniByKamarId = async (kamarId) => {
  const response = await fetch(`${API_URL}/penghuni/kamar/${kamarId}`);
  if (!response.ok) throw new Error("Gagal mengambil data penghuni kamar");
  return await response.json();
};

export const updatePenghuni = async (penghuniId, data) => {
  const isFormData = data instanceof FormData;
  const options = {
    method: "PUT",
    body: isFormData ? data : JSON.stringify(data),
  };
  if (!isFormData) options.headers = { "Content-Type": "application/json" };
  
  const response = await fetch(`${API_URL}/penghuni/${penghuniId}`, options);
  if (!response.ok) throw new Error("Gagal mengubah data penghuni");
  return await response.json();
};

export const getRiwayatPenghuni = async () => {
  const response = await fetch(`${API_URL}/penghuni/riwayat`);
  if (!response.ok) throw new Error("Gagal mengambil riwayat penghuni");
  return await response.json();
};

export const getDetailRiwayatPenghuni = async (kontrakId) => {
  const response = await fetch(`${API_URL}/penghuni/riwayat/${kontrakId}`);
  if (!response.ok) throw new Error("Gagal mengambil detail riwayat penghuni");
  return await response.json();
};

export const getRiwayatPenghuniKamar = async (kamarId) => {
  const response = await fetch(`${API_URL}/penghuni/riwayat/kamar/${kamarId}`);
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Gagal mengambil riwayat penghuni kamar");
  }
  return await response.json();
};

export const getKontrak = async () => {
  const response = await fetch(`${API_URL}/kontrak`);
  if (!response.ok) throw new Error("Gagal mengambil data kontrak");
  return await response.json();
};

export const getKontakDarurat = async () => {
  const response = await fetch(`${API_URL}/kontak-darurat`);
  if (!response.ok) throw new Error("Gagal mengambil data kontak darurat");
  return await response.json();
};

// ✂️ CATATAN: Fungsi perpanjangKontrak dan keluarKamar SUDAH DIHAPUS dari sini!
// Kedua fungsi tersebut sekarang eksklusif hidup di file src/services/api/kontrakApi.js

// ==========================================
// 2. TRANSAKSI & AKUN
// ==========================================

export const getTransaksi = async () => {
  const response = await fetch(`${API_URL}/transaksi`);
  if (!response.ok) throw new Error("Gagal mengambil data transaksi");
  return await response.json();
};

export const getDataSewaAktif = async () => {
  const response = await fetch(`${API_URL}/transaksi/sewa-aktif`);
  if (!response.ok) throw new Error("Gagal mengambil data sewa aktif");
  return await response.json();
};

export const getKontrakDeposit = async () => {
  const response = await fetch(`${API_URL}/transaksi/kontrak-deposit`);
  if (!response.ok) throw new Error("Gagal mengambil data kontrak deposit");
  return await response.json();
};

export const tambahTransaksi = async (data) => {
  const isFormData = data instanceof FormData;
  const options = {
    method: "POST",
    body: isFormData ? data : JSON.stringify(data),
  };
  if (!isFormData) options.headers = { "Content-Type": "application/json" };

  const response = await fetch(`${API_URL}/transaksi`, options);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Gagal menambahkan transaksi");
  return result;
};

export const tambahTransaksiSewa = async (data) => {
  const isFormData = data instanceof FormData;
  const options = {
    method: "POST",
    body: isFormData ? data : JSON.stringify(data),
  };
  if (!isFormData) options.headers = { "Content-Type": "application/json" };

  const response = await fetch(`${API_URL}/transaksi/sewa`, options);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Gagal mencatat pembayaran sewa");
  return result;
};

export const hapusTransaksi = async (id) => {
  const response = await fetch(`${API_URL}/transaksi/${id}`, { method: "DELETE" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Gagal menghapus transaksi");
  return result;
};

export const getAkun = async () => {
  const response = await fetch(`${API_URL}/akun`);
  if (!response.ok) throw new Error("Gagal mengambil data akun");
  return await response.json();
};

// ==========================================
// 3. DEPOSIT & DENDA
// ==========================================

export const getSaldoDeposit = async (kontrakId) => {
  const response = await fetch(`${API_URL}/deposit/saldo/${kontrakId}`);
  if (!response.ok) throw new Error("Gagal mengambil saldo deposit");
  return await response.json();
};

export const getRiwayatDeposit = async (kontrakId) => {
  const response = await fetch(`${API_URL}/deposit/riwayat/${kontrakId}`);
  if (!response.ok) throw new Error("Gagal mengambil riwayat deposit");
  return await response.json();
};

// ==========================================
// 4. SURAT & DOKUMEN (TAMBAHAN BARU)
// ==========================================

export const generateSuratKontrak = async (kontrakId) => {
  const response = await fetch(`${API_URL}/dokumen-kontrak/generate/${kontrakId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Gagal membuat surat dari template.");
  return await response.json();
};

export const uploadSuratKontrak = async (kontrakId, formData) => {
  const targetUrl = `${API_URL}/dokumen-kontrak/upload/${kontrakId}`;
  
  const response = await fetch(targetUrl, {
    method: "POST",
    body: formData, 
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Gagal mengunggah surat kontrak.");
  }
  return await response.json();
};

export const getRiwayatSuratPenghuni = async (penghuniId) => {
  const response = await fetch(`${API_URL}/dokumen-kontrak/penghuni/${penghuniId}`);
  if (!response.ok) throw new Error("Gagal mengambil riwayat surat penghuni.");
  return await response.json();
};

export const getDokumenKontrak = async (kontrakId) => {
  const response = await fetch(`${API_URL}/dokumen-kontrak/kontrak/${kontrakId}`);
  if (!response.ok) throw new Error("Gagal mengambil dokumen kontrak.");
  return await response.json();
};

export const prosesDendaDeposit = async (data) => {
  const targetUrl = `${API_URL}/deposit/denda`;
  
  const isFormData = data instanceof FormData;
  const options = {
    method: "POST",
    body: isFormData ? data : JSON.stringify(data),
  };

  if (!isFormData) {
    options.headers = { "Content-Type": "application/json" };
  }

  const response = await fetch(targetUrl, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Gagal memproses denda atau deposit.");
  }
  
  return await response.json();
};