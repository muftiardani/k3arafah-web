"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Calendar, User, ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, slideUp } from "@/lib/animations";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getPaginatedArticles, Article } from "@/lib/services/articleService";
import { useState } from "react";

interface ArticlesContentProps {
  initialArticles?: Article[];
}

export default function ArticlesContent({ initialArticles = [] }: ArticlesContentProps) {
  const t = useTranslations("Articles");
  const [page, setPage] = useState(1);
  const LIMIT = 6;

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ["articles", page],
    queryFn: () => getPaginatedArticles(page, LIMIT),
    placeholderData: keepPreviousData,
  });

  const articles = data?.items || [];
  const meta = data?.meta;

  const handlePrevPage = () => {
    if (page > 1) setPage((old) => old - 1);
  };

  const handleNextPage = () => {
    if (!isPlaceholderData && meta && page < meta.total_pages) {
      setPage((old) => old + 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-slate-50 py-16 text-center md:py-24 dark:bg-slate-900">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container px-4 md:px-6"
        >
          <motion.h1
            variants={slideUp}
            className="text-3xl font-bold tracking-tighter text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white"
          >
            {t("hero_title")}
          </motion.h1>
          <motion.p
            variants={slideUp}
            className="mx-auto mt-4 max-w-[700px] text-gray-600 md:text-xl dark:text-gray-300"
          >
            {t("hero_desc")}
          </motion.p>
        </motion.div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          {isLoading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="aspect-video w-full animate-pulse bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-4 p-6">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-20 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex justify-center py-20 text-center text-red-500">
              <p>Failed to load articles. Please try again later.</p>
            </div>
          ) : (
            <>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
              >
                {articles.map((article) => (
                  <motion.div variants={fadeIn} key={article.id}>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-200">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-0 right-0 m-4 rounded-md bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                          {t("news_badge")}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(article.published_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {article.author.name}
                          </div>
                        </div>

                        <h3 className="mb-2 text-xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                          {article.title}
                        </h3>

                        <p className="mb-6 line-clamp-3 flex-1 text-sm text-gray-600 dark:text-gray-400">
                          {article.excerpt}
                        </p>

                        <div className="mt-auto flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {t("read_more")}
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {meta && meta.total_pages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1 || isPlaceholderData}
                    className="flex items-center gap-1 rounded-md border px-4 py-2 transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Page <span className="font-bold text-gray-900 dark:text-white">{page}</span> of{" "}
                    {meta.total_pages}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={!meta || page === meta.total_pages || isPlaceholderData}
                    className="flex items-center gap-1 rounded-md border px-4 py-2 transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
