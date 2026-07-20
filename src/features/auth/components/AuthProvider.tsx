"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/features/auth/stores/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
