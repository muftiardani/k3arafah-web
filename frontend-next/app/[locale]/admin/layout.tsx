"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, FileText, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  // Middleware handles protection, so we just assume if we are here, we are auth'd
  // OR the API will kick us out on 401.

  // Skip layout wrapper for login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await import("@/lib/api").then((mod) => mod.default.post("/auth/logout"));
    } catch (e) {
      console.error(e);
    }
    router.push("/admin/login");
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="bg-muted/40 hidden border-r md:block">
        <SidebarContent pathname={pathname} handleLogout={handleLogout} />
      </div>
      <div className="flex flex-col">
        <header className="bg-muted/40 flex h-14 items-center gap-4 border-b px-4 md:hidden lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SidebarContent pathname={pathname} handleLogout={handleLogout} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <span className="font-semibold">Admin Panel</span>
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
}: {
  pathname: string;
  handleLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="">K3 Arafah Admin</span>
        </Link>
      </div>
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        <Link
          href="/admin/dashboard"
          className={`hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            pathname === "/admin/dashboard" ? "bg-muted text-primary" : "text-muted-foreground"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/admin/registrants"
          className={`hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            pathname === "/admin/registrants" ? "bg-muted text-primary" : "text-muted-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          Data Santri
        </Link>
        <Link
          href="/admin/articles"
          className={`hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            pathname === "/admin/articles" ? "bg-muted text-primary" : "text-muted-foreground"
          }`}
        >
          <FileText className="h-4 w-4" />
          Berita / Artikel
        </Link>
      </nav>
      <div className="mt-auto p-4">
        <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
}
