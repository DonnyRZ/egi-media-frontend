import { NextResponse } from "next/server";

import { env } from "@/shared/config/env";

export async function forwardNotificationPatch(
  backendPath: string,
  authorization: string,
): Promise<NextResponse> {
  const response = await fetch(`${env.apiUrl}${backendPath}`, {
    method: "PATCH",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
