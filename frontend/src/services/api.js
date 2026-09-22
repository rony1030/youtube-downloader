import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api", timeout: 10 * 60 * 1000 });
const messageFrom = (error, fallback) => error.response?.data?.error || (error.code === "ECONNABORTED" ? "La operación tardó demasiado." : fallback);

export const getVideoInfo = async (url) => {
  try { return (await api.post("/video/info", { url })).data; }
  catch (error) { throw new Error(messageFrom(error, "No pudimos conectar con el servidor.")); }
};

export const downloadVideo = async (url, quality, format) => {
  try { return (await api.post("/video/download", { url, quality, format })).data; }
  catch (error) { throw new Error(messageFrom(error, "No se pudo completar la descarga.")); }
};

export const fileUrl = (filePath) => {
  const configured = import.meta.env.VITE_API_URL;
  return configured ? `${configured.replace(/\/api\/?$/, "")}${filePath}` : filePath;
};
