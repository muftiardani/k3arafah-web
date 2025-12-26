"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

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
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = async () => {
    try {
      await import("@/lib/api").then((mod) => mod.default.post("/logout"));
    } catch (e) {
      console.error(e);
    }
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
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
  user: { username: string; role: string } | null;
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
          title: t("Nav.students"),
          href: "/students",
          icon: GraduationCap,
        },
        {
          title: t("Nav.registrants"),
          href: "/registrants",
          icon: Users,
        },
      ],
    },
    {
      title: t("Groups.content"),
      items: [
        {
          title: t("Nav.articles"),
          href: "/dashboard/articles",
          icon: FileText,
        },
        {
          title: t("Nav.gallery"),
          href: "/gallery",
          icon: Images,
        },
        {
          title: "Pesan Masuk",
          href: "/dashboard/messages",
          icon: Mail,
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
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header / Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="text-primary flex items-center gap-2 text-lg font-bold">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <School className="text-primary h-5 w-5" />
          </div>
          <span>K3 Arafah</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-6 px-4 text-sm font-medium">
          {menuGroups.map((group, index) => (
            <div key={index} className="space-y-1">
              {group.items.some(
                (item) => !item.role || item.role === user?.role || user?.role === "super_admin"
              ) && (
                <h4 className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-wider uppercase">
                  {group.title}
                </h4>
              )}
              {group.items.map((item, itemIndex) => {
                // Filter based on role if specified
                if (item.role && item.role !== user?.role && user?.role !== "super_admin")
                  return null;

                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className={`group hover:bg-accent hover:text-accent-foreground flex items-center justify-between rounded-md px-3 py-2 transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                      {item.title}
                    </div>
                    {isActive && <ChevronRight className="h-3 w-3 opacity-50" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* User Footer */}
      <div className="mt-auto border-t p-4">
        <div className="mb-4 flex items-center gap-3 px-2">
          <Avatar className="h-9 w-9 cursor-pointer border">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user?.username?.substring(0, 2).toUpperCase() || "AD"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user?.username || "Admin"}</p>
            <p className="text-muted-foreground truncate text-xs capitalize">
              {user?.role ? t(("User." + user.role) as any) : t("User.admin")}
            </p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="destructive"
          size="sm"
          className="w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" /> {t("Nav.logout")}
        </Button>
      </div>
    </div>
  );
}
