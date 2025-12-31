"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, FileText, Globe, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/utils/date";
import { useArticles, useDeleteArticle } from "@/lib/hooks/useArticles";
import type { Article } from "@/lib/services/articleService";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ArticlesPage() {
  const t = useTranslations("Dashboard.ArticlesPage");
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: articles = [], isLoading } = useArticles();
  const deleteMutation = useDeleteArticle();

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (activeTab === "published" && !article.is_published) return false;
      if (activeTab === "draft" && article.is_published) return false;
      if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase()))
        return false;
      return true;
    });
  }, [articles, activeTab, searchQuery]);

  // Calculate Stats
  const stats = useMemo(() => {
    return {
      total: articles.length,
      published: articles.filter((a) => a.is_published).length,
      draft: articles.filter((a) => !a.is_published).length,
    };
  }, [articles]);

  const deleteArticle = (id: number) => {
    if (!confirm(t("delete_confirm"))) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 pb-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="bg-muted h-9 w-48 animate-pulse rounded-md" />
            <div className="bg-muted h-5 w-96 animate-pulse rounded-md" />
          </div>
          <div className="bg-muted h-10 w-32 animate-pulse rounded-md" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted h-28 animate-pulse rounded-xl" />
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-muted h-16 w-full animate-pulse rounded-xl" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-muted h-72 animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-lg">{t("description")}</p>
        </div>
        <Button
          asChild
          className="bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:bg-emerald-700 hover:shadow-emerald-500/40"
        >
          <Link href="/dashboard/articles/create">
            <Plus className="mr-2 h-4 w-4" /> {t("add_new")}
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-slate-950">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-bl-full bg-blue-50 transition-transform hover:scale-110 dark:bg-blue-900/10" />
          <CardContent className="relative z-10 flex items-center gap-4 p-6">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Artikel</p>
              <h3 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100">
                {stats.total}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-slate-950">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-bl-full bg-emerald-50 transition-transform hover:scale-110 dark:bg-emerald-900/10" />
          <CardContent className="relative z-10 flex items-center gap-4 p-6">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Published</p>
              <h3 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-100">
                {stats.published}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-slate-950">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-bl-full bg-amber-50 transition-transform hover:scale-110 dark:bg-amber-900/10" />
          <CardContent className="relative z-10 flex items-center gap-4 p-6">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
              <File className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Draft</p>
              <h3 className="text-3xl font-bold tracking-tight text-amber-900 dark:text-amber-100">
                {stats.draft}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 p-2 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
            {["all", "published", "draft"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3 text-xs font-medium transition-all ${
                  activeTab === tab
                    ? "text-foreground bg-white shadow-sm dark:bg-slate-800"
                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
                }`}
              >
                {t(`tabs.${tab}` as any)}
              </Button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="search"
              placeholder={t("search")}
              className="border-0 bg-zinc-50 pl-9 transition-colors focus-visible:ring-1 focus-visible:ring-emerald-500 dark:bg-zinc-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Articles Grid */}
      <div className="bg-transparent">
        <ArticlesGrid articles={filteredArticles} onDelete={deleteArticle} t={t} locale={locale} />
      </div>
    </div>
  );
}

function ArticlesGrid({
  articles,
  onDelete,
  t,
  locale,
}: {
  articles: Article[];
  onDelete: (id: number) => void;
  t: (key: string) => string;
  locale: string;
}) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-24 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mb-4 rounded-full border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-slate-950">
          <FileText className="h-8 w-8 text-zinc-400" />
        </div>
        <h3 className="text-foreground text-lg font-bold">{t("empty")}</h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          Tidak ada artikel yang ditemukan. Coba ubah filter atau buat artikel baru.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {articles.map((item) => (
        <Card
          key={item.id}
          className="group overflow-hidden border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-slate-950 dark:hover:shadow-black/30"
        >
          {/* Thumbnail Image Container */}
          <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
            {/* Overlay Gradient on Hover */}
            <div className="absolute inset-0 z-10 bg-black/0 transition-colors group-hover:bg-black/10" />

            {/* Status Badge */}
            <div className="absolute top-3 right-3 z-20">
              <Badge
                variant={item.is_published ? "default" : "secondary"}
                className={`border-0 shadow-sm backdrop-blur-md ${
                  item.is_published
                    ? "bg-emerald-500/90 text-white hover:bg-emerald-600"
                    : "bg-zinc-500/80 text-white hover:bg-zinc-600"
                }`}
              >
                {item.is_published ? t("status.published") : t("status.draft")}
              </Badge>
            </div>

            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-50/50 to-purple-50/50 transition-transform duration-500 group-hover:scale-105 dark:from-slate-900 dark:to-slate-800">
              <FileText className="h-10 w-10 text-indigo-200 dark:text-slate-700" />
            </div>
          </div>

          <CardContent className="flex h-[180px] flex-col p-5">
            <div className="flex-1 space-y-3">
              <div className="text-muted-foreground/80 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                <span className="text-emerald-600 dark:text-emerald-400">News</span>
                <span>•</span>
                <span>{formatDate(item.created_at, "long")}</span>
              </div>

              <h3 className="text-foreground line-clamp-2 text-lg leading-snug font-bold tracking-tight transition-colors group-hover:text-emerald-600">
                {item.title}
              </h3>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 border border-zinc-100 dark:border-zinc-800">
                  <AvatarFallback className="bg-indigo-50 text-[10px] text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    A
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground text-xs font-medium">Admin</span>
              </div>

              <div className="flex items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30"
                  asChild
                >
                  <Link href={`/dashboard/articles/edit/${item.id}`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
