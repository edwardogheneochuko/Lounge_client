import axios from "axios";
import useAuthStore from "../store/authStore";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://lounge-server-149q.onrender.com/api",
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState(); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
