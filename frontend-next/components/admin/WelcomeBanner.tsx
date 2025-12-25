"use client";

import { useEffect, useState } from "react";

export function WelcomeBanner() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    // Get user from local storage
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user from local storage", e);
        }
      }
    }
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg">
      <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Selamat Datang, {user?.username || "Admin"}!</h1>
          <p className="mt-2 text-blue-100">
            Berikut adalah ringkasan aktivitas Pondok Pesantren hari ini.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium tracking-wider text-blue-100 uppercase">Hari ini</p>
          <p className="text-2xl font-bold">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Decorative Circle */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
    </div>
  );
}
