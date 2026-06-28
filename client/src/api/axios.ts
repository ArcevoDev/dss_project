import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

/**
 * BASE URL LOGIC
 * ─────────────
 * Dev:  Vite proxy rewrites /api → http://localhost:5000/api, so baseURL = "/api" works.
 * Prod: Set VITE_API_BASE_URL=https://your-server.railway.app in Vercel env vars.
 *       e.g. VITE_API_BASE_URL=https://dss-api.railway.app
 *       The axios instance will then send requests directly to the server origin,
 *       bypassing Vercel's static hosting (which can't forward to an external API).
 */
const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "/api";

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000, // raised from 10s to allow cold-start on free-tier hosts
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("dss_token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Global response error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("dss_token");
      localStorage.removeItem("dss_student");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);