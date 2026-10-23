// src/services/api/config.js

export const getBaseUrl = () => {
  // Jika sedang di komputer lokal (npm run dev)
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:5000/api";
  }
  // Jika sudah online di Vercel, paksa gunakan Railway!
  return "https://co-living-backend-production-1008.up.railway.app/api";
};

export const getUploadsUrl = () => {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:5000/uploads";
  }
  return "https://co-living-backend-production-1008.up.railway.app/uploads";
};