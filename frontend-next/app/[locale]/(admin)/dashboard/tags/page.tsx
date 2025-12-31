"use client";

import { useState } from "react";

import {
  Plus,
  Trash2,
  Tag as TagIcon,
  Loader2,
  Pencil,
  Hash,
  Search,
  Save,
  Type,
  Eye,
} from "lucide-react";

import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from "@/lib/hooks/useTags";
import { type Tag } from "@/lib/services/tagService";
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function TagsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
  });

  const { data: tags = [], isLoading } = useTags();
  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const deleteMutation = useDeleteTag();

  const filteredTags = tags.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus tag ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (item: Tag) => {
    setEditingTag(item);
    setFormData({
      name: item.name,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTag(null);
    setFormData({ name: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, data: formData }, { onSuccess: closeDialog });
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
        <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
            />
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
          <h1 className="text-3xl font-bold tracking-tight">Tag Artikel</h1>
          <p className="text-muted-foreground text-lg">
            Kelola hashtag untuk mengelompokkan artikel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingTag(null);
                  setFormData({ name: "" });
                }}
                className="bg-amber-600 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 hover:bg-amber-700"
              >
                <Plus className="mr-2 h-5 w-5" /> Tambah Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] overflow-hidden border-none p-0 shadow-2xl lg:max-w-4xl">
              <div className="bg-background grid h-[50vh] lg:h-auto lg:grid-cols-5">
                {/* Left Column: Form */}
                <div className="flex flex-col overflow-y-auto p-6 lg:col-span-3 lg:p-8">
                  <DialogHeader className="mb-6 px-1">
                    <DialogTitle className="text-2xl font-bold">
                      {editingTag ? "Edit Tag" : "Tag Baru"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingTag
                        ? "Perbarui tag yang dipilih."
                        : "Buat tag baru untuk memudahkan pencarian."}
                    </DialogDescription>
                  </DialogHeader>

                  <form id="tag-form" onSubmit={handleSubmit} className="flex-1 space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground text-sm font-semibold">
                        Nama Tag
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="Contoh: Kegiatan"
                          className="h-10 border-zinc-200 bg-white pl-9 font-medium transition-all focus-visible:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-amber-600"
                        />
                        <Type className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                      </div>
                      {formData.name && (
                        <p className="text-muted-foreground mt-1.5 flex items-center gap-1 text-[11px] font-medium">
                          <span className="font-semibold">Slug:</span>
                          <span className="rounded bg-amber-50 px-1.5 py-0.5 font-mono text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                            {slugPreview}
                          </span>
                        </p>
                      )}
                    </div>
                  </form>

                  <DialogFooter className="border-border/10 mt-8 border-t pt-4">
                    <Button type="button" variant="ghost" onClick={closeDialog}>
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      form="tag-form"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="bg-amber-600 text-white hover:bg-amber-700"
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {createMutation.isPending || updateMutation.isPending
                        ? "Menyimpan..."
                        : editingTag
                          ? "Simpan Perubahan"
                          : "Buat Tag"}
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

                    <div className="flex h-48 w-full flex-col items-center justify-center">
                      <Badge
                        variant="secondary"
                        className="peer h-11 scale-125 gap-2 border border-amber-200 bg-amber-50 pr-12 pl-4 text-base font-medium text-amber-900 shadow-md transition-all dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-100"
                      >
                        <TagIcon className="h-4 w-4 opacity-50" />
                        {formData.name || "Nama Tag"}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground max-w-[200px] text-center text-xs">
                      Preview tampilan tag di dashboard
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
        <Card className="border-none bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-amber-100 bg-white p-3 shadow-sm dark:border-amber-900 dark:bg-slate-950">
                <Hash className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Tag</p>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                  {tags.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="min-w-[300px] flex-1">
          <div className="relative h-full">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Cari tag..."
              className="h-full border-zinc-200 bg-white pl-9 dark:border-zinc-800 dark:bg-slate-950"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredTags.length > 0 ? (
        <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-slate-950">
          <CardContent className="p-8">
            <div className="flex flex-wrap gap-4">
              {filteredTags.map((item) => (
                <div key={item.id} className="group relative">
                  <Badge
                    variant="secondary"
                    className="peer h-11 gap-2 border border-transparent pr-12 pl-4 text-base font-medium transition-all hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 hover:shadow-md dark:hover:border-amber-800 dark:hover:bg-amber-900/30 dark:hover:text-amber-400"
                  >
                    <Hash className="h-4 w-4 opacity-50" />
                    {item.name}
                  </Badge>

                  {/* Action Overlay */}
                  <div className="absolute top-1/2 right-1 flex -translate-y-1/2 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                      className="h-8 w-8 rounded-full hover:bg-white hover:text-amber-600 dark:hover:bg-slate-950"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="h-8 w-8 rounded-full hover:bg-white hover:text-red-600 dark:hover:bg-slate-950"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="border-muted-foreground/20 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-zinc-50 py-20 text-center dark:bg-zinc-900/30">
          <div className="mb-6 rounded-full bg-white p-6 shadow-sm dark:bg-slate-950">
            <TagIcon className="h-12 w-12 text-zinc-300" />
          </div>
          <h3 className="mb-2 text-xl font-bold">Tag Tidak Ditemukan</h3>
          <p className="text-muted-foreground max-w-sm">
            {searchQuery ? "Coba kata kunci lain." : "Mulai dengan membuat tag untuk artikel."}
          </p>
        </div>
      )}
    </div>
  );
}
