"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  Trash2,
  Video as VideoIcon,
  Pencil,
  ExternalLink,
  PlayCircle,
  MoreVertical,
  Link as LinkIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { useVideos, useCreateVideo, useUpdateVideo, useDeleteVideo } from "@/lib/hooks";
import { type Video } from "@/lib/services/videoService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { formatDate } from "@/lib/utils/date";

export default function VideosPage() {
  const t = useTranslations("Dashboard.VideosPage");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    youtube_id: "",
    thumbnail: "",
  });

  // Use hooks with caching
  const { data: videos, isLoading } = useVideos();
  const createMutation = useCreateVideo();
  const updateMutation = useUpdateVideo();
  const deleteMutation = useDeleteVideo();

  const handleDelete = (id: number) => {
    if (confirm(t("delete_confirm"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      youtube_id: video.youtube_id,
      thumbnail: video.thumbnail || "",
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingVideo(null);
    setFormData({ title: "", youtube_id: "", thumbnail: "" });
  };

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url;
  };

  const handleYoutubeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const extractedId = extractYoutubeId(value);
    setFormData({ ...formData, youtube_id: extractedId });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideo) {
      updateMutation.mutate(
        { id: editingVideo.id, data: formData },
        {
          onSuccess: () => {
            toast.success(t("toast_updated") || "Video updated successfully");
            closeDialog();
          },
          onError: (error: any) => {
            toast.error(
              t("toast_failed") + ": " + (error.response?.data?.message || error.message)
            );
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success(t("toast_created"));
          closeDialog();
        },
        onError: (error: any) => {
          toast.error(t("toast_failed") + ": " + (error.response?.data?.message || error.message));
        },
      });
    }
  };

  const getYoutubeThumbnail = (id: string) => {
    if (!id || id.length < 11) return "/placeholder-video.jpg"; // Fallback
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  };

  const isValidYoutubeId = (id: string) => {
    return id && id.length === 11;
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-8 pb-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="bg-muted h-9 w-48 animate-pulse rounded-md" />
            <div className="bg-muted h-5 w-72 animate-pulse rounded-md" />
          </div>
          <div className="bg-muted h-10 w-36 animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted h-64 animate-pulse rounded-xl" />
          ))}
        </div>
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:bg-emerald-700 hover:shadow-emerald-500/40">
              <Plus className="mr-2 h-5 w-5" /> {t("add_new")}
            </Button>
          </DialogTrigger>
          <DialogContent className="gap-0 overflow-hidden border-zinc-200 p-0 shadow-2xl sm:max-w-4xl dark:border-zinc-800">
            <div className="grid h-full md:grid-cols-5">
              {/* Left Column: Form */}
              <div className="space-y-6 p-6 md:col-span-3">
                <DialogHeader className="px-0">
                  <DialogTitle className="text-2xl font-bold">
                    {editingVideo ? "Edit Video" : t("add_new")}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {editingVideo ? "Perbarui informasi video ini." : t("description")}
                  </DialogDescription>
                </DialogHeader>

                <form id="video-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-foreground text-sm font-semibold">
                      {t("form.title")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="Masukan judul video..."
                        className="h-10 border-zinc-200 bg-white pl-9 font-medium transition-all focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-emerald-600"
                      />
                      <Pencil className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtube_id" className="text-foreground text-sm font-semibold">
                      {t("form.youtube_id")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="youtube_id"
                        value={formData.youtube_id}
                        onChange={handleYoutubeIdChange}
                        required
                        placeholder="Paste URL YouTube atau ID disini..."
                        className="h-10 border-zinc-200 bg-white pl-9 font-mono text-sm transition-all focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-emerald-600"
                      />
                      <LinkIcon className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                    </div>
                    <p className="text-muted-foreground mt-1.5 flex items-center gap-1 text-[11px] font-medium">
                      {isValidYoutubeId(formData.youtube_id) ? (
                        <span className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          ID Valid Terdeteksi
                        </span>
                      ) : (
                        <span className="text-zinc-500 dark:text-zinc-400">
                          Contoh: <code>youtu.be/xyz123</code> atau <code>xyz123</code>
                        </span>
                      )}
                    </p>
                  </div>
                </form>

                <DialogFooter className="mt-8">
                  <Button type="button" variant="ghost" onClick={closeDialog}>
                    {t("form.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    form="video-form"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("form.submit")}
                  </Button>
                </DialogFooter>
              </div>

              {/* Right Column: Preview */}
              <div className="relative flex flex-col items-center justify-center overflow-hidden border-l border-zinc-200 bg-zinc-50/50 p-6 text-center md:col-span-2 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="z-10 w-full max-w-[280px]">
                  <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
                    Live Preview
                  </p>

                  {/* Mock Card */}
                  <Card className="group overflow-hidden border-none bg-white shadow-xl transition-all dark:bg-zinc-950">
                    <div className="relative aspect-video w-full bg-black/10">
                      {isValidYoutubeId(formData.youtube_id) ? (
                        <>
                          <Image
                            src={getYoutubeThumbnail(formData.youtube_id)}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <PlayCircle className="h-10 w-10 text-white drop-shadow-lg" />
                          </div>
                        </>
                      ) : (
                        <div className="text-muted-foreground flex h-full items-center justify-center">
                          <VideoIcon className="h-8 w-8 opacity-20" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3 text-left">
                      <div className="bg-muted mb-2 hidden h-5 w-3/4 animate-pulse rounded group-[.isValid]:block" />
                      <h3 className="text-foreground mb-1 line-clamp-1 text-sm font-semibold">
                        {formData.title || (
                          <span className="text-muted-foreground font-normal italic">
                            Judul Video
                          </span>
                        )}
                      </h3>
                      <div className="text-muted-foreground flex items-center justify-between text-[10px]">
                        <span className="rounded bg-zinc-100 px-1 font-mono dark:bg-zinc-800">
                          {isValidYoutubeId(formData.youtube_id) ? formData.youtube_id : "ID VIDEO"}
                        </span>
                        <span>Baru saja</span>
                      </div>
                    </CardContent>
                  </Card>

                  {!isValidYoutubeId(formData.youtube_id) && (
                    <div className="text-muted-foreground mt-6 flex items-start gap-2 rounded border border-amber-200 bg-amber-50 p-2 text-left text-xs dark:border-amber-900/20 dark:bg-amber-900/10">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                      <p>
                        Masukkan link YouTube yang valid untuk melihat preview thumbnail secara
                        otomatis.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="bg-zinc-200 dark:bg-zinc-800" />

      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="group overflow-hidden border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-slate-950 dark:hover:shadow-black/30"
            >
              <div className="relative aspect-video w-full bg-black/5 transition-colors group-hover:bg-black/10">
                <Image
                  src={video.thumbnail || getYoutubeThumbnail(video.youtube_id)}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
                </div>

                {/* Action Menu (Top Right) */}
                <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full border-none bg-black/50 text-white shadow-sm backdrop-blur-sm hover:bg-black/70"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() =>
                          window.open(
                            `https://www.youtube.com/watch?v=${video.youtube_id}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="mr-2 h-4 w-4" /> Buka di YouTube
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(video)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDelete(video.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                  <h3
                    className="text-foreground line-clamp-2 text-base leading-tight font-bold transition-colors group-hover:text-emerald-600"
                    title={video.title}
                  >
                    {video.title}
                  </h3>
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:bg-zinc-800">
                      {video.youtube_id}
                    </span>
                    <span>{formatDate(video.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-24 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
          <div className="mb-6 rounded-full border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-slate-950">
            <VideoIcon className="h-10 w-10 text-zinc-400" />
          </div>
          <h3 className="text-foreground mb-2 text-xl font-bold">{t("empty")}</h3>
          <p className="text-muted-foreground max-w-sm">
            Belum ada video profil. Tambahkan video YouTube untuk memperkaya profil sekolah.
          </p>
          <Button
            className="mt-6 bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 dark:shadow-emerald-900/20"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Video Pertama
          </Button>
        </div>
      )}
    </div>
  );
}
