"use client";

import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { useAuthStore } from "@/store/useAuthStore";

import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useTranslations("Navbar");
  const { isLoggedIn } = useAuthStore();
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  // Hide Navbar on admin pages
  if (pathname.includes("/admin") || pathname.includes("/dashboard")) {
    return null;
  }

  // Helper to remove locale from path for checking
  const pathWithoutLocale = pathname.replace(/^\/(id|en)/, "") || "/";

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
    <motion.header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out",
        isScrolled
          ? "border-b border-white/10 bg-white/80 py-2 shadow-sm backdrop-blur-md dark:bg-slate-950/80"
          : "bg-transparent py-4"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              className="relative flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/90 p-1 shadow-sm backdrop-blur-sm">
                <Image
                  src="/logo-arafah.png"
                  alt="K3 Arafah Logo"
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "hidden text-[11px] leading-none font-medium transition-colors duration-500 sm:inline-block",
                  isScrolled
                    ? "text-emerald-900 dark:text-emerald-50"
                    : "text-emerald-800 dark:text-white"
                )}
              >
                {t("brand_primary")}
              </span>
              <span className="hidden text-base leading-none font-bold text-emerald-600 sm:inline-block dark:text-emerald-400">
                {t("brand_secondary")}
              </span>
              <span
                className={cn(
                  "inline-block text-lg font-bold transition-colors duration-500 sm:hidden",
                  isScrolled
                    ? "text-emerald-900 dark:text-white"
                    : "text-emerald-800 dark:text-white"
                )}
              >
                {t("brand_short")}
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <div className="mr-4 flex items-center gap-1 rounded-full bg-white/50 px-2 py-1 shadow-sm backdrop-blur-sm dark:bg-slate-900/50">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-300"
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-900/50"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 transition-colors duration-300",
                      active
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop Language Switcher */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={
                  isScrolled
                    ? "text-emerald-900 dark:text-white"
                    : "text-emerald-800 dark:text-white"
                }
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={
                  isScrolled
                    ? "text-emerald-900 dark:text-white"
                    : "text-emerald-800 dark:text-white"
                }
              >
                <Link href="/login">{t("login")}</Link>
              </Button>
            )}
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              variant="default"
              size="sm"
              className="bg-emerald-600 px-6 font-semibold text-white shadow-emerald-200 hover:bg-emerald-700 hover:shadow-lg dark:shadow-none"
            >
              <Link href="/psb">{t("psb")}</Link>
            </Button>
          </motion.div>

          {/* Mobile Nav with Sheet */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 text-emerald-800 dark:text-white" />
                <span className="sr-only">{t("toggle_menu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l border-emerald-100 bg-white/80 p-0 shadow-2xl backdrop-blur-2xl sm:w-[400px] dark:border-emerald-900 dark:bg-gray-950/80"
            >
              <SheetTitle className="sr-only">{t("menu_sr")}</SheetTitle>

              {/* Decorative Gradient Background */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-[20%] -right-[20%] h-[400px] w-[400px] rounded-full bg-emerald-400/10 blur-3xl filter dark:bg-emerald-500/10" />
                <div className="absolute top-[20%] left-[0%] h-[300px] w-[300px] rounded-full bg-teal-400/10 blur-3xl filter dark:bg-teal-500/10" />
              </div>

              <div className="relative flex h-full flex-col p-6">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4 border-b border-emerald-100/50 pb-6 dark:border-white/5">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-emerald-500 shadow-md">
                    <Image src="/logo.png" alt="Logo" fill className="object-cover" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">
                      {t("brand_short")}
                    </h2>
                    <p className="text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80">
                      {t("mobile_menu_desc")}
                    </p>
                  </div>
                </div>

                {/* Links */}
                <nav className="flex flex-1 flex-col gap-2">
                  {navLinks.map((link, i) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "group relative flex items-center overflow-hidden rounded-xl px-4 py-3.5 text-base font-medium transition-all",
                            active
                              ? "bg-emerald-50/80 text-emerald-700 shadow-sm ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800"
                              : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                          )}
                        >
                          {/* Active Indicator Bar */}
                          {active && (
                            <motion.div
                              layoutId="active-nav-mobile"
                              className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-500"
                            />
                          )}

                          <span className={cn("relative z-10", active ? "font-bold" : "")}>
                            {link.label}
                          </span>

                          {/* Arrow Icon on Active/Hover */}
                          <motion.span
                            className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
                            animate={{ opacity: active ? 1 : undefined }}
                          >
                            <div className="text-emerald-400 dark:text-emerald-500">→</div>
                          </motion.span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="mt-auto space-y-4 pt-6">
                  <div className="flex items-center justify-between rounded-xl border border-emerald-100/50 bg-white/50 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                    <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      {t("language")}
                    </span>
                    <LanguageSwitcher />
                  </div>
                  <p className="text-center text-xs text-gray-400 dark:text-gray-600">
                    © {new Date().getFullYear()} {t("brand_short")}
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
