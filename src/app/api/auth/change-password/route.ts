import type { NextRequest } from "next/server";

import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { forwardAuthPatch } from "@/features/auth/server/forward-auth";

export async function PATCH(request: NextRequest) {
  const authorization = request.headers.get("authorization") ?? "";
  const body = await request.text();
  return forwardAuthPatch(AUTH_ENDPOINTS.changePassword, authorization, body);
}
