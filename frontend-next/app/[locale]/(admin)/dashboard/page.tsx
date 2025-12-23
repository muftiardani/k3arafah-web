"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { StatsCard } from "@/components/admin/StatsCard";
import {
  FileText,
  UserCog,
  GraduationCap,
  Users,
  ArrowRight,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  total_santri: number;
  total_articles: number;
  total_users: number;
}

interface Registrant {
  id: number;
  full_name: string;
  status: string;
  created_at: string;
  photo_url?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRegistrants, setRecentRegistrants] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    // Get user from local storage (mock implementation, ideally use a context)
    const storedUser = localStorage.getItem("user"); // Assuming you store user info
    if (storedUser) setUser(JSON.parse(storedUser));

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, registrantsRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/psb/registrants"),
      ]);

      setStats(statsRes.data.data);
      // Take top 5 recent registrants
      const registrants: Registrant[] = registrantsRes.data.data || [];
      const sorted = registrants.sort((a, b) => b.id - a.id).slice(0, 5);
      setRecentRegistrants(sorted);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
          >
            <Clock className="mr-1 h-3 w-3" /> Menunggu
          </Badge>
        );
      case "VERIFIED":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Terverifikasi
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            <GraduationCap className="mr-1 h-3 w-3" /> Diterima
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> Ditolak
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-2">
        <div className="bg-muted h-32 w-full animate-pulse rounded-xl" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted h-24 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
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

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Santri"
          value={stats?.total_santri || 0}
          icon={GraduationCap}
          description="Santri aktif"
        />
        <StatsCard
          title="Pendaftar Baru"
          value={recentRegistrants.length} // Rough estimate or separate API needed
          icon={Users}
          description="Perlu verifikasi"
        />
        <StatsCard
          title="Artikel Terbit"
          value={stats?.total_articles || 0}
          icon={FileText}
          description="Konten publikasi"
        />
        <StatsCard
          title="Admin System"
          value={stats?.total_users || 0}
          icon={UserCog}
          description="Pengelola aktif"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Recent Activity (Table) */}
        <Card className="md:col-span-4 lg:col-span-5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pendaftar Terbaru</CardTitle>
              <CardDescription>Calon santri yang baru mendaftar.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/registrants">
                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentRegistrants.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  Belum ada pendaftar terbaru.
                </div>
              ) : (
                recentRegistrants.map((registrant) => (
                  <div
                    key={registrant.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border">
                        {registrant.photo_url ? (
                          <AvatarImage src={registrant.photo_url} alt={registrant.full_name} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {registrant.full_name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm leading-none font-medium">{registrant.full_name}</p>
                        <p className="text-muted-foreground text-xs">
                          Daftar: {new Date(registrant.created_at).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div>{getStatusBadge(registrant.status)}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-3 lg:col-span-2">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Jalan pintas ke fitur yang sering digunakan.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button className="w-full justify-start" asChild>
              <Link href="/registrants">
                <Users className="mr-2 h-4 w-4" /> Verifikasi Pendaftar
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/articles?action=create">
                {" "}
                {/* Assuming we can handle param or just go to list */}
                <FileText className="mr-2 h-4 w-4" /> Tulis Artikel
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/gallery/create">
                <ImageIcon className="mr-2 h-4 w-4" /> Upload Galeri
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/students">
                <GraduationCap className="mr-2 h-4 w-4" /> Data Santri
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
