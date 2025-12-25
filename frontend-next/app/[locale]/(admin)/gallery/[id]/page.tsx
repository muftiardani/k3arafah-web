"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

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
}

export default function GalleryDetailPage() {
  const { id } = useParams();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

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
      // Reset input manually if needed or just reload
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
      fetchGallery(); // Refresh list
    } catch {
      toast.error("Gagal menghapus foto");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!gallery) return <div className="p-10 text-center">Galeri tidak ditemukan</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/gallery">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{gallery.title}</h1>
          <p className="text-muted-foreground">{gallery.description}</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-card flex flex-col items-end gap-4 rounded-lg border p-6 sm:flex-row">
        <div className="w-full space-y-2">
          <label htmlFor="photo-upload" className="text-sm font-medium">
            Tambah Foto (Bisa banyak sekaligus)
          </label>
          <Input
            id="photo-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <p className="text-muted-foreground text-xs">Pilih file lalu klik Upload.</p>
        </div>
        <Button onClick={handleUpload} disabled={uploadFiles.length === 0 || uploading}>
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Upload {uploadFiles.length > 0 ? `(${uploadFiles.length})` : ""}
        </Button>
      </div>

      {/* Photos Grid */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <ImageIcon className="h-5 w-5" />
          Foto ({gallery.photos?.length || 0})
        </h2>

        {gallery.photos?.length === 0 ? (
          <div className="bg-muted/20 text-muted-foreground rounded-lg border py-10 text-center">
            Belum ada foto di album ini.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {gallery.photos?.map((photo) => (
              <div
                key={photo.id}
                className="group bg-muted relative aspect-square overflow-hidden rounded-md border"
              >
                <Image src={photo.photo_url} alt="Gallery Photo" fill className="object-cover" />
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="bg-destructive/90 hover:bg-destructive absolute top-2 right-2 rounded-md p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
