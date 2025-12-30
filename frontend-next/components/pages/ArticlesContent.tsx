"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, slideUp } from "@/lib/animations";
import { usePaginatedArticles } from "@/lib/hooks";
import { useCategories } from "@/lib/hooks/useCategories";
import { useTags } from "@/lib/hooks/useTags";
import {
  Article,
  searchArticles,
  getArticlesByCategory,
  getArticlesByTag,
  PaginatedResponse,
} from "@/lib/services/articleService";
import { ArticlesListSkeleton } from "@/components/ui/skeletons";
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

interface ArticlesContentProps {
  initialArticles?: Article[];
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ArticlesContent({ initialArticles = [] }: ArticlesContentProps) {
  const t = useTranslations("Articles");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const LIMIT = 6;

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch categories and tags for filters
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();

  // Determine which query to use based on filters
  const hasSearch = debouncedSearch.length > 0;
  const hasCategory = selectedCategory !== null;
  const hasTag = selectedTag !== null;
  const hasFilters = hasSearch || hasCategory || hasTag;

  // Default paginated articles (no filter)
  const defaultQuery = usePaginatedArticles(page, LIMIT, { enabled: !hasFilters });

  // Search query
  const searchQueryResult = useQuery({
    queryKey: ["articles", "search", debouncedSearch, page],
    queryFn: () => searchArticles(debouncedSearch, page, LIMIT),
    enabled: hasSearch && !hasCategory && !hasTag,
  });

  // Category filter query
  const categoryQuery = useQuery({
    queryKey: ["articles", "category", selectedCategory, page],
    queryFn: () => getArticlesByCategory(selectedCategory!, page, LIMIT),
    enabled: hasCategory && !hasSearch && !hasTag,
  });

  // Tag filter query
  const tagQuery = useQuery({
    queryKey: ["articles", "tag", selectedTag, page],
    queryFn: () => getArticlesByTag(selectedTag!, page, LIMIT),
    enabled: hasTag && !hasSearch && !hasCategory,
  });

  // Determine active query result
  const activeQuery = hasSearch
    ? searchQueryResult
    : hasCategory
      ? categoryQuery
      : hasTag
        ? tagQuery
        : defaultQuery;

  const { data, isLoading, isError, isPlaceholderData } = activeQuery as {
    data: PaginatedResponse<Article> | undefined;
    isLoading: boolean;
    isError: boolean;
    isPlaceholderData?: boolean;
  };

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

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedTag(null);
    setPage(1);
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, selectedTag]);

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

          {/* Search and Filters */}
          <motion.div variants={slideUp} className="mx-auto mt-8 max-w-3xl space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t("search_placeholder") || "Cari artikel..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-300 bg-white py-3 pr-12 pl-12 text-gray-900 shadow-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Category and Tag Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Category Filter */}
              <select
                value={selectedCategory || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCategory(val ? Number(val) : null);
                  setSelectedTag(null);
                  setSearchQuery("");
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Tag Filter */}
              <select
                value={selectedTag || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedTag(val ? Number(val) : null);
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="">Semua Tag</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                  Hapus Filter
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          {isLoading ? (
            <ArticlesListSkeleton count={6} />
          ) : isError ? (
            <div className="flex justify-center py-20 text-center text-red-500">
              <p>Failed to load articles. Please try again later.</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Tidak Ada Artikel Ditemukan
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {hasSearch
                  ? `Tidak ada artikel yang cocok dengan "${debouncedSearch}"`
                  : hasCategory
                    ? "Tidak ada artikel dalam kategori ini"
                    : hasTag
                      ? "Tidak ada artikel dengan tag ini"
                      : "Belum ada artikel yang tersedia"}
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-emerald-600 px-6 py-2 text-white transition-colors hover:bg-emerald-700"
                >
                  Hapus Filter
                </button>
              )}
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
