"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils/date";

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
    <div className="relative overflow-hidden rounded-xl bg-slate-950 p-8 text-white shadow-lg">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/2 -right-1/2 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-1/2 -left-1/2 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl"
        />
      </div>

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">
              {greeting}, <span className="text-indigo-400">{user?.username || "Admin"}</span>!
            </h1>
            <p className="mt-2 max-w-lg text-slate-400">
              Semoga harimu menyenangkan. Berikut adalah ringkasan aktivitas sistem hari ini.
            </p>
          </motion.div>
        </div>
        <div className="text-right">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="inline-block rounded-full bg-white/5 px-3 py-1 text-xs font-medium tracking-wider text-indigo-300 uppercase backdrop-blur-sm">
              Hari ini
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight">
              {formatDate(new Date(), "full").split(",")[0]}, {new Date().getDate()}
            </p>
            <p className="text-sm text-slate-500">
              {new Date().toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
