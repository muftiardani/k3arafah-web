"use client";

import { useState, useRef } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Image as ImageIcon, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function CreateGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Judul wajib diisi");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (coverFile) {
      data.append("cover", coverFile);
    }

    try {
      await api.post("/galleries", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Album berhasil dibuat");
      router.push("/gallery");
    } catch (error) {
      console.error(error);
      toast.error("Gagal membuat album");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full">
          <Link href="/gallery">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buat Album Baru</h1>
          <p className="text-muted-foreground text-lg">
            Buat koleksi foto baru untuk kegiatan atau acara.
          </p>
        </div>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Main Details (Left Column) */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="text-primary h-5 w-5" />
                Detail Album
              </CardTitle>
              <CardDescription>Informasi dasar mengenai album foto ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base">
                  Judul Album
                </Label>
                <Input
                  id="title"
                  placeholder="Contoh: Kegiatan Idul Adha 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">
                  Deskripsi
                </Label>
                <Textarea
                  id="description"
                  placeholder="Deskripsi singkat kegiatan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[150px] resize-y text-base"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" asChild>
              <Link href="/gallery">Batal</Link>
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[140px]">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
                </>
              ) : (
                "Buat Album"
              )}
            </Button>
          </div>
        </div>

        {/* Sidebar (Right Column) - Cover Image */}
        <div className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Cover Album</CardTitle>
              <CardDescription>Gambar sampul yang akan muncul di daftar galeri.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div
                  className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all ${
                    coverPreview
                      ? "border-primary/50 bg-primary/5"
                      : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  {coverPreview ? (
                    <div className="group relative aspect-video w-full overflow-hidden rounded-lg shadow-sm">
                      <Image src={coverPreview} alt="Preview" fill className="object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={clearCover}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="flex w-full cursor-pointer flex-col items-center gap-3 py-8 focus:outline-none"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="bg-background rounded-full p-4 shadow-sm">
                        <UploadCloud className="text-primary/60 h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground text-sm font-medium">
                          Klik untuk upload cover
                        </p>
                        <p className="text-muted-foreground text-xs">JPG, PNG (Max 2MB)</p>
                      </div>
                    </button>
                  )}
                  <Input
                    ref={fileInputRef}
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
