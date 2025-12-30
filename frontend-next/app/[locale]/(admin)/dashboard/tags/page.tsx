"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Tag as TagIcon, Loader2, Pencil, MoreVertical } from "lucide-react";

import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from "@/lib/hooks/useTags";
import { type Tag } from "@/lib/services/tagService";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function TagsPage() {
  const t = useTranslations("Dashboard");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  const { data: tags, isLoading } = useTags();
  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const deleteMutation = useDeleteTag();

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
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tag Artikel</h1>
          <p className="text-muted-foreground text-lg">
            Kelola tag untuk menandai dan filter artikel
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-primary/20 shadow-lg transition-all hover:scale-105">
              <Plus className="mr-2 h-5 w-5" /> Tambah Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingTag ? "Edit Tag" : "Tambah Tag Baru"}</DialogTitle>
              <DialogDescription>Tag membantu pembaca menemukan artikel terkait</DialogDescription>
            </DialogHeader>

            <form id="tag-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Tag</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Contoh: Kegiatan"
                />
              </div>
            </form>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={closeDialog}>
                Batal
              </Button>
              <Button
                type="submit"
                form="tag-form"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingTag ? "Simpan Perubahan" : "Tambah Tag"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="bg-border/60" />

      {tags && tags.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {tags.map((item) => (
            <div key={item.id} className="group relative">
              <Badge
                variant="secondary"
                className="h-9 gap-2 px-4 text-sm font-medium transition-all hover:shadow-md"
              >
                <TagIcon className="h-3.5 w-3.5" />
                {item.name}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="ml-1 rounded-full p-0.5 opacity-50 hover:opacity-100 focus:outline-none">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
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
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 border-muted-foreground/20 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20 text-center">
          <div className="bg-background mb-6 rounded-full p-6 shadow-sm">
            <TagIcon className="text-muted-foreground/50 h-12 w-12" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Belum Ada Tag</h3>
          <p className="text-muted-foreground max-w-sm">
            Mulai dengan membuat tag untuk menandai artikel Anda.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Tag Baru
          </Button>
        </div>
      )}
    </div>
  );
}
