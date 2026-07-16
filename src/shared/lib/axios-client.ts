import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

import { env } from "@/shared/config/env";
import { API_TIMEOUT_MS } from "@/shared/constants/api.constants";
import { mapAxiosError } from "@/shared/lib/errors";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function createAxiosClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.apiUrl,
    timeout: API_TIMEOUT_MS,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const apiError = mapAxiosError(error);
      return Promise.reject(apiError);
    },
  );

  return client;
}

export const axiosClient = createAxiosClient();
