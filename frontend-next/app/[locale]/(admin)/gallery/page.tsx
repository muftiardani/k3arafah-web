"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Trash2, Eye, Pencil, Loader2, ImageIcon, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateGallery } from "@/lib/services/galleryService";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [updating, setUpdating] = useState(false);

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

  const handleEdit = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setEditForm({ title: gallery.title, description: gallery.description || "" });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingGallery) return;
    setUpdating(true);
    try {
      await updateGallery(editingGallery.id, editForm);
      toast.success(t("toast_updated") || "Gallery updated successfully");
      setEditDialogOpen(false);
      setEditingGallery(null);
      fetchGalleries();
    } catch {
      toast.error(t("toast_failed"));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-muted-foreground animate-pulse">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-lg">{t("description")}</p>
        </div>
        <Button asChild className="shadow-primary/20 shadow-lg transition-all hover:scale-105">
          <Link href="/gallery/create">
            <Plus className="mr-2 h-5 w-5" /> {t("add_new")}
          </Link>
        </Button>
      </div>

      <Separator className="bg-border/60" />

      {galleries.length === 0 ? (
        <div className="bg-muted/30 border-muted-foreground/20 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20">
          <div className="bg-background mb-6 rounded-full p-6 shadow-sm">
            <ImageIcon className="text-muted-foreground/50 h-12 w-12" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">{t("empty")}</h3>
          <p className="text-muted-foreground max-w-sm text-center">
            Belum ada album galeri. Mulai dengan membuat album baru untuk memamerkan foto kegiatan.
          </p>
          <Button asChild variant="outline" className="mt-8">
            <Link href="/gallery/create">Buat Album Pertama</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Create New Card (Optional visual integration) */}
          <Link href="/gallery/create" className="group">
            <div className="border-muted-foreground/20 bg-muted/5 hover:bg-muted/10 hover:border-primary/50 flex h-full min-h-[300px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed transition-all">
              <div className="bg-background flex h-14 w-14 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110">
                <Plus className="text-primary h-6 w-6" />
              </div>
              <span className="text-muted-foreground group-hover:text-primary font-medium transition-colors">
                {t("add_new")}
              </span>
            </div>
          </Link>

          {galleries.map((gallery) => (
            <Card
              key={gallery.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-xl border-none shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <div className="bg-muted relative aspect-video w-full overflow-hidden">
                {gallery.cover_url ? (
                  <Image
                    src={gallery.cover_url}
                    alt={gallery.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="bg-secondary/30 text-muted-foreground flex h-full items-center justify-center">
                    <ImageIcon className="h-10 w-10 opacity-50" />
                  </div>
                )}

                {/* Overlay Action Menu */}
                <div className="absolute top-2 right-2 z-20 opacity-0 transition-opacity group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full border-none bg-black/50 text-white hover:bg-black/70"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(gallery)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => deleteGallery(gallery.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Button asChild size="sm" variant="secondary" className="w-full font-semibold">
                    <Link href={`/gallery/${gallery.id}`}>
                      <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                    </Link>
                  </Button>
                </div>
              </div>

              <CardContent className="flex flex-1 flex-col gap-3 p-2">
                <h3 className="line-clamp-1 text-lg leading-tight font-bold" title={gallery.title}>
                  {gallery.title}
                </h3>
                <p className="text-muted-foreground line-clamp-2 flex-1 text-sm">
                  {gallery.description || (
                    <span className="italic opacity-50">Tidak ada deskripsi</span>
                  )}
                </p>
                <div className="text-muted-foreground/70 mt-2 w-full border-t pt-2 text-xs">
                  {new Date(gallery.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("edit_title") || "Edit Gallery"}</DialogTitle>
            <DialogDescription>
              {t("edit_description") || "Update gallery details"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">{t("form_title") || "Title"}</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-desc">{t("form_description") || "Description"}</Label>
              <Textarea
                id="edit-desc"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={4}
                className="col-span-3 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              {t("cancel") || "Cancel"}
            </Button>
            <Button onClick={handleUpdate} disabled={updating}>
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("save") || "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
