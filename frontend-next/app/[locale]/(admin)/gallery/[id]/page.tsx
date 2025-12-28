"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Upload, Loader2, Image as ImageIcon, X, ZoomIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Photo {
  id: number;
  photo_url: string;
  caption: string;
}

interface Gallery {
  id: number;
  title: string;
  description: string;
  cover_url: string;
  photos: Photo[];
  created_at: string;
}

export default function GalleryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchGallery = useCallback(async () => {
    try {
      const response = await api.get(`/galleries/${id}`);
      setGallery(response.data.data);
    } catch (error) {
      console.error("Failed to fetch gallery", error);
      toast.error("Gagal memuat galeri");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    setUploading(true);
    const data = new FormData();
    uploadFiles.forEach((file) => {
      data.append("photos", file);
    });

    try {
      await api.post(`/galleries/${id}/photos`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Foto berhasil diupload");
      setUploadFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchGallery();
    } catch (error) {
      console.error(error);
      toast.error("Gagal upload foto");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm("Hapus foto ini?")) return;
    try {
      await api.delete(`/galleries/photos/${photoId}`);
      toast.success("Foto dihapus");
      setGallery((prev) =>
        prev
          ? {
              ...prev,
              photos: prev.photos.filter((p) => p.id !== photoId),
            }
          : null
      );
    } catch {
      toast.error("Gagal menghapus foto");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-muted-foreground animate-pulse">Memuat foto...</p>
      </div>
    );
  }

  if (!gallery) return <div className="p-10 text-center">Galeri tidak ditemukan</div>;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header / Hero Section */}
      <div className="bg-muted relative h-[300px] w-full overflow-hidden rounded-3xl shadow-xl md:h-[400px]">
        {gallery.cover_url && (
          <Image
            src={gallery.cover_url}
            alt={gallery.title}
            fill
            className="scale-105 object-cover blur-[2px] brightness-50"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full border-white/10 bg-white/20 text-white shadow-lg backdrop-blur-md hover:bg-white/30"
            onClick={() => router.push("/gallery")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 z-10 w-full p-8 text-white">
          <h1 className="mb-2 text-3xl font-bold tracking-tight shadow-black/50 drop-shadow-md md:text-5xl">
            {gallery.title}
          </h1>
          <p className="mb-4 max-w-2xl text-lg text-white/80 drop-shadow-sm">
            {gallery.description || "Tidak ada deskripsi"}
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-white/60">
            <span className="flex items-center gap-1">
              <ImageIcon className="h-4 w-4" /> {gallery.photos?.length || 0} Foto
            </span>
            <span>•</span>
            <span>
              {new Date(gallery.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full space-y-8 px-4 md:px-0">
        {/* Upload Section */}
        <Card className="bg-muted/30 border-2 border-dashed shadow-none">
          <CardContent className="flex flex-col items-center gap-6 p-6 md:flex-row">
            <div className="bg-background rounded-full p-4 shadow-sm">
              <Upload className="text-primary h-6 w-6" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold">Upload Foto</h3>
              <p className="text-muted-foreground text-sm">
                Tambahkan momen baru ke album ini. Bisa upload banyak sekaligus.
              </p>
            </div>
            <div className="flex w-full items-center gap-3 md:w-auto">
              <Input
                ref={fileInputRef}
                id="photo-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="bg-background cursor-pointer"
              />
              <Button
                onClick={handleUpload}
                disabled={uploadFiles.length === 0 || uploading}
                className="min-w-[100px]"
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload {uploadFiles.length > 0 && `(${uploadFiles.length})`}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Photo Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Koleksi Foto</h2>

          {gallery.photos?.length === 0 ? (
            <div className="bg-muted/30 flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
              <ImageIcon className="text-muted-foreground/30 mb-4 h-12 w-12" />
              <p className="text-muted-foreground">Album ini masih kosong.</p>
            </div>
          ) : (
            <div className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
              {gallery.photos?.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative cursor-zoom-in break-inside-avoid overflow-hidden rounded-xl"
                >
                  <Image
                    src={photo.photo_url}
                    alt="Gallery Photo"
                    width={500}
                    height={500}
                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-9 w-9 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photo.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
