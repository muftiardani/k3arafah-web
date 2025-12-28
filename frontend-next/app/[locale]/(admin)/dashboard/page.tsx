import { cookies } from "next/headers";
import { WelcomeBanner } from "@/components/admin/WelcomeBanner";
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
          <Card className="h-full border-none bg-white/50 shadow-lg backdrop-blur-sm dark:bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">{t("Registrants.title")}</CardTitle>
                <CardDescription>{t("Registrants.description")}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10"
                asChild
              >
                <Link href="/registrants" className="group">
                  {t("Registrants.view_all")}{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRegistrants.length === 0 ? (
                  <div className="text-muted-foreground bg-muted/30 flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
                    <Users className="mb-3 h-10 w-10 opacity-20" />
                    <p>{t("Registrants.empty")}</p>
                  </div>
                ) : (
                  recentRegistrants.map((registrant) => (
                    <div
                      key={registrant.id}
                      className="group/item flex items-center justify-between rounded-xl border border-transparent p-3 transition-all duration-200 hover:scale-[1.01] hover:bg-white hover:shadow-md dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-2 ring-slate-100 dark:border-slate-800 dark:ring-slate-800">
                          {registrant.photo_url ? (
                            <AvatarImage
                              src={registrant.photo_url}
                              alt={registrant.full_name}
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-500 font-bold text-white">
                              {registrant.full_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-foreground group-hover/item:text-primary text-sm leading-none font-semibold transition-colors">
                            {registrant.full_name}
                          </p>
                          <p className="text-muted-foreground flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            {t("Registrants.registered_on", {
                              date: new Date(registrant.created_at).toLocaleDateString(
                                locale === "en" ? "en-US" : "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              ),
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="scale-90">{getStatusBadge(registrant.status)}</div>
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
            <CardHeader className="px-0 pt-0 pb-1">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <CheckCircle2 className="text-primary h-5 w-5" />
                  {t("Actions.title")}
                </CardTitle>
                <CardDescription>{t("Actions.description")}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 p-0">
              <Button
                variant="outline"
                className="group h-auto w-full justify-start gap-4 border-none bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:bg-slate-900"
                asChild
              >
                <Link href="/dashboard/messages">
                  <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="text-base font-bold">Cek Pesan Masuk</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="group h-auto w-full justify-start gap-4 border-none bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:bg-slate-900"
                asChild
              >
                <Link href="/registrants">
                  <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-base font-bold">{t("Actions.verify_registrants")}</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="group h-auto w-full justify-start gap-4 border-none bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:bg-slate-900"
                asChild
              >
                <Link href="/dashboard/articles/create">
                  <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-base font-bold">{t("Actions.write_article")}</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="group h-auto w-full justify-start gap-4 border-none bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:bg-slate-900"
                asChild
              >
                <Link href="/dashboard/achievements">
                  <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                    <Medal className="h-5 w-5" />
                  </div>
                  <span className="text-base font-bold">Kelola Prestasi</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
