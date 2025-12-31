"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";

export function WelcomeBanner() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [greeting, setGreeting] = useState("Selamat Datang");

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

      // Set dynamic greeting
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setGreeting("Selamat Pagi");
      else if (hour >= 12 && hour < 15) setGreeting("Selamat Siang");
      else if (hour >= 15 && hour < 18) setGreeting("Selamat Sore");
      else setGreeting("Selamat Malam");
    }
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-8 text-white shadow-xl shadow-slate-900/10">
      {/* Rich Themes Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-950 via-slate-950 to-zinc-950" />

        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -right-[10%] h-[400px] w-[400px] rounded-full bg-emerald-500/20 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] -left-[10%] h-[300px] w-[300px] rounded-full bg-blue-600/15 blur-[80px]"
        />

        {/* Noise Texture */}
        <div className="mixed-blend-overlay absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

        {/* Islamic Geometric Pattern Overlay (Optional - kept subtle) */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-1.5 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-sm font-medium tracking-wide text-emerald-300/90 uppercase">
                Dashboard Admin
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {greeting},{" "}
              <span className="bg-linear-to-r from-emerald-200 to-teal-100 bg-clip-text text-transparent">
                {user?.username || "Admin"}
              </span>
            </h1>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-slate-400">
              Siap untuk mengelola data hari ini? Berikut ringkasan aktivitas terbaru sistem K3
              Arafah.
            </p>
          </motion.div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/20 text-emerald-300">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
              Tanggal Hari Ini
            </p>
            <p className="text-lg font-semibold tracking-tight text-white">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
