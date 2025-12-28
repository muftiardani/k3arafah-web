"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Plus,
  Trash2,
  Video as VideoIcon,
  Loader2,
  Pencil,
  ExternalLink,
  PlayCircle,
  MoreVertical,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

import { getVideos, createVideo, updateVideo, deleteVideo, Video } from "@/lib/api";
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

export default function VideosPage() {
  const t = useTranslations("Dashboard.VideosPage");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    youtube_id: "",
    thumbnail: "",
  });

  // Fetch Videos
  const { data: videos, isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: createVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success(t("toast_created"));
      closeDialog();
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(t("toast_failed") + ": " + (error.response?.data?.message || error.message));
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { title?: string; youtube_id?: string; thumbnail?: string };
    }) => updateVideo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success(t("toast_updated") || "Video updated successfully");
      closeDialog();
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(t("toast_failed") + ": " + (error.response?.data?.message || error.message));
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success(t("toast_deleted"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("toast_failed"));
    },
  });

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
      updateMutation.mutate({ id: editingVideo.id, data: formData });
    } else {
      createMutation.mutate(formData);
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
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-muted-foreground animate-pulse">Memuat koleksi video...</p>
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-primary/20 shadow-lg transition-all hover:scale-105">
              <Plus className="mr-2 h-5 w-5" /> {t("add_new")}
            </Button>
          </DialogTrigger>
          <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-4xl">
            <div className="grid h-full md:grid-cols-5">
              {/* Left Column: Form */}
              <div className="space-y-6 p-6 md:col-span-3">
                <DialogHeader className="px-0">
                  <DialogTitle className="text-xl">
                    {editingVideo ? "Edit Video" : t("add_new")}
                  </DialogTitle>
                  <DialogDescription>
                    {editingVideo ? "Perbarui informasi video ini." : t("description")}
                  </DialogDescription>
                </DialogHeader>

                <form id="video-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-semibold">
                      {t("form.title")}
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Masukkan judul video..."
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtube_id" className="font-semibold">
                      {t("form.youtube_id")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="youtube_id"
                        value={formData.youtube_id}
                        onChange={handleYoutubeIdChange}
                        required
                        placeholder="Paste URL YouTube atau ID disini..."
                        className="h-10 pl-9 font-mono text-sm"
                      />
                      <LinkIcon className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                    </div>
                    <p className="text-muted-foreground flex items-center gap-1 text-xs">
                      {isValidYoutubeId(formData.youtube_id) ? (
                        <span className="flex items-center gap-1 text-green-600">
                          ✓ ID Valid Terdeteksi
                        </span>
                      ) : (
                        "Bisa paste link lengkap (youtube.com/Watch?v=...) atau ID saja."
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
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("form.submit")}
                  </Button>
                </DialogFooter>
              </div>

              {/* Right Column: Preview */}
              <div className="bg-muted/30 relative flex flex-col items-center justify-center overflow-hidden border-l p-6 text-center md:col-span-2">
                <div className="from-primary/5 pointer-events-none absolute inset-0 bg-linear-to-br to-transparent" />

                <div className="z-10 w-full max-w-[280px]">
                  <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
                    Live Preview
                  </p>

                  {/* Mock Card */}
                  <Card className="group bg-background overflow-hidden border-none shadow-xl transition-all">
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
                      <h3 className="mb-1 line-clamp-1 text-sm font-semibold">
                        {formData.title || (
                          <span className="text-muted-foreground font-normal italic">
                            Judul Video
                          </span>
                        )}
                      </h3>
                      <div className="text-muted-foreground flex items-center justify-between text-[10px]">
                        <span className="bg-muted rounded px-1 font-mono">
                          {isValidYoutubeId(formData.youtube_id) ? formData.youtube_id : "ID VIDEO"}
                        </span>
                        <span>Baru saja</span>
                      </div>
                    </CardContent>
                  </Card>

                  {!isValidYoutubeId(formData.youtube_id) && (
                    <div className="text-muted-foreground bg-background/50 mt-6 flex items-start gap-2 rounded border p-2 text-left text-xs">
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

      <Separator className="bg-border/60" />

      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="group overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-xl"
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
                        className="h-8 w-8 rounded-full border-none bg-black/50 text-white shadow-sm hover:bg-black/70"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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

              <CardContent className="p-2">
                <div className="flex flex-col gap-3">
                  <h3 className="line-clamp-1 text-lg font-bold" title={video.title}>
                    {video.title}
                  </h3>
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span className="bg-muted rounded px-1.5 py-0.5 font-mono">
                      {video.youtube_id}
                    </span>
                    <span>
                      {new Date(video.created_at).toLocaleDateString("id-ID", {
                        dateStyle: "medium",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 border-muted-foreground/20 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20 text-center">
          <div className="bg-background mb-6 rounded-full p-6 shadow-sm">
            <VideoIcon className="text-muted-foreground/50 h-12 w-12" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">{t("empty")}</h3>
          <p className="text-muted-foreground max-w-sm">
            Belum ada video profil. Tambahkan video YouTube untuk memperkaya profil sekolah.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Video Pertama
          </Button>
        </div>
      )}
    </div>
  );
}
