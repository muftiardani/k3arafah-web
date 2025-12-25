"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, FileText, Globe, Lock } from "lucide-react";
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button asChild>
          <Link href="/articles/create">
            <Plus className="mr-2 h-4 w-4" /> {t("add_new")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4 pb-0">
          {/* No title in header to save space if utilizing tabs above nicely, or keep it simple */}
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="bg-muted/50 flex w-fit items-center gap-2 rounded-lg p-1">
                <Button
                  variant={activeTab === "all" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("all")}
                  className={
                    activeTab === "all" ? "bg-background hover:bg-background shadow-sm" : ""
                  }
                >
                  {t("tabs.all")}
                </Button>
                <Button
                  variant={activeTab === "published" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("published")}
                  className={
                    activeTab === "published" ? "bg-background hover:bg-background shadow-sm" : ""
                  }
                >
                  {t("tabs.published")}
                </Button>
                <Button
                  variant={activeTab === "draft" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("draft")}
                  className={
                    activeTab === "draft" ? "bg-background hover:bg-background shadow-sm" : ""
                  }
                >
                  {t("tabs.draft")}
                </Button>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input
                  type="search"
                  placeholder={t("search")}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ArticlesTable
              articles={filteredArticles}
              onDelete={deleteArticle}
              t={t}
              locale={locale}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ArticlesTable({
  articles,
  onDelete,
  t,
  locale,
}: {
  articles: Article[];
  onDelete: (id: number) => void;
  t: any;
  locale: string;
}) {
  if (articles.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
        <FileText className="mb-4 h-12 w-12 opacity-20" />
        <p>{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">{t("table.title")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
            <TableHead>{t("table.date")}</TableHead>
            <TableHead className="text-right">{t("table.action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="line-clamp-1">{item.title}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={item.is_published ? "default" : "secondary"}
                  className={item.is_published ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {item.is_published ? (
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" /> {t("status.published")}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3" /> {t("status.draft")}
                    </div>
                  )}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="flex justify-end gap-2 text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/articles/edit/${item.id}`}>
                    {" "}
                    {/* Assuming edit page exists or will exist, keeping link clean */}
                    <Pencil className="text-muted-foreground hover:text-foreground h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
