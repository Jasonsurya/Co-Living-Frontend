// src/services/api.js

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://co-living-backend-production.up.railway.app/api");

export default API_URL;

// ==========================================
// 1. KAMAR & PENGHUNI
// ==========================================

export const getKamar = async () => {
  const response = await fetch(`${API_URL}/kamar`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data kamar");
  }
  return await response.json();
};

export const getPenghuni = async () => {
  const response = await fetch(`${API_URL}/penghuni`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data penghuni");
  }
  return await response.json();
};

export const getPenghuniAktif = async () => {
  const response = await fetch(`${API_URL}/penghuni/aktif`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data penghuni aktif");
  }
  return await response.json();
};

export const getPenghuniByKamarId = async (kamarId) => {
  const response = await fetch(`${API_URL}/penghuni/kamar/${kamarId}`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data penghuni kamar");
  }
  return await response.json();
};

export const getRiwayatPenghuni = async () => {
  const response = await fetch(`${API_URL}/penghuni/riwayat`);
  if (!response.ok) {
    throw new Error("Gagal mengambil riwayat penghuni");
  }
  return await response.json();
};

export const getDetailRiwayatPenghuni = async (kontrakId) => {
  const response = await fetch(`${API_URL}/penghuni/riwayat/${kontrakId}`);
  if (!response.ok) {
    throw new Error("Gagal mengambil detail riwayat penghuni");
  }
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
  if (!response.ok) {
    throw new Error("Gagal mengambil data kontrak");
  }
  return await response.json();
};

export const getKontakDarurat = async () => {
  const response = await fetch(`${API_URL}/kontak-darurat`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data kontak darurat");
  }
  return await response.json();
};

export const perpanjangKontrak = async (kamarId, data) => {
  const response = await fetch(`${API_URL}/kontrak/perpanjang/${kamarId}`, {
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
  const response = await fetch(`${API_URL}/kontrak/keluar/${kamarId}`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Gagal memproses keluar kamar");
  }

  return await response.json();
};

// ==========================================
// 2. TRANSAKSI & AKUN
// ==========================================

export const getTransaksi = async () => {
  const response = await fetch(`${API_URL}/transaksi`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data transaksi");
  }
  return await response.json();
};

export const getDataSewaAktif = async () => {
  const response = await fetch(`${API_URL}/transaksi/sewa-aktif`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data sewa aktif");
  }
  return await response.json();
};

export const getKontrakDeposit = async () => {
  const response = await fetch(`${API_URL}/transaksi/kontrak-deposit`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data kontrak deposit");
  }
  return await response.json();
};

export const tambahTransaksi = async (data) => {
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

  const response = await fetch(`${API_URL}/transaksi`, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal menambahkan transaksi");
  }
  return result;
};

export const tambahTransaksiSewa = async (data) => {
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

  const response = await fetch(`${API_URL}/transaksi/sewa`, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mencatat pembayaran sewa");
  }
  return result;
};

export const hapusTransaksi = async (id) => {
  const response = await fetch(`${API_URL}/transaksi/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal menghapus transaksi");
  }
  return result;
};

export const getAkun = async () => {
  const response = await fetch(`${API_URL}/akun`);
  if (!response.ok) {
    throw new Error("Gagal mengambil data akun");
  }
  return await response.json();
};

// ==========================================
// 3. DEPOSIT & DENDA
// ==========================================

export const getSaldoDeposit = async (kontrakId) => {
  const response = await fetch(`${API_URL}/deposit/saldo/${kontrakId}`);
  if (!response.ok) {
    throw new Error("Gagal mengambil saldo deposit");
  }
  return await response.json();
};

export const getRiwayatDeposit = async (kontrakId) => {
  const response = await fetch(`${API_URL}/deposit/riwayat/${kontrakId}`);
  if (!response.ok) {
    throw new Error("Gagal mengambil riwayat deposit");
  }
  return await response.json();
};

export const prosesDendaDeposit = async (data) => {
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

  const response = await fetch(`${API_URL}/deposit/denda`, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal memproses denda");
  }
  return result;
};

export const kembalikanDeposit = async (data) => {
  const response = await fetch(`${API_URL}/deposit/kembalikan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal memproses pengembalian deposit");
  }
  return result;
};

// ==========================================
// 4. DOKUMEN KONTRAK & SURAT
// ==========================================

/**
 * Generate PDF dari template Word & simpan record di PostgreSQL
 * @param {number|string} kontrakId 
 * @param {boolean} force true jika ingin memaksa re-generate PDF baru
 */
export const generateSuratKontrak = async (kontrakId, force = false) => {
  const url = `${API_URL}/dokumen-kontrak/generate/${kontrakId}${force ? "?force=true" : ""}`;
  const response = await fetch(url, {
    method: "POST",
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal membuat surat dari template");
  }
  return result;
};

/**
 * Mendapatkan URL langsung untuk melihat/preview PDF (bisa dipakai di window.open atau iframe)
 * @param {number|string} kontrakId 
 * @param {boolean} force true jika ingin memaksa re-generate PDF baru
 */
export const getLihatPdfSuratUrl = (kontrakId, force = false) => {
  return `${API_URL}/dokumen-kontrak/lihat/${kontrakId}${force ? "?force=true" : ""}`;
};

/**
 * Upload file scan/foto surat yang sudah ditandatangani basah
 * @param {number|string} kontrakId 
 * @param {File} file 
 */
export const uploadSuratKontrak = async (kontrakId, file) => {
  const formData = new FormData();
  formData.append("file_kontrak", file);

  const response = await fetch(`${API_URL}/dokumen-kontrak/upload/${kontrakId}`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Gagal mengunggah surat bertanda tangan");
  }
  return result;
};

/**
 * Mengambil daftar dokumen (GENERATE & UPLOAD) berdasarkan kontrakId
 * @param {number|string} kontrakId 
 */
export const getDokumenKontrak = async (kontrakId) => {
  const response = await fetch(`${API_URL}/dokumen-kontrak/kontrak/${kontrakId}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil riwayat dokumen kontrak");
  }
  return result;
};

/**
 * Mengambil seluruh riwayat surat perpanjangan/kontrak lama & baru berdasarkan penghuniId
 * @param {number|string} penghuniId 
 */
export const getRiwayatSuratPenghuni = async (penghuniId) => {
  const response = await fetch(`${API_URL}/dokumen-kontrak/penghuni/${penghuniId}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil riwayat surat penghuni");
  }
  return result;
};