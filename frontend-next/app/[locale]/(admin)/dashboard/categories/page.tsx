"use client";

import { useState } from "react";

import {
  Plus,
  Trash2,
  Folder,
  Loader2,
  Pencil,
  MoreVertical,
  LayoutGrid,
  Search,
  Save,
  AlignLeft,
  Type,
  Eye,
} from "lucide-react";

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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Generate slug preview
  const slugPreview = formData.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-8 pb-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="bg-muted h-8 w-48 animate-pulse rounded-lg" />
            <div className="bg-muted h-4 w-64 animate-pulse rounded-lg" />
          </div>
          <div className="bg-muted h-10 w-32 animate-pulse rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted h-40 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Kategori Artikel</h1>
          <p className="text-muted-foreground text-lg">
            Kelola kategori untuk mengorganisir artikel
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingCategory(null);
                  setFormData({ name: "", description: "" });
                }}
                className="bg-blue-600 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-5 w-5" /> Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] overflow-hidden border-none p-0 shadow-2xl lg:max-w-4xl">
              <div className="bg-background grid h-[70vh] lg:h-auto lg:grid-cols-5">
                {/* Left Column: Form */}
                <div className="flex flex-col overflow-y-auto p-6 lg:col-span-3 lg:p-8">
                  <DialogHeader className="mb-6 px-1">
                    <DialogTitle className="text-2xl font-bold">
                      {editingCategory ? "Edit Kategori" : "Kategori Baru"}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {editingCategory
                        ? "Perbarui detail kategori di bawah ini."
                        : "Buat kategori baru untuk mengorganisir konten."}
                    </DialogDescription>
                  </DialogHeader>

                  <form id="category-form" onSubmit={handleSubmit} className="flex-1 space-y-5">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground text-sm font-semibold">
                          Nama Kategori
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="Contoh: Berita Sekolah"
                            className="h-10 border-zinc-200 bg-white pl-9 font-medium transition-all focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-blue-600"
                          />
                          <Type className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        </div>
                        {formData.name && (
                          <p className="text-muted-foreground mt-1.5 flex items-center gap-1 text-[11px] font-medium">
                            <span className="font-semibold">Slug:</span>
                            <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                              {slugPreview}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-foreground text-sm font-semibold"
                        >
                          Deskripsi
                        </Label>
                        <div className="relative">
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Jelaskan secara singkat tentang kategori ini..."
                            rows={4}
                            className="min-h-[100px] resize-none border-zinc-200 bg-white pl-9 font-medium transition-all focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-blue-600"
                          />
                          <AlignLeft className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </form>

                  <DialogFooter className="border-border/10 mt-8 border-t pt-4">
                    <Button type="button" variant="ghost" onClick={closeDialog}>
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      form="category-form"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {createMutation.isPending || updateMutation.isPending
                        ? "Menyimpan..."
                        : editingCategory
                          ? "Simpan Perubahan"
                          : "Buat Kategori"}
                    </Button>
                  </DialogFooter>
                </div>

                {/* Right Column: Preview */}
                <div className="bg-muted/30 border-border/50 relative hidden flex-col items-center justify-center border-l p-8 lg:col-span-2 lg:flex">
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-[0.4] dark:opacity-[0.1]" />
                  <div className="z-10 flex w-full flex-col items-center gap-6 px-6">
                    <div className="text-muted-foreground border-border/50 flex items-center gap-2 rounded-full border bg-white/50 px-4 py-1.5 text-sm font-medium tracking-wider uppercase backdrop-blur-sm dark:bg-black/20">
                      <Eye className="h-3.5 w-3.5" /> Live Preview
                    </div>

                    <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl transition-all dark:border-zinc-800 dark:bg-slate-950">
                      {/* Pattern Background */}
                      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-bl-full bg-linear-to-br from-blue-50 to-transparent dark:from-blue-900/10" />

                      <div className="relative z-10 flex h-full flex-col items-center text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-900/20 dark:text-blue-400">
                          <Folder className="h-8 w-8" />
                        </div>

                        <h3 className="text-foreground mb-2 line-clamp-1 text-xl font-bold tracking-tight">
                          {formData.name || "Nama Kategori"}
                        </h3>

                        <p className="text-muted-foreground mb-6 line-clamp-3 text-sm">
                          {formData.description || "Deskripsi kategori akan muncul di sini..."}
                        </p>

                        <div className="flex w-full items-center justify-center border-t border-zinc-100 pt-4 dark:border-zinc-800">
                          <Badge
                            variant="secondary"
                            className="bg-zinc-100 font-normal text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                          >
                            ID: {slugPreview || "slug-kategori"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground max-w-[200px] text-center text-xs">
                      Preview tampilan kartu kategori di dashboard
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats & Search */}
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <Card className="border-none bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-blue-100 bg-white p-3 shadow-sm dark:border-blue-900 dark:bg-slate-950">
                <LayoutGrid className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Kategori</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {categories.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="min-w-[300px] flex-1">
          <div className="relative h-full">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Cari kategori..."
              className="h-full border-zinc-200 bg-white pl-9 dark:border-zinc-800 dark:bg-slate-950"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCategories.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-slate-950 dark:hover:shadow-black/30"
            >
              {/* Pattern Background */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-bl-full bg-linear-to-br from-blue-50 to-transparent transition-transform group-hover:scale-110 dark:from-blue-900/10" />

              <div className="absolute top-3 right-3 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
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

              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-900/20 dark:text-blue-400">
                  <Folder className="h-6 w-6" />
                </div>

                <h3 className="text-foreground mb-1 line-clamp-1 text-lg font-bold tracking-tight transition-colors group-hover:text-blue-600">
                  {item.name}
                </h3>

                {item.description ? (
                  <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm">
                    {item.description}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}

                <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <Badge
                    variant="secondary"
                    className="bg-zinc-100 font-normal text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                  >
                    ID: {item.slug}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-muted-foreground/20 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-zinc-50 py-20 text-center dark:bg-zinc-900/30">
          <div className="mb-6 rounded-full bg-white p-6 shadow-sm dark:bg-slate-950">
            <Folder className="h-12 w-12 text-zinc-300" />
          </div>
          <h3 className="mb-2 text-xl font-bold">Kategori Tidak Ditemukan</h3>
          <p className="text-muted-foreground max-w-sm">
            {searchQuery
              ? "Coba kata kunci lain."
              : "Mulai dengan membuat kategori untuk mengorganisir artikel."}
          </p>
        </div>
      )}
    </div>
  );
}
