import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "https://lounge-server-149q.onrender.com/api";

// Axios instance with token interceptor
const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const useAuthStore = create(
  persist(
    immer((set) => ({
      user: null,
      token: null,

      // Register
      register: async (username, email, password) => {
        try {
          toast.info("Registering..."); // Optional loading toast
          const res = await api.post("/auth/register", {
            username,
            email,
            password,
          });
          set((state) => {
            state.user = res.data.user;
            state.token = res.data.token;
          });
          toast.success("✅ Registration successful");
          return res.data;
        } catch (err) {
          const message = err.response?.data?.message || "Registration failed";
          toast.error(`❌ ${message}`);
          throw err.response?.data || { message: "Registration failed" };
        }
      },

      // Login
      login: async (email, password) => {
        try {
          toast.info("Logging in..."); // Optional loading toast
          const res = await api.post("/auth/login", { email, password });
          set((state) => {
            state.user = res.data.user;
            state.token = res.data.token;
          });
          toast.success("✅ Login successful");
          return res.data;
        } catch (err) {
          const message = err.response?.data?.message || "Login failed";
          toast.error(`❌ ${message}`);
          throw err.response?.data || { message: "Login failed" };
        }
      },

      // Logout
      logout: () => {
        set((state) => {
          state.user = null;
          state.token = null;
        });
        localStorage.removeItem("auth-storage");
        toast.error("🚪 Logged out successfully");
      },
    })),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;
