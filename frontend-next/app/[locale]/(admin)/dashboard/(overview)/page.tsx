import { cookies } from "next/headers";
import { WelcomeBanner } from "@/components/admin/WelcomeBanner";
import { StatsCard } from "@/components/admin/StatsCard";
import {
  FileText,
  UserCog,
  GraduationCap,
  Users,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
  Medal,
} from "lucide-react";
import { getTranslations } from "next-intl/server"; // Server Component Translation

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BACKEND_API_URL } from "@/lib/config";
import { formatDate } from "@/lib/utils/date";

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

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const headers = {
    Cookie: `auth_token=${token}`,
  };

  try {
    const [statsRes, registrantsRes] = await Promise.all([
      fetch(`${BACKEND_API_URL}/dashboard/stats`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${BACKEND_API_URL}/psb/registrants`, {
        headers,
        cache: "no-store",
      }),
    ]);

    const statsData = statsRes.ok ? await statsRes.json() : { data: {} };
    const registrantsData = registrantsRes.ok ? await registrantsRes.json() : { data: [] };

    return {
      stats: statsData.data as DashboardStats,
      registrants: (registrantsData.data as Registrant[]) || [],
    };
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return {
      stats: { total_santri: 0, total_articles: 0, total_users: 0 },
      registrants: [],
    };
  }
}

// Need to accept params for locale in Server Component
type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  // NOTE: getDashboardData is independent of locale unless backend supports it.
  // We assume backend data is raw/neutral or handle basic translation here.
  const { stats, registrants } = await getDashboardData();
  const recentRegistrants = registrants.sort((a, b) => b.id - a.id).slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
          >
            <Clock className="mr-1 h-3 w-3" /> {t("Status.pending")}
          </Badge>
        );
      case "VERIFIED":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
            <CheckCircle2 className="mr-1 h-3 w-3" /> {t("Status.verified")}
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            <GraduationCap className="mr-1 h-3 w-3" /> {t("Status.accepted")}
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> {t("Status.rejected")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner (Client Component) */}
      <WelcomeBanner />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("Stats.total_students")}
          value={stats?.total_santri || 0}
          icon={GraduationCap}
          description={t("Stats.active_students")}
          variant="green"
        />
        <StatsCard
          title={t("Stats.new_registrants")}
          value={recentRegistrants.length}
          icon={Users}
          description={t("Stats.need_verification")}
          variant="orange"
        />
        <StatsCard
          title={t("Stats.published_articles")}
          value={stats?.total_articles || 0}
          icon={FileText}
          description={t("Stats.publications")}
          variant="blue"
        />
        <StatsCard
          title={t("Stats.admin_system")}
          value={stats?.total_users || 0}
          icon={UserCog}
          description={t("Stats.active_managers")}
          variant="purple"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content: Recent Registrants */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="h-full overflow-hidden border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-slate-950 dark:shadow-black/20">
            {/* Decorative Header Background */}
            <div className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 opacity-20 blur-3xl" />

            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold tracking-tight">
                  {t("Registrants.title")}
                </CardTitle>
                <CardDescription className="text-base">
                  {t("Registrants.description")}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-primary bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors"
                asChild
              >
                <Link href="/registrants" className="group">
                  {t("Registrants.view_all")}{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="relative z-10 pt-2">
              <div className="space-y-3">
                {recentRegistrants.length === 0 ? (
                  <div className="text-muted-foreground flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                      <Users className="h-8 w-8 opacity-40" />
                    </div>
                    <p className="font-medium">{t("Registrants.empty")}</p>
                    <p className="text-sm opacity-70">Belum ada data pendaftar baru.</p>
                  </div>
                ) : (
                  recentRegistrants.map((registrant) => (
                    <div
                      key={registrant.id}
                      className="group/item flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-100 hover:bg-white hover:shadow-lg hover:shadow-indigo-100/20 dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:border-indigo-900/50 dark:hover:bg-slate-900 dark:hover:shadow-black/40"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-2 ring-zinc-100 transition-transform group-hover/item:scale-105 dark:border-slate-800 dark:ring-slate-800">
                          {registrant.photo_url ? (
                            <AvatarImage
                              src={registrant.photo_url}
                              alt={registrant.full_name}
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-inner">
                              {registrant.full_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="space-y-1.5">
                          <p className="text-foreground text-sm leading-none font-semibold tracking-tight transition-colors group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400">
                            {registrant.full_name}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="h-5 border-zinc-200 bg-white/50 px-1.5 text-[10px] font-medium dark:border-zinc-700 dark:bg-slate-900"
                            >
                              ID: #{registrant.id}
                            </Badge>
                            <p className="text-muted-foreground flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3" />
                              <span className="text-[11px] font-medium opacity-80">
                                {formatDate(registrant.created_at)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="scale-95 transition-transform group-hover/item:scale-100">
                        {getStatusBadge(registrant.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Quick Actions */}
        <div className="space-y-6">
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="px-0 pt-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                  <div className="bg-primary/10 rounded-lg p-1.5">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                  </div>
                  {t("Actions.title")}
                </CardTitle>
                <CardDescription>{t("Actions.description")}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 p-0">
              <Button
                variant="outline"
                className="group relative h-auto w-full justify-start gap-4 overflow-hidden rounded-2xl border-zinc-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md dark:border-zinc-800 dark:bg-slate-950 dark:hover:border-purple-900"
                asChild
              >
                <Link href="/dashboard/messages">
                  <div className="absolute inset-0 bg-linear-to-r from-purple-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-purple-900/10" />
                  <div className="relative z-10 rounded-xl bg-purple-100 p-2.5 text-purple-600 shadow-sm dark:bg-purple-900/30 dark:text-purple-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="relative z-10 text-left">
                    <span className="text-foreground block text-base font-bold">
                      Cek Pesan Masuk
                    </span>
                    <span className="text-muted-foreground text-xs font-medium">
                      Lihat pesan dari pengunjung
                    </span>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="group relative h-auto w-full justify-start gap-4 overflow-hidden rounded-2xl border-zinc-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md dark:border-zinc-800 dark:bg-slate-950 dark:hover:border-orange-900"
                asChild
              >
                <Link href="/registrants">
                  <div className="absolute inset-0 bg-linear-to-r from-orange-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-orange-900/10" />
                  <div className="relative z-10 rounded-xl bg-orange-100 p-2.5 text-orange-600 shadow-sm dark:bg-orange-900/30 dark:text-orange-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="relative z-10 text-left">
                    <span className="text-foreground block text-base font-bold">
                      {t("Actions.verify_registrants")}
                    </span>
                    <span className="text-muted-foreground text-xs font-medium">
                      Verifikasi data santri baru
                    </span>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="group relative h-auto w-full justify-start gap-4 overflow-hidden rounded-2xl border-zinc-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-zinc-800 dark:bg-slate-950 dark:hover:border-blue-900"
                asChild
              >
                <Link href="/dashboard/articles/create">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-900/10" />
                  <div className="relative z-10 rounded-xl bg-blue-100 p-2.5 text-blue-600 shadow-sm dark:bg-blue-900/30 dark:text-blue-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="relative z-10 text-left">
                    <span className="text-foreground block text-base font-bold">
                      {t("Actions.write_article")}
                    </span>
                    <span className="text-muted-foreground text-xs font-medium">
                      Buat konten artikel baru
                    </span>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="group relative h-auto w-full justify-start gap-4 overflow-hidden rounded-2xl border-zinc-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow-200 hover:shadow-md dark:border-zinc-800 dark:bg-slate-950 dark:hover:border-yellow-900"
                asChild
              >
                <Link href="/dashboard/achievements">
                  <div className="absolute inset-0 bg-linear-to-r from-yellow-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-yellow-900/10" />
                  <div className="relative z-10 rounded-xl bg-yellow-100 p-2.5 text-yellow-600 shadow-sm dark:bg-yellow-900/30 dark:text-yellow-400">
                    <Medal className="h-5 w-5" />
                  </div>
                  <div className="relative z-10 text-left">
                    <span className="text-foreground block text-base font-bold">
                      Kelola Prestasi
                    </span>
                    <span className="text-muted-foreground text-xs font-medium">
                      Update data prestasi santri
                    </span>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
