import { NextRequest, NextResponse } from "next/server";

import { BACKEND_API_URL } from "@/lib/config";

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  const path = params.path.join("/");
  const url = `${BACKEND_API_URL}/${path}${request.nextUrl.search}`;

  // Forward all necessary headers including Cookies
  const headers = new Headers(request.headers);
  headers.set("Content-Type", "application/json");
  // Important: Remove 'host' header to avoid conflicts
  headers.delete("host");

  try {
    const body =
      request.method !== "GET" && request.method !== "HEAD" ? await request.text() : null;

    const res = await fetch(url, {
      method: request.method,
      headers: headers,
      body: body,
      cache: "no-store",
    });

    const data = await res.text();

    const response = new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Forward 'Set-Cookie' header from backend to client
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("Set-Cookie", setCookie);
    }

    // Forward X-Request-ID if present
    const requestId = res.headers.get("x-request-id");
    if (requestId) {
      response.headers.set("X-Request-ID", requestId);
    }

    return response;
  } catch (error) {
    console.error(`Proxy Error [${request.method} ${url}]:`, error);
    return NextResponse.json({ error: "Proxy Error" }, { status: 500 });
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE, proxy as PATCH };
