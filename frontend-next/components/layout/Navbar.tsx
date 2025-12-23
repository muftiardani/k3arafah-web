"use client";

import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../LanguageSwitcher";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navbar");

  return (
    <header className="border-border/40 bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="hidden text-xl font-bold sm:inline-block">
              Pondok Pesantren K3 Arafah
            </span>
            <span className="inline-block text-xl font-bold sm:hidden">Pondok Arafah</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground flex items-center text-sm font-medium transition-colors"
          >
            {t("home")}
          </Link>
          <Link
            href="/#about"
            className="text-muted-foreground hover:text-foreground flex items-center text-sm font-medium transition-colors"
          >
            {t("about")}
          </Link>
          <Link
            href="/#berita"
            className="text-muted-foreground hover:text-foreground flex items-center text-sm font-medium transition-colors"
          >
            {t("news")}
          </Link>
          <LanguageSwitcher />
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="default" size="sm">
            <Link href="/psb">{t("psb")}</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="bg-background border-b md:hidden">
          <div className="container flex flex-col gap-4 px-4 py-4">
            <Link
              href="/"
              className="hover:text-foreground text-sm font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t("home")}
            </Link>
            <Link
              href="/#about"
              className="hover:text-foreground text-sm font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t("about")}
            </Link>
            <Link
              href="/#berita"
              className="hover:text-foreground text-sm font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t("news")}
            </Link>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bahasa</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
