import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Interceptor para adjuntar token automáticamente
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
