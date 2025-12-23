"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { StatsCard } from "@/components/admin/StatsCard";
import { FileText, UserCog, GraduationCap } from "lucide-react";

interface DashboardStats {
  total_santri: number;
  total_articles: number;
  total_users: number; // Placeholder
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted h-32 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Santri"
          value={stats?.total_santri || 0}
          icon={GraduationCap}
          description="Santri terdaftar"
        />
        <StatsCard
          title="Artikel Terbit"
          value={stats?.total_articles || 0}
          icon={FileText}
          description="Berita & Artikel"
        />
        <StatsCard
          title="Admin/Staff"
          value={stats?.total_users || 0}
          icon={UserCog}
          description="Total pengguna sistem"
        />
      </div>
    </div>
  );
}
