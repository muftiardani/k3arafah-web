"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createArticle } from "@/lib/services/articleService";
import { useRouter } from "next/navigation";
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
import { Save, Globe, Image as ImageIcon, Sparkles, ChevronLeft } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(5, { message: "Judul minimal 5 karakter." }),
  content: z.string().min(20, { message: "Konten minimal 20 karakter." }),
  is_published: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      is_published: true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await createArticle(values);
      toast.success("Artikel berhasil dibuat");
      router.push("/dashboard/articles");
    } catch (error) {
      console.error(error);
      toast.error("Gagal membuat artikel");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Header Action Bar */}
          <div className="sticky top-0 z-50 -mx-4 -mt-4 mb-8 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-8 py-4 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-slate-950/80">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="rounded-full transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Link href="/dashboard/articles">
                  <ChevronLeft className="text-muted-foreground h-5 w-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight">Buat Artikel Baru</h1>
                  <span className="text-zinc-300 dark:text-zinc-700">/</span>
                  <span className="text-muted-foreground text-sm font-medium">Editor</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[130px] bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
              >
                {isSubmitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Simpan Artikel
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            {/* Main Content (Left Column) */}
            <div className="space-y-6 lg:col-span-2">
              <Card className="overflow-hidden border-0 bg-white shadow-xl ring-1 shadow-zinc-200/50 ring-zinc-200 dark:bg-slate-950 dark:shadow-black/20 dark:ring-zinc-800">
                <div className="h-2 w-full bg-linear-to-r from-emerald-500 via-teal-500 to-blue-500" />
                <CardContent className="space-y-8 p-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Judul Artikel..."
                            className="placeholder:text-muted-foreground/40 h-auto rounded-none border-0 border-b-2 border-zinc-100 px-0 py-4 text-3xl font-bold transition-colors focus-visible:border-emerald-500 focus-visible:ring-0 dark:border-zinc-800"
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
                        <FormControl>
                          <Textarea
                            placeholder="Mulai menulis cerita Anda di sini..."
                            className="placeholder:text-muted-foreground/30 min-h-[500px] resize-y border-0 p-0 font-serif text-lg leading-relaxed focus-visible:ring-0"
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
              {/* Publish Controls */}
              <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
                <CardHeader className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
                  <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
                    <Globe className="h-4 w-4" /> Publikasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="is_published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="space-y-1">
                          <FormLabel className="text-base font-semibold">
                            {field.value ? "Published" : "Draft"}
                          </FormLabel>
                          <FormDescription className="text-xs">
                            {field.value ? "Terlihat oleh publik" : "Hanya terlihat admin"}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-emerald-600"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Thumbnail Placeholder */}
              <Card className="group relative overflow-hidden border-zinc-200 shadow-sm dark:border-zinc-800">
                <div className="absolute inset-0 z-20 flex cursor-not-allowed items-center justify-center bg-zinc-50/50 backdrop-blur-[1px] dark:bg-zinc-900/50">
                  <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 shadow-sm dark:border-zinc-700 dark:bg-slate-800">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-muted-foreground text-xs font-medium">Pro Feature</span>
                  </div>
                </div>
                <CardHeader className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
                  <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
                    <ImageIcon className="h-4 w-4" /> Thumbnail
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center transition-colors group-hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:group-hover:border-zinc-700">
                    <div className="rounded-full bg-white p-3 shadow-sm dark:bg-slate-950">
                      <ImageIcon className="h-6 w-6 text-zinc-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm font-medium">Upload Gambar</p>
                      <p className="text-muted-foreground/60 text-xs">Drag & drop atau klik</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
