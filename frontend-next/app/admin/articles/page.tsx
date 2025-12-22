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
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Article {
  id: number;
  title: string;
  is_published: boolean;
  created_at: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get("/articles");
      setArticles(response.data.data);
    } catch (error) {
      console.error("Failed to fetch articles", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.success("Article deleted");
      fetchArticles();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Artikel & Berita</h1>
        <Button asChild>
          <Link href="/admin/articles/create">
            <Plus className="mr-2 h-4 w-4" /> Tambah Artikel
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  Belum ada artikel.
                </TableCell>
              </TableRow>
            ) : (
              articles.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant={item.is_published ? "default" : "outline"}>
                      {item.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      {" "}
                      {/* Link to edit later */}
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deleteArticle(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
