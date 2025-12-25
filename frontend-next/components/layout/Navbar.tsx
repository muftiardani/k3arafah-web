"use client";

import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  // Hide Navbar on admin pages
  if (pathname.includes("/admin") || pathname.includes("/dashboard")) {
    return null;
  }

  // Helper to determining active state
  // Helper to remove locale from path for checking
  const pathWithoutLocale = pathname.replace(/^\/(id|en|ar)/, "") || "/";

  const isActive = (href: string) => {
    if (href === "/" && pathWithoutLocale === "/") return true;
    if (href !== "/" && pathWithoutLocale.startsWith(href)) return true;
    return false;
  };

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/programs", label: t("programs") },
    { href: "/articles", label: t("news") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="border-border/40 bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-emerald-100 dark:border-emerald-800">
              <Image
                src="/logo.png"
                alt="K3 Arafah Logo"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="flex flex-col">
              <span className="hidden text-lg leading-none font-bold text-emerald-900 sm:inline-block dark:text-emerald-50">
                Pondok Pesantren
              </span>
              <span className="hidden text-sm leading-none font-medium text-emerald-600 sm:inline-block dark:text-emerald-400">
                K3 Arafah
              </span>
              <span className="inline-block text-lg font-bold text-emerald-900 sm:hidden dark:text-emerald-50">
                K3 Arafah
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "font-bold text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="default"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Link href="/psb">{t("psb")}</Link>
          </Button>

          {/* Mobile Nav with Sheet */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-emerald-100 dark:border-emerald-800">
                    <Image
                      src="/logo.png"
                      alt="K3 Arafah Logo"
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  <span className="text-emerald-600">K3 Arafah</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`rounded-md px-2 py-1 text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                          : "hover:bg-muted hover:text-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto border-t pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bahasa</span>
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
