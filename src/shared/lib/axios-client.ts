import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { mapAuthTokens } from "@/features/auth/mappers/auth.mapper";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/features/auth/utils/token-storage";
import { env } from "@/shared/config/env";
import { API_TIMEOUT_MS } from "@/shared/constants/api.constants";
import { mapAxiosError } from "@/shared/lib/errors";
import type { ApiSuccessResponse } from "@/shared/types/api.types";

interface AuthTokensDto {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const AUTH_SKIP_REFRESH_PATHS = [
  AUTH_ENDPOINTS.login,
  AUTH_ENDPOINTS.register,
  AUTH_ENDPOINTS.refreshToken,
  AUTH_ENDPOINTS.forgotPassword,
  AUTH_ENDPOINTS.resetPassword,
  AUTH_ENDPOINTS.verifyEmail,
  AUTH_ENDPOINTS.resendVerification,
  AUTH_ENDPOINTS.google,
];

let refreshPromise: Promise<string | null> | null = null;

function shouldSkipRefresh(url?: string): boolean {
  if (!url) return false;
  return AUTH_SKIP_REFRESH_PATHS.some((path) => url.includes(path));
}

function isAuthFailure(error: AxiosError): boolean {
  const status = error.response?.status;
  if (status === 401) return true;
  if (status !== 403) return false;

  const message = String(
    (error.response?.data as { message?: string } | undefined)?.message ?? "",
  ).toLowerCase();

  return (
    message.includes("token") ||
    message.includes("unauthorized") ||
    message.includes("forbidden")
  );
}

async function refreshAccessToken(client: AxiosInstance): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const response = await client.post<ApiSuccessResponse<AuthTokensDto>>(
      AUTH_ENDPOINTS.refreshToken,
      { refresh_token: refreshToken },
    );
    const tokens = mapAuthTokens(response.data.data);
    setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
  } catch {
    clearTokens();
    return null;
  }
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
    async (error: AxiosError) => {
      const originalRequest = error.config as RetriableConfig | undefined;

      if (
        !originalRequest ||
        originalRequest._retry ||
        shouldSkipRefresh(originalRequest.url) ||
        !isAuthFailure(error)
      ) {
        return Promise.reject(mapAxiosError(error));
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken(client).finally(() => {
          refreshPromise = null;
        });
      }

      const nextAccessToken = await refreshPromise;
      if (!nextAccessToken) {
        return Promise.reject(mapAxiosError(error));
      }

      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return client(originalRequest);
    },
  );

  return client;
}

export const axiosClient = createAxiosClient();
