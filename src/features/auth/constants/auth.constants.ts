export const AUTH_ENDPOINTS = {
  register: "/api/v1/auth/register",
  login: "/api/v1/auth/login",
  logout: "/api/v1/auth/logout",
  refreshToken: "/api/v1/auth/refresh-token",
  me: "/api/v1/auth/me",
  changePassword: "/api/v1/auth/change-password",
  verifyEmail: "/api/v1/auth/verify-email",
  resendVerification: "/api/v1/auth/resend-verification",
  google: "/api/v1/auth/google",
} as const;

export const AUTH_PROXY_ENDPOINTS = {
  me: "/api/auth/me",
  changePassword: "/api/auth/change-password",
} as const;

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
