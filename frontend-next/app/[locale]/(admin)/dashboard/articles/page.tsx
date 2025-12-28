"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations, useLocale } from "next-intl";

interface Article {
  id: number;
  title: string;
  is_published: boolean;
  created_at: string;
  updated_at?: string; // Optional if not in backend yet
}

export default function ArticlesPage() {
  const t = useTranslations("Dashboard.ArticlesPage");
  const locale = useLocale();
  const [articles, setArticles] = useState<Article[]>([]);
  // const [filteredArticles, setFilteredArticles] = useState<Article[]>([]); // Derived state, use useMemo instead
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get("/articles");
      setArticles(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch articles", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
    // Filter by Tab
    if (activeTab === "published" && !article.is_published) return false;
    if (activeTab === "draft" && article.is_published) return false;

    // Filter by Search
    if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;

    return true;
  });

  const deleteArticle = async (id: number) => {
    if (!confirm(t("delete_confirm"))) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.success(t("toast_deleted"));
      fetchArticles(); // Refresh
    } catch {
      toast.error(t("toast_failed"));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-muted h-8 w-48 animate-pulse rounded" />
          <div className="bg-muted h-10 w-32 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-64 w-full animate-pulse rounded-md border" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-lg">{t("description")}</p>
        </div>
        <Button asChild className="shadow-primary/20 shadow-lg transition-all hover:scale-105">
          <Link href="/dashboard/articles/create">
            <Plus className="mr-2 h-4 w-4" /> {t("add_new")}
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Filters & Search */}
        <div className="bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="bg-muted/30 flex gap-1 overflow-x-auto rounded-lg p-1.5">
            {["all", "published", "draft"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={`rounded-md transition-all ${
                  activeTab === tab
                    ? "font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(`tabs.${tab}` as any)}
                <Badge
                  variant="secondary"
                  className={`ml-2 h-5 px-1.5 text-[10px] font-normal ${
                    activeTab === tab
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {
                    articles.filter((a) => {
                      if (tab === "published") return a.is_published;
                      if (tab === "draft") return !a.is_published;
                      return true;
                    }).length
                  }
                </Badge>
              </Button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="search"
              placeholder={t("search")}
              className="bg-background/50 border-input/60 focus:bg-background pl-9 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Articles Grid */}
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
      <div className="bg-muted/30 flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center">
        <div className="bg-background mb-4 rounded-full p-4 shadow-sm">
          <FileText className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold">{t("empty")}</h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">{t("description")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {articles.map((item) => (
        <Card
          key={item.id}
          className="group overflow-hidden border-none shadow-sm transition-all duration-300 hover:shadow-md"
        >
          <CardHeader className="p-0">
            {/* Thumbnail Placeholder - To be replaced with actual image if available */}
            <div className="relative flex aspect-video w-full items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 transition-transform duration-500 group-hover:scale-105 dark:from-slate-800 dark:to-slate-900">
              <FileText className="h-12 w-12 text-blue-200 dark:text-slate-700" />
              <div className="absolute top-3 right-3">
                <Badge
                  variant={item.is_published ? "default" : "secondary"}
                  className={`${item.is_published ? "bg-green-500 shadow-lg shadow-green-500/20 hover:bg-green-600" : "bg-zinc-500 text-white"}`}
                >
                  {item.is_published ? t("status.published") : t("status.draft")}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <div className="flex flex-col gap-3">
              <div className="space-y-2">
                <h3 className="group-hover:text-primary line-clamp-2 text-lg leading-tight font-bold transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span className="bg-muted-foreground/30 inline-block h-2 w-2 rounded-full"></span>
                  {new Date(item.created_at).toLocaleDateString(
                    locale === "en" ? "en-US" : "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-end gap-2 border-t pt-4">
                <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                  <Link href={`/dashboard/articles/edit/${item.id}`}>
                    <Pencil className="mr-1.5 h-3 w-3" /> Edit
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
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
