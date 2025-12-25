"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Gallery {
  id: number;
  title: string;
  description: string;
  cover_url: string;
  created_at: string;
}

export default function GalleryPage() {
  const t = useTranslations("Dashboard.GalleryPage");
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await api.get("/galleries");
      setGalleries(response.data.data);
    } catch (error) {
      console.error("Failed to fetch galleries", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGallery = async (id: number) => {
    if (!confirm(t("delete_confirm"))) return;
    try {
      await api.delete(`/galleries/${id}`);
      toast.success(t("toast_deleted"));
      fetchGalleries();
    } catch {
      toast.error(t("toast_failed"));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button asChild>
          <Link href="/gallery/create">
            <Plus className="mr-2 h-4 w-4" /> {t("add_new")}
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="py-10 text-center">{t("loading")}</div>
      ) : galleries.length === 0 ? (
        <div className="bg-muted/20 rounded-lg border py-10 text-center">
          <p className="text-muted-foreground">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => (
            <div
              key={gallery.id}
              className="group bg-background relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
            >
              <div className="bg-muted relative aspect-video">
                {gallery.cover_url ? (
                  <Image
                    src={gallery.cover_url}
                    alt={gallery.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center">
                    {t("no_cover")}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="line-clamp-1 text-lg font-semibold">{gallery.title}</h3>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {gallery.description || t("no_desc")}
                </p>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/gallery/${gallery.id}`}>
                      <Eye className="mr-2 h-3 w-3" /> {t("detail")}
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteGallery(gallery.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
