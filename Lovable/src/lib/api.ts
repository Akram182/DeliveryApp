import axios, { AxiosError } from "axios";

// const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? "/";

export const api = axios.create({
  baseURL :"http://localhost:5145",
  headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "delivery_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      setStoredToken(null);
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export function apiErrorMessage(err: unknown, fallback = "Что-то пошло не так"): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; title?: string } | undefined;
    return data?.message ?? data?.title ?? err.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
