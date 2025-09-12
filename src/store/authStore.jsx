import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://lounge-server-149q.onrender.com/api"


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
          const res = await api.post("/auth/register", {
            username,
            email,
            password,
          });
          set((state) => {
            state.user = res.data.user;
            state.token = res.data.token;
          });
          return res.data;
        } catch (err) {
          throw err.response?.data || { message: "Registration failed" };
        }
      },

      // Login
      login: async (email, password) => {
        try {
          const res = await api.post("/auth/login", { email, password });
          set((state) => {
            state.user = res.data.user;
            state.token = res.data.token;
          });
          return res.data;
        } catch (err) {
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
      },
    })),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;
