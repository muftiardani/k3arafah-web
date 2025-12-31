"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, Upload, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/date";
import { useGallery, useUploadGalleryPhoto, useDeleteGalleryPhoto } from "@/lib/hooks/useGalleries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function GalleryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const galleryId = Number(id);

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: gallery, isLoading } = useGallery(galleryId);
  const uploadMutation = useUploadGalleryPhoto(galleryId);
  const deleteMutation = useDeleteGalleryPhoto(galleryId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    setUploading(true);
    try {
      // Upload files one by one
      for (const file of uploadFiles) {
        await uploadMutation.mutateAsync(file);
      }
      setUploadFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = () => {
    if (photoToDelete) {
      deleteMutation.mutate(photoToDelete);
      setPhotoToDelete(null);
    }
  };

  if (isLoading) {
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
            <span>{formatDate(gallery.created_at, "long")}</span>
          </div>
        </div>
      </div>

      <div className="w-full space-y-8 px-4 md:px-0">
        {/* Upload Section */}
        <Card className="border-dashed shadow-sm">
          <CardContent className="flex flex-col items-center gap-6 p-6 md:flex-row">
            <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
              <Upload className="text-primary h-8 w-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold">Upload Foto Baru</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Tambahkan momen baru ke album ini. Mendukung upload multiple file sekaligus.
              </p>
            </div>
            <div className="flex w-full items-center gap-3 md:w-auto">
              <div className="relative">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-primary hover:bg-primary/90 shadow-primary/20 relative z-10 min-w-[140px] shadow-lg"
                >
                  {uploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {uploadFiles.length > 0 ? `Upload (${uploadFiles.length})` : "Pilih Foto"}
                </Button>
                {/* Visual indicator for Drag & Drop could be added here if implemented */}
              </div>

              {uploadFiles.length > 0 && (
                <Button variant="outline" onClick={handleUpload} disabled={uploading}>
                  Mulai Upload
                </Button>
              )}

              <Input
                ref={fileInputRef}
                id="photo-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Photo Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Koleksi Foto</h2>
            <p className="text-muted-foreground text-sm font-medium">
              {gallery.photos?.length || 0} items
            </p>
          </div>

          {gallery.photos?.length === 0 ? (
            <div className="bg-muted/30 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
              <div className="bg-background mb-4 rounded-full p-4 shadow-sm">
                <ImageIcon className="text-muted-foreground/30 h-8 w-8" />
              </div>
              <h3 className="font-semibold">Masih Kosong</h3>
              <p className="text-muted-foreground text-sm">Album ini belum memiliki foto.</p>
            </div>
          ) : (
            <div className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
              {gallery.photos?.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative cursor-zoom-in break-inside-avoid overflow-hidden rounded-xl bg-black/5"
                >
                  <Image
                    src={photo.photo_url}
                    alt="Gallery Photo"
                    width={500}
                    height={500}
                    className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Action Buttons */}
                  <div className="absolute right-3 bottom-3 flex translate-y-4 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-9 w-9 rounded-full border-2 border-white/20 shadow-lg transition-transform hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoToDelete(photo.id);
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Hapus Foto?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus foto ini secarah permanen? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
