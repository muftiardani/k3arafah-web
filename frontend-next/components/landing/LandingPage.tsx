"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { ArrowRight, BookOpen, GraduationCap, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

import { Article } from "@/lib/services/articleService";

import { Gallery } from "@/lib/services/galleryService";
import Image from "next/image";

interface LandingPageProps {
  articles: Article[];
  galleries: Gallery[]; // Add galleries prop
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

export default function LandingPage({ articles, galleries }: LandingPageProps) {
  const tHero = useTranslations("Hero");
  const tPrograms = useTranslations("Programs");
  const tStats = useTranslations("Stats");
  const tHome = useTranslations("Home");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-green-50 to-emerald-100 py-20 md:py-32 dark:from-green-950 dark:to-slate-900">
        <div className="relative z-10 container px-4 md:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center space-y-4 text-center"
          >
            <motion.div variants={fadeIn} className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter text-emerald-800 sm:text-4xl md:text-5xl lg:text-6xl/none dark:text-emerald-400">
                {tHero("title")}
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400">
                {tHero("subtitle")}
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="space-x-4">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 transition-transform hover:scale-105 hover:bg-emerald-700"
              >
                <Link href="/psb">
                  {tHero("cta_primary")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="transition-transform hover:scale-105"
              >
                <Link href="/#about">{tHero("cta_secondary")}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Pattern */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
          <div className="animate-blob absolute top-0 left-0 h-64 w-64 rounded-full bg-emerald-400 mix-blend-multiply blur-3xl filter"></div>
          <div className="animate-blob animation-delay-2000 absolute top-0 right-0 h-64 w-64 rounded-full bg-green-400 mix-blend-multiply blur-3xl filter"></div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-emerald-600 py-12 text-white dark:bg-emerald-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <div className="text-4xl font-bold md:text-5xl">500+</div>
              <div className="text-emerald-100">{tStats("students")}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-2"
            >
              <div className="text-4xl font-bold md:text-5xl">50+</div>
              <div className="text-emerald-100">{tStats("teachers")}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-2"
            >
              <div className="text-4xl font-bold md:text-5xl">1k+</div>
              <div className="text-emerald-100">{tStats("alumni")}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-2"
            >
              <div className="text-4xl font-bold md:text-5xl">15</div>
              <div className="text-emerald-100">{tStats("years")}</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Educational Programs Section */}
      <section id="program" className="bg-background py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-emerald-900 md:text-4xl dark:text-emerald-100">
              {tPrograms("title")}
            </h2>
            <p className="text-muted-foreground mt-4">{tPrograms("subtitle")}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* Program Al-Qur'an */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl border bg-linear-to-br from-emerald-50 to-white p-8 shadow-sm transition-all hover:shadow-lg dark:from-emerald-950 dark:to-slate-900"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-100 opacity-50 blur-2xl dark:bg-emerald-900"></div>

              <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-emerald-100 p-4 dark:bg-emerald-900">
                  <BookOpen className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {tPrograms("quran_title")}
                </h3>
                <p className="text-muted-foreground">{tPrograms("quran_desc")}</p>
                <ul className="mt-4 space-y-2 text-start text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-emerald-500" /> Target Hafalan Lancar
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-emerald-500" /> Ujian Tasmi&apos; Berkala
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-emerald-500" /> Bersanad Riwayat Hafs
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Program Kitab */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl border bg-linear-to-br from-amber-50 to-white p-8 shadow-sm transition-all hover:shadow-lg dark:from-amber-950/30 dark:to-slate-900"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-amber-100 opacity-50 blur-2xl dark:bg-amber-900"></div>

              <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-amber-100 p-4 dark:bg-amber-900">
                  <GraduationCap className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                  {tPrograms("kitab_title")}
                </h3>
                <p className="text-muted-foreground">{tPrograms("kitab_desc")}</p>
                <ul className="mt-4 space-y-2 text-start text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-amber-500" /> Metode Sorogan & Bandongan
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-amber-500" /> Bahtsul Masail Rutin
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-amber-500" /> Penguasaan Bahasa Arab
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-muted/50 py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-emerald-900 md:text-4xl dark:text-emerald-100">
              {tHome("gallery_title")}
            </h2>
            <p className="text-muted-foreground mt-2">{tHome("gallery_desc")}</p>
          </div>

          {/* Gallery Grid */}
          <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4">
            {galleries.length === 0 ? (
              // Empty State / Fallback
              <div className="bg-muted col-span-full flex h-[400px] items-center justify-center rounded-xl">
                <p className="text-muted-foreground">Galeri belum tersedia</p>
              </div>
            ) : (
              // Display photos from galleries (flattened)
              (() => {
                // Collect all photos from all galleries into a single array
                const allPhotos = galleries
                  .flatMap((g) => (g.photos || []).map((p) => ({ ...p, title: g.title })))
                  .slice(0, 5); // Take max 5 photos for the grid

                if (allPhotos.length === 0) return null;

                return (
                  <>
                    {/* Main Featured Image (First Item) - Spans 2x2 */}
                    {allPhotos[0] && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="group relative col-span-2 row-span-2 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800"
                      >
                        <Image
                          src={allPhotos[0].url}
                          alt={allPhotos[0].title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="absolute bottom-4 left-4 text-white">
                            <p className="font-semibold">{allPhotos[0].title}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Secondary Images */}
                    {allPhotos.slice(1).map((photo, idx) => (
                      <motion.div
                        key={photo.id}
                        whileHover={{ scale: 1.05 }}
                        className="group relative col-span-1 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800"
                      >
                        <Image
                          src={photo.url}
                          alt={photo.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                      </motion.div>
                    ))}
                  </>
                );
              })()
            )}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="berita" className="bg-muted/30 py-16">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mb-10 flex flex-col items-center justify-center space-y-4 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tighter text-emerald-900 md:text-4xl dark:text-emerald-100">
              {tHome("news_title")}
            </h2>
            <p className="text-muted-foreground max-w-[700px]">{tHome("news_desc")}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {articles.length === 0 ? (
              <p className="text-muted-foreground col-span-full text-center">
                {tHome("news_empty")}
              </p>
            ) : (
              articles
                .filter((a) => a.is_published)
                .map((article) => (
                  <motion.div
                    variants={fadeIn}
                    key={article.id}
                    className="group bg-card relative flex flex-col space-y-3 rounded-lg border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link href={`/articles/${article.slug}`} className="absolute inset-0 z-10">
                      <span className="sr-only">Read more</span>
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.published_at || article.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </div>
                    <h3 className="line-clamp-2 text-lg font-semibold transition-colors group-hover:text-emerald-700">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {/* Strip HTML tags for preview if content is HTML */}
                      {article.excerpt || article.content.replace(/<[^>]*>?/gm, "")}
                    </p>
                  </motion.div>
                ))
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
