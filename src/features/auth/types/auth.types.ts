export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  loginProvider: string | null;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
