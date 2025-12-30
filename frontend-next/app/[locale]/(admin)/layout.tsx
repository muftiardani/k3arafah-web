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
    <div className="flex h-full flex-col bg-slate-50/50 dark:bg-slate-950/50">
      {/* Header / Brand */}
      <div className="bg-background/50 sticky top-0 z-10 flex h-16 items-center border-b px-6 backdrop-blur-md">
        <Link
          href="/"
          className="text-foreground flex items-center gap-3 text-lg font-bold tracking-tight"
        >
          <div className="bg-primary shadow-primary/20 flex h-9 w-9 items-center justify-center rounded-lg shadow-sm transition-transform hover:scale-105">
            <School className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="from-primary to-primary/60 bg-linear-to-r bg-clip-text text-transparent">
            K3 Arafah
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent flex-1 space-y-8 overflow-auto py-6">
        <nav className="px-4 text-sm font-medium">
          {menuGroups.map((group, index) => (
            <div key={index} className="mb-6 last:mb-0">
              {group.items.some(
                (item) => !item.role || item.role === user?.role || user?.role === "super_admin"
              ) && (
                <h4 className="text-muted-foreground/60 mb-3 px-3 text-[10px] font-bold tracking-widest uppercase select-none">
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
                      className={`group relative flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-primary/20 font-semibold shadow-md"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                        />
                        <span>{item.title}</span>
                      </div>
                      {isActive && (
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
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
      <div className="bg-background/50 sticky bottom-0 z-10 mt-auto border-t p-4 backdrop-blur-md">
        <div className="bg-card flex items-center gap-3 rounded-xl border p-3 shadow-sm transition-all hover:shadow-md">
          <Avatar className="border-background ring-primary/10 h-10 w-10 border-2 ring-2">
            <AvatarFallback className="from-primary to-primary/60 text-primary-foreground bg-linear-to-br font-bold">
              {user?.username?.substring(0, 2).toUpperCase() || "AD"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-foreground truncate text-sm font-semibold">
              {user?.username || "Admin"}
            </p>
            <p className="text-muted-foreground flex items-center gap-1 truncate text-xs">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="capitalize">
                {user?.role ? t(("User." + user.role) as any) : t("User.admin")}
              </span>
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0"
            title={t("Nav.logout")}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
