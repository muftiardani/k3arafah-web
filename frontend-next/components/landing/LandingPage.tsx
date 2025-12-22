"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
} from "lucide-react";

interface Article {
  id: number;
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
}

interface LandingPageProps {
  articles: Article[];
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function LandingPage({ articles }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-linear-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-slate-900 overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center space-y-4 text-center"
          >
            <motion.div variants={fadeIn} className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-emerald-800 dark:text-emerald-400">
                Pondok Pesantren K3 Arafah
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400">
                Mencetak Generasi Rabbani yang Unggul dalam Imtaq dan Iptek.
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="space-x-4">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 hover:scale-105 transition-transform"
              >
                <Link href="/psb">
                  Daftar Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="hover:scale-105 transition-transform"
              >
                <Link href="/#about">Pelajari Lebih Lanjut</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div
              variants={fadeIn}
              className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div className="p-4 bg-emerald-100 dark:bg-emerald-900 rounded-full shadow-lg">
                <BookOpen className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Kurikulum Terpadu</h3>
              <p className="text-muted-foreground">
                Memadukan kurikulum nasional dan kepesantrenan (Salaf & Khalaf).
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div className="p-4 bg-emerald-100 dark:bg-emerald-900 rounded-full shadow-lg">
                <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Pengajar Berkualitas</h3>
              <p className="text-muted-foreground">
                Diasuh oleh asatidz wal asatidzah lulusan terbaik dalam dan luar
                negeri.
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div className="p-4 bg-emerald-100 dark:bg-emerald-900 rounded-full shadow-lg">
                <GraduationCap className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Program Tahfidz</h3>
              <p className="text-muted-foreground">
                Program unggulan tahfidz Al-Qur&apos;an dengan metode mutqin.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* News Section */}
      <section id="berita" className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-10"
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-emerald-900 dark:text-emerald-100">
              Kabar Pesantren
            </h2>
            <p className="max-w-[700px] text-muted-foreground">
              Berita dan kegiatan terbaru dari Pondok Pesantren K3 Arafah.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {articles.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground">
                Belum ada berita terbaru.
              </p>
            ) : (
              articles
                .filter((a) => a.is_published)
                .map((article) => (
                  <motion.div
                    variants={fadeIn}
                    key={article.id}
                    className="group relative flex flex-col space-y-3 rounded-lg border bg-card p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-300"
                  >
                    <div className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.created_at).toLocaleDateString()}
                    </div>
                    <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.content}
                    </p>
                    {/* Link to detail page later */}
                  </motion.div>
                ))
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
