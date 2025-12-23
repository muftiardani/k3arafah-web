import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Outfit } from "next/font/google"; // Keep font here or in root?
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import "../globals.css"; // Uppercase dir ..

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

// Metadata needs to be generated or static
export const metadata = {
  title: "Pondok Pesantren K3 Arafah",
  description: "Web Resmi Pondok Pesantren K3 Arafah",
};
