import axios from "axios";
import useAuthStore from "../store/authStore";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState(); // get token from Zustand store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
