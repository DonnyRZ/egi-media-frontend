"use client";

import { create } from "zustand";

import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/features/auth/services/auth.service";
import type {
  AuthTokens,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types/auth.types";
import {
  clearTokens,
  getAccessToken,
  setTokens,
} from "@/features/auth/utils/token-storage";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  setSession: (tokens: AuthTokens) => Promise<void>;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,

  hydrate: async () => {
    const token = getAccessToken();
    if (!token) {
      set({ user: null, isAuthenticated: false, isHydrated: true });
      return;
    }

    try {
      set({ isLoading: true });
      const user = await fetchCurrentUser();
      set({ user, isAuthenticated: true, isHydrated: true, isLoading: false });
    } catch {
      clearTokens();
      set({
        user: null,
        isAuthenticated: false,
        isHydrated: true,
        isLoading: false,
      });
    }
  },

  setSession: async (tokens) => {
    setTokens(tokens.accessToken, tokens.refreshToken);
    const user = await fetchCurrentUser();
    set({ user, isAuthenticated: true, isHydrated: true });
  },

  login: async (payload) => {
    const tokens = await loginUser(payload);
    await get().setSession(tokens);
  },

  register: async (payload) => {
    return registerUser(payload);
  },

  logout: async () => {
    try {
      if (getAccessToken()) {
        await logoutUser();
      }
    } catch {
      // Always clear local session even if API logout fails.
    } finally {
      get().clearSession();
    }
  },

  clearSession: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
  },
}));
