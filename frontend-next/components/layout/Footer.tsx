"use client";

import { Link } from "@/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Facebook, Instagram, Youtube, MapPin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Tiktok = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export function Footer() {
  const pathname = usePathname();
  const t = useTranslations("Footer");

  // Hide Footer on admin pages
  if (pathname.includes("/admin") || pathname.includes("/dashboard")) {
    return null;
  }

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/k3_arafah/",
      color: "text-pink-500",
      hoverColor: "hover:bg-pink-600 hover:border-pink-500",
      label: "Instagram",
    },
    {
      icon: Facebook,
      href: "https://web.facebook.com/profile.php?id=100084823773688&locale=id_ID",
      color: "text-blue-600",
      hoverColor: "hover:bg-blue-600 hover:border-blue-500",
      label: "Facebook",
    },
    {
      icon: Tiktok,
      href: "https://www.tiktok.com/@komplek_arafah",
      color: "text-white",
      hoverColor: "hover:bg-black hover:border-zinc-700",
      label: "Tiktok",
    },
    {
      icon: Youtube,
      href: "https://www.youtube.com/@AlmunawwirKrapyak",
      color: "text-red-600",
      hoverColor: "hover:bg-red-600 hover:border-red-500",
      label: "Youtube",
    },
  ];

  const quickLinks = [
    { href: "/", label: t("link_home") },
    { href: "/about", label: t("link_about") },
    { href: "/programs", label: t("link_programs") },
    { href: "/articles", label: t("link_news") },
    { href: "/contact", label: t("link_contact") },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-emerald-900 bg-emerald-950 pt-20 pb-10">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-20">
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] animate-pulse rounded-full bg-emerald-400/20 blur-3xl filter transition-all duration-1000" />
        <div className="absolute top-[20%] -right-[10%] h-[400px] w-[400px] animate-pulse rounded-full bg-blue-400/20 blur-3xl filter transition-all delay-700 duration-1000" />
      </div>

      <div className="relative z-10 container px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6 lg:col-span-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <a
                  href="https://almunawwir.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-80"
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white p-2 shadow-sm backdrop-blur-sm">
                    <Image
                      src="/logo-almunawwir.png"
                      alt="Al-Munawwir Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </a>
                <Link href="/" className="transition-opacity hover:opacity-80">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white p-2 shadow-sm backdrop-blur-sm">
                    <Image
                      src="/logo-arafah.png"
                      alt="K3 Arafah Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
              </div>
            </div>
            <p className="max-w-md text-base leading-relaxed text-emerald-100/80">
              {t("description")}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  target="_blank"
                  aria-label={social.label}
                  className={cn(
                    "group relative flex h-10 w-10 items-center justify-center rounded-full border border-emerald-900 bg-emerald-900/50 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md",
                    social.hoverColor
                  )}
                >
                  <social.icon
                    className={cn(
                      "h-5 w-5 transition-transform group-hover:scale-110 group-hover:text-white",
                      social.color
                    )}
                  />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 lg:pl-8"
          >
            <h3 className="mb-6 text-lg font-bold text-white">{t("quick_links")}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-emerald-100/70 transition-all duration-300 hover:translate-x-2 hover:text-emerald-400"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-4"
          >
            <h3 className="mb-6 text-lg font-bold text-white">{t("contact_us")}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-100">{t("address_label")}</p>
                  <span className="text-sm leading-relaxed text-emerald-100/70">
                    {t("address_text")}
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-100">{t("email_label")}</p>
                  <span className="text-sm text-emerald-100/70">{t("email")}</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-emerald-900 pt-8 sm:flex-row"
        >
          <p className="text-sm text-emerald-100/50">
            &copy; {new Date().getFullYear()} {t("brand_name")}. {t("rights_reserved")}
          </p>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
