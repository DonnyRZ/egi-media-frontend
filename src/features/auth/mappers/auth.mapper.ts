import type {
  AuthTokens,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types/auth.types";

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

export function mapAuthUser(dto: AuthUserDto): AuthUser {
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.full_name,
    role: dto.role,
    loginProvider: dto.login_provider ?? null,
    emailVerifiedAt: dto.email_verified_at ?? null,
    lastLoginAt: dto.last_login_at ?? null,
  };
}

export function mapAuthTokens(dto: AuthTokensDto): AuthTokens {
  return {
    accessToken: dto.access_token,
    refreshToken: dto.refresh_token,
    tokenType: dto.token_type,
    expiresIn: dto.expires_in,
  };
}

export function toRegisterDto(payload: RegisterPayload) {
  return {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    full_name: payload.fullName.trim(),
  };
}

export function toLoginDto(payload: LoginPayload) {
  return {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  };
}
