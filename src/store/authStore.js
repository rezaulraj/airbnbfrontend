import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  withCredentials: true,
});

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setUser: (userData) =>
        set({
          user: userData,
          isAuthenticated: !!userData,
          error: null,
        }),

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post(
            `${import.meta.env.VITE_API_URL}/api/auth/login`,
            { email, password }
          );
          set({
            user: response.data,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Login failed",
            loading: false,
          });
          throw error;
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post(
            `${import.meta.env.VITE_API_URL}/api/auth/register`,
            { name, email, password }
          );
          set({
            user: response.data,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Registration failed",
            loading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        try {
          const response = await api.get(
            `${import.meta.env.VITE_API_URL}/api/auth/me`
          );
          if (response.data) {
            set({ user: response.data, isAuthenticated: true });
            return response.data;
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          set({ user: null, isAuthenticated: false });
        }
        return null;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
