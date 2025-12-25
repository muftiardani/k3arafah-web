"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const pathname = usePathname();
  const t = useTranslations("Footer");

  // Hide Footer on admin pages
  if (pathname.includes("/admin") || pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <footer className="border-t bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="container px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {/* Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-emerald-100 dark:border-emerald-800">
                <Image src="/logo.png" alt="K3 Arafah Logo" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-50">K3 Arafah</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{t("description")}</p>
            <div className="flex gap-4 pt-2">
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white p-2 text-emerald-600 shadow-sm transition-colors hover:bg-emerald-600 hover:text-white dark:bg-slate-900 dark:text-emerald-500"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white p-2 text-blue-600 shadow-sm transition-colors hover:bg-blue-600 hover:text-white dark:bg-slate-900 dark:text-blue-500"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white p-2 text-red-600 shadow-sm transition-colors hover:bg-red-600 hover:text-white dark:bg-slate-900 dark:text-red-500"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              {t("quick_links")}
            </h3>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-2 transition-colors hover:text-emerald-600"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {t("link_home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-2 transition-colors hover:text-emerald-600"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {t("link_about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="flex items-center gap-2 transition-colors hover:text-emerald-600"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {t("link_programs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/psb"
                  className="flex items-center gap-2 transition-colors hover:text-emerald-600"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {t("link_psb")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 transition-colors hover:text-emerald-600"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {t("link_contact")}
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              {t("contact_us")}
            </h3>
            <ul className="text-muted-foreground space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <span className="leading-relaxed">{t("address_text")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-emerald-600" />
                <span>
                  {t("phone")} {t("admin_psb")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-emerald-600" />
                <span>{t("email")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-12 border-t border-slate-200 pt-8 text-center text-sm dark:border-slate-800">
          <p>
            &copy; {new Date().getFullYear()} {t("rights_reserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
