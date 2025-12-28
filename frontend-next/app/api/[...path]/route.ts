import { NextRequest, NextResponse } from "next/server";

import { SERVER_API_URL, BACKEND_API_URL } from "@/lib/config";

// Use server-side URL (not the public one) for the proxy
const API_BASE = SERVER_API_URL || BACKEND_API_URL || "http://localhost:8080/api";

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  const path = params.path.join("/");
  const url = `${API_BASE}/${path}${request.nextUrl.search}`;

  // Forward all necessary headers including Cookies
  const headers = new Headers(request.headers);

  // Important: Remove 'host' header to avoid conflicts
  headers.delete("host");

  // Check if this is a multipart form request
  const contentType = request.headers.get("content-type") || "";
  const isMultipart = contentType.includes("multipart/form-data");

  try {
    let body: BodyInit | null = null;

    if (request.method !== "GET" && request.method !== "HEAD") {
      if (isMultipart) {
        // For multipart, pass the raw body and preserve Content-Type header
        body = await request.arrayBuffer();
      } else {
        // For JSON and other content types
        body = await request.text();
        // Only set Content-Type to JSON for non-multipart requests
        if (!contentType) {
          headers.set("Content-Type", "application/json");
        }
      }
    }

    const res = await fetch(url, {
      method: request.method,
      headers: headers,
      body: body,
      cache: "no-store",
    });

    const data = await res.text();

    // Determine response content type from backend response
    const resContentType = res.headers.get("content-type") || "application/json";

    const response = new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": resContentType,
      },
    });

    // Forward 'Set-Cookie' header from backend to client
    // Handle multiple Set-Cookie headers correctly
    // Next.js/Node fetch API might merge them or provide an API to get them all
    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      // If there are multiple cookies, we need to set them individually on the response
      // However, NextResponse headers.set() might overwrite or merge.
      // The correct way in Next.js is often to iterate if possible or pass it through.

      // Attempt to get raw headers if possible, or split by comma if safe (split is risky for dates)
      // fetch API in Node 18+ has getSetCookie() method
      // @ts-ignore - getSetCookie is available in newer node environments
      if (typeof res.headers.getSetCookie === "function") {
        // @ts-ignore
        const cookies = res.headers.getSetCookie();
        cookies.forEach((cookie) => {
          response.headers.append("Set-Cookie", cookie);
        });
      } else {
        response.headers.set("Set-Cookie", setCookieHeader);
      }
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
