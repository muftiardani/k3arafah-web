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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

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
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">Edit Artikel</h1>

      <Card>
        <CardHeader>
          <CardTitle>Formulir Edit</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Artikel</FormLabel>
                    <FormControl>
                      <Input placeholder="Berita Terbaru..." {...field} />
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
                    <FormLabel>Konten</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tulis isi artikel di sini..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Gambar (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Publikasikan Langsung</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
