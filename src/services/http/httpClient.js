import axios from "axios";
import { tokenStorage } from "./tokenStorage";
import { getFreshAccessToken } from "./refreshManager";
import {useAuthStore} from '../../auth.store'

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export const httpClient = axios.create({
  baseURL: "/", // важно для Vite proxy
  withCredentials: true,
});

// 1) Request: всегда подставляем access token
httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2) Response: если 401 — делаем refresh и повторяем запрос
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // если нет ответа (например, сеть упала) — просто пробрасываем ошибку
    if (!error.response) return Promise.reject(error);

    const status = error.response.status;

    // защита от бесконечного цикла
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccess = await getFreshAccessToken();

        // повторяем исходный запрос, подставив новый токен
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return httpClient(originalRequest);
      } catch (e) {
        // refresh не сработал → logout
        useAuthStore.getState().logout();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);