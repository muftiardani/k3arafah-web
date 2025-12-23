import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Outfit } from "next/font/google"; // Keep font here or in root?
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import "../globals.css"; // Uppercase dir ..
import { GlobalLoader } from "@/components/global-loader";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function LocaleLayout({
  children,
  params, // params is a Promise in Next 15! function LocaleLayout(context) { const {locale} = await context.params }
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!["id", "en", "ar"].includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`${outfit.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <GlobalLoader />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://k3arafah.com"), // Ganti dengan domain asli nanti
  title: {
    default: "Pondok Pesantren K3 Arafah",
    template: "%s | K3 Arafah",
  },
  description:
    "Web Resmi Pondok Pesantren K3 Arafah - Membangun Generasi Qur'ani yang Berakhlak Mulia",
  keywords: ["Pesantren", "K3 Arafah", "Pondok", "Islam", "Pendidikan", "Santri"],
  authors: [{ name: "Pondok Pesantren K3 Arafah" }],
  creator: "Tim IT K3 Arafah",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://k3arafah.com",
    title: "Pondok Pesantren K3 Arafah",
    description: "Membangun Generasi Qur'ani yang Berakhlak Mulia",
    siteName: "Pondok Pesantren K3 Arafah",
    images: [
      {
        url: "/og-image.jpg", // Pastikan file ini ada di public nanti
        width: 1200,
        height: 630,
        alt: "Pondok Pesantren K3 Arafah",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pondok Pesantren K3 Arafah",
    description: "Membangun Generasi Qur'ani yang Berakhlak Mulia",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};
