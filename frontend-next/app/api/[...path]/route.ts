import { NextRequest, NextResponse } from "next/server";

import { BACKEND_API_URL } from "@/lib/config";

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  const path = params.path.join("/");
  const url = `${BACKEND_API_URL}/${path}${request.nextUrl.search}`;
  const token = request.cookies.get("token")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const body =
      request.method !== "GET" && request.method !== "HEAD" ? await request.text() : null;

    const res = await fetch(url, {
      method: request.method,
      headers: headers,
      body: body,
      cache: "no-store", // Prevent caching of proxy responses
    });

    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Proxy Error [${request.method} ${url}]:`, error);
    return NextResponse.json({ error: "Proxy Error" }, { status: 500 });
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE, proxy as PATCH };
