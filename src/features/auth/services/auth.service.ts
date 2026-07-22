import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import {
  mapAuthTokens,
  mapAuthUser,
  toLoginDto,
  toRegisterDto,
} from "@/features/auth/mappers/auth.mapper";
import type {
  AuthTokens,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types/auth.types";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse } from "@/shared/types/api.types";

interface AuthUserDto {
  id: string;
  email: string;
  full_name: string;
  role: string;
  login_provider?: string | null;
  email_verified_at?: string | null;
  last_login_at?: string | null;
}

interface AuthTokensDto {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthUser> {
  const response = await axiosClient.post<ApiSuccessResponse<AuthUserDto>>(
    AUTH_ENDPOINTS.register,
    toRegisterDto(payload),
  );
  return mapAuthUser(response.data.data);
}

export async function loginUser(payload: LoginPayload): Promise<AuthTokens> {
  const response = await axiosClient.post<ApiSuccessResponse<AuthTokensDto>>(
    AUTH_ENDPOINTS.login,
    toLoginDto(payload),
  );
  return mapAuthTokens(response.data.data);
}

export async function logoutUser(): Promise<void> {
  await axiosClient.post(AUTH_ENDPOINTS.logout);
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await axiosClient.get<ApiSuccessResponse<AuthUserDto>>(
    AUTH_ENDPOINTS.me,
  );
  return mapAuthUser(response.data.data);
}

export async function verifyEmailToken(token: string): Promise<string> {
  const response = await axiosClient.get<ApiSuccessResponse<{ message: string }>>(
    AUTH_ENDPOINTS.verifyEmail,
    {
      params: { token },
      headers: { Accept: "application/json" },
    },
  );
  return response.data.data.message;
}

export async function resendVerificationEmail(email: string): Promise<string> {
  const response = await axiosClient.post<
    ApiSuccessResponse<{ message: string }>
  >(AUTH_ENDPOINTS.resendVerification, { email });
  return response.data.data.message;
}

export async function refreshAuthToken(
  refreshToken: string,
): Promise<AuthTokens> {
  const response = await axiosClient.post<ApiSuccessResponse<AuthTokensDto>>(
    AUTH_ENDPOINTS.refreshToken,
    { refresh_token: refreshToken },
  );
  return mapAuthTokens(response.data.data);
}

export async function updateCurrentUserName(
  fullName: string,
): Promise<AuthUser> {
  const response = await axiosClient.patch<ApiSuccessResponse<AuthUserDto>>(
    AUTH_ENDPOINTS.me,
    { full_name: fullName },
  );
  return mapAuthUser(response.data.data);
}

export async function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<string> {
  const response = await axiosClient.patch<
    ApiSuccessResponse<{ message: string }>
  >(AUTH_ENDPOINTS.changePassword, {
    old_password: payload.oldPassword,
    new_password: payload.newPassword,
  });
  return response.data.data.message;
}
