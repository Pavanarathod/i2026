import axios from "axios";
import { useAuthStore } from "@/features/auth/store";
import { BASE_URL } from "@/constant/constant";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
