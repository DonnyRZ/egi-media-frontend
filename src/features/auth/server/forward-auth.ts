import { NextResponse } from "next/server";

import { env } from "@/shared/config/env";

export async function forwardAuthPatch(
  backendPath: string,
  authorization: string,
  body: string,
): Promise<NextResponse> {
  const response = await fetch(`${env.apiUrl}${backendPath}`, {
    method: "PATCH",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body,
    cache: "no-store",
  });

  const responseBody = await response.text();
  return new NextResponse(responseBody, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
