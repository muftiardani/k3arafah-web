import { BACKEND_API_URL } from "@/lib/config";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const res = await fetch(`${BACKEND_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error || "Login failed" },
        { status: res.status }
      );
    }

    const jsonResponse = await res.json();
    const token = jsonResponse.data?.token;

    if (!token) {
      throw new Error("Token not found in response");
    }

    // Set HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "strict",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login Proxy Error:", error);
    // console.log("Target API URL used:", apiUrl); // apiUrl is not in scope here, need to move it up or re-log if needed, but error log should suffice for fetch issues.
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
