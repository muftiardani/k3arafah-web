"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Menu,
  Images,
  GraduationCap,
  ShieldAlert,
  LucideIcon,
  ChevronRight,
  School,
  Mail,
  Video,
  Medal,
  Folder,
  Tag,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/lib/hooks/useAuth";

// Define menu item interface
interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  role?: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Dashboard.Nav");

  const pathname = usePathname();

  // Use Zustand store for consistent state management
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-slate-50/50 md:block dark:bg-slate-900/50">
        <SidebarContent pathname={pathname} handleLogout={handleLogout} user={user} />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-slate-50/50 px-4 md:hidden lg:h-[60px] lg:px-6 dark:bg-slate-900/50">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <SidebarContent pathname={pathname} handleLogout={handleLogout} user={user} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <span className="font-semibold">{t("dashboard")} - Admin</span>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  handleLogout,
  user,
}: {
  pathname: string;
  handleLogout: () => void;
  user: { id: number; username: string; role: string } | null;
}) {
  const t = useTranslations("Dashboard");

  const menuGroups: MenuGroup[] = [
    {
      title: t("Groups.main"),
      items: [
        {
          title: t("Nav.dashboard"),
          href: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: t("Groups.academic"),
      items: [
        {
          title: t("Nav.registrants"),
          href: "/registrants",
          icon: Users,
        },
        {
          title: t("Nav.students"),
          href: "/students",
          icon: GraduationCap,
        },
      ],
    },
    {
      title: t("Groups.content"),
      items: [
        {
          title: "Pesan Masuk",
          href: "/dashboard/messages",
          icon: Mail,
        },
        {
          title: t("Nav.articles"),
          href: "/dashboard/articles",
          icon: FileText,
        },
        {
          title: "Kategori",
          href: "/dashboard/categories",
          icon: Folder,
        },
        {
          title: "Tag",
          href: "/dashboard/tags",
          icon: Tag,
        },
        {
          title: t("Nav.achievements"),
          href: "/dashboard/achievements",
          icon: Medal,
        },
        {
          title: t("Nav.gallery"),
          href: "/gallery",
          icon: Images,
        },
        {
          title: t("Nav.videos"),
          href: "/dashboard/videos",
          icon: Video,
        },
      ],
    },
    {
      title: t("Groups.system"),
      items: [
        {
          title: t("Nav.users"),
          href: "/users",
          icon: ShieldAlert,
          role: "super_admin",
        },
        {
          title: "Activity Log",
          href: "/dashboard/activity-log",
          icon: Activity,
          role: "super_admin",
        },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-slate-950">
      {/* Header / Brand */}
      <div className="relative z-10 flex h-20 items-center px-6">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
            <School className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-foreground text-lg font-bold tracking-tight">K3 Arafah</span>
            <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 flex-1 space-y-8 overflow-y-auto px-4 py-4">
        <nav className="space-y-6">
          {menuGroups.map((group, index) => (
            <div key={index}>
              {group.items.some(
                (item) => !item.role || item.role === user?.role || user?.role === "super_admin"
              ) && (
                <h4 className="text-muted-foreground/50 mb-2 px-4 text-xs font-semibold tracking-wider uppercase">
                  {group.title}
                </h4>
              )}
              <div className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  if (item.role && item.role !== user?.role && user?.role !== "super_admin")
                    return null;

                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className={`group relative flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 ${
                        isActive
                          ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 dark:bg-white dark:text-slate-950 dark:shadow-white/5"
                          : "text-muted-foreground hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`h-5 w-5 transition-colors ${
                            isActive
                              ? "text-emerald-400 dark:text-emerald-600"
                              : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                          }`}
                        />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      {isActive && (
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Footer */}
      <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-950/5 dark:bg-slate-950 dark:ring-white/10">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-emerald-100 dark:border-slate-800 dark:ring-emerald-900/30">
            <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-600 font-bold text-white">
              {user?.username?.substring(0, 2).toUpperCase() || "AD"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-foreground truncate text-sm font-bold">
              {user?.username || "Admin"}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <p className="text-muted-foreground truncate text-xs font-medium capitalize">
                {user?.role ? t(("User." + user.role) as any) : t("User.admin")}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            className="text-muted-foreground h-8 w-8 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
            title={t("Nav.logout")}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
