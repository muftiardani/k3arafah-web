"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Save, FileText, Globe, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(5, { message: "Judul minimal 5 karakter." }),
  content: z.string().min(20, { message: "Konten minimal 20 karakter." }),
  is_published: z.boolean(),
  thumbnail_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id; // Get ID from URL

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      is_published: false,
      thumbnail_url: "",
    },
  });

  // Fetch Exisiting Article
  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await api.get(`/articles/${id}`);
        // Response format: { status: true, message: "...", data: { ... } }
        const article = response.data.data;

        form.reset({
          title: article.title,
          content: article.content,
          is_published: article.is_published,
          thumbnail_url: article.thumbnail_url || "",
        });
      } catch (error) {
        console.error("Failed to fetch article", error);
        toast.error("Gagal memuat artikel");
        router.push("/dashboard/articles");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchArticle();
    }
  }, [id, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await api.put(`/articles/${id}`, values);
      toast.success("Artikel berhasil diperbarui");
      router.push("/dashboard/articles"); // Return to Dashboard List
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui artikel");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-muted-foreground animate-pulse">Memuat konten artikel...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full">
          <Link href="/dashboard/articles">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Artikel</h1>
          <p className="text-muted-foreground text-lg">Perbarui konten artikel ini.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            Batal
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              "Menyimpan..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Simpan
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
          {/* Main Content (Left Column) */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-primary h-5 w-5" />
                  Konten Artikel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Judul Artikel</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan judul artikel yang menarik..."
                          className="h-12 text-lg font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Isi Konten</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mulai menulis cerita Anda di sini..."
                          className="min-h-[400px] resize-y p-4 text-base leading-relaxed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-6">
            {/* Publish Status Card */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="text-primary h-4 w-4" />
                  Status Publikasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="bg-muted/20 flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {field.value ? "Terbit" : "Draft"}
                        </FormLabel>
                        <FormDescription>
                          {field.value
                            ? "Artikel terlihat oleh publik."
                            : "Hanya terlihat oleh admin."}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Thumbnail Placeholder Card */}
            <Card className="relative cursor-not-allowed overflow-hidden border-none opacity-80 shadow-md">
              <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]">
                <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">
                  Coming Soon
                </span>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="text-primary h-4 w-4" />
                  Gambar Sampul
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground hover:bg-muted/50 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors">
                  <ImageIcon className="h-10 w-10 opacity-50" />
                  <span className="text-sm">Klik untuk upload gambar</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
