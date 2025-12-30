"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Folder, Loader2, Pencil, MoreVertical } from "lucide-react";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/lib/hooks/useCategories";
import { type Category } from "@/lib/services/categoryService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Separator } from "@/components/ui/separator";

export default function CategoriesPage() {
  const t = useTranslations("Dashboard");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { data: categories, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (item: Category) => {
    setEditingCategory(item);
    setFormData({
      name: item.name,
      description: item.description || "",
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData }, { onSuccess: closeDialog });
    } else {
      createMutation.mutate(formData, { onSuccess: closeDialog });
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-8 pb-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-9 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-5 w-72 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-10 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-3 h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategori Artikel</h1>
          <p className="text-muted-foreground text-lg">
            Kelola kategori untuk mengorganisir artikel
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-primary/20 shadow-lg transition-all hover:scale-105">
              <Plus className="mr-2 h-5 w-5" /> Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
              </DialogTitle>
              <DialogDescription>
                Kategori membantu mengorganisir artikel berdasarkan topik
              </DialogDescription>
            </DialogHeader>

            <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kategori</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Contoh: Berita Sekolah"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi (opsional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat tentang kategori ini"
                  rows={3}
                />
              </div>
            </form>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={closeDialog}>
                Batal
              </Button>
              <Button
                type="submit"
                form="category-form"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingCategory ? "Simpan Perubahan" : "Tambah Kategori"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="bg-border/60" />

      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
            >
              <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(item)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Folder className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold" title={item.name}>
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                      {item.description}
                    </p>
                  )}
                  <p className="text-muted-foreground/60 mt-2 text-xs">Slug: {item.slug}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 border-muted-foreground/20 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20 text-center">
          <div className="bg-background mb-6 rounded-full p-6 shadow-sm">
            <Folder className="text-muted-foreground/50 h-12 w-12" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Belum Ada Kategori</h3>
          <p className="text-muted-foreground max-w-sm">
            Mulai dengan membuat kategori untuk mengorganisir artikel Anda.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Kategori Baru
          </Button>
        </div>
      )}
    </div>
  );
}
