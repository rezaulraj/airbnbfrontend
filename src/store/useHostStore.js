import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://airbnbclone-mongo-api.onrender.com",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const useHostStore = create((set, get) => ({
  properties: [],
  publicProperties: [],
  loading: false,
  error: null,

  fetchProperties: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/api/properties`
      );

      const user = JSON.parse(localStorage.getItem("auth-storage"));
      // console.log("auth-store", user.state.user._id);
      const hostProperties = response.data.filter(
        (property) => property.host._id === user.state.user._id
      );
      console.log("public", hostProperties);
      set({ properties: hostProperties, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  fetchPublicProperties: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/api/properties/public`
      );
      set({ publicProperties: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  createProperty: async (formData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/api/properties`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set((state) => ({
        properties: [...state.properties, response.data],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  updateProperty: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(
        `${import.meta.env.VITE_API_URL}/api/properties/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set((state) => ({
        properties: state.properties.map((property) =>
          property._id === id ? response.data : property
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  deleteProperty: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`${import.meta.env.VITE_API_URL}/api/properties/${id}`);

      set((state) => ({
        properties: state.properties.filter((property) => property._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw new Error(error.response?.data?.message || error.message);
    }
  },
}));
