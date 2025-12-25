"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function PSBForm() {
  const router = useRouter();
  const t = useTranslations("PSB");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // We define schema inside component to access translations for error messages
  // or we can just pass the translation function if we extract it.
  // For simplicity inside component:
  const formSchema = z.object({
    // Data Santri
    full_name: z.string().min(3, t("validation.min_char", { min: 3 })),
    nik: z.string().length(16, t("validation.nik_length")).regex(/^\d+$/, t("validation.numeric")),
    birth_place: z.string().min(2, t("validation.required")),
    birth_date: z
      .string()
      .refine((date) => new Date(date).toString() !== "Invalid Date", t("validation.date_invalid")),
    gender: z.enum(["L", "P"] as const, { message: t("validation.required") }),
    address: z.string().min(10, t("validation.min_char", { min: 10 })),

    // Data Orang Tua
    father_name: z.string().min(3, t("validation.required")),
    father_job: z.string().min(3, t("validation.required")),
    mother_name: z.string().min(3, t("validation.required")),
    mother_job: z.string().min(3, t("validation.required")),
    parent_phone: z
      .string()
      .min(10, t("validation.phone_invalid"))
      .regex(/^\d+$/, t("validation.numeric")),

    // Data Pendidikan
    school_origin: z.string().min(3, t("validation.required")),
    school_address: z.string().min(5, t("validation.required")),
    graduation_year: z.string().regex(/^\d{4}$/, t("validation.year_format")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      nik: "",
      birth_place: "",
      birth_date: "",
      gender: "L",
      address: "",
      father_name: "",
      father_job: "",
      mother_name: "",
      mother_job: "",
      parent_phone: "",
      school_origin: "",
      school_address: "",
      graduation_year: new Date().getFullYear().toString(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        birth_date: new Date(values.birth_date).toISOString(),
      };

      await api.post("/psb/register", payload);

      toast.success(t("success_title"), {
        description: t("success_desc"),
      });
      router.push("/psb/success");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto max-w-4xl shadow-lg">
      <CardHeader className="border-b bg-emerald-50 text-center dark:bg-emerald-950/20">
        <CardTitle className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
          {t("title")}
        </CardTitle>
        <CardDescription className="mt-2 text-lg">{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ------------ SECTION 1: DATA SANTRI ------------ */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-bold text-emerald-700 dark:text-emerald-400">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-600">
                  1
                </span>
                {t("section_student")}
              </h3>
              <div className="grid gap-6 rounded-xl border bg-slate-50/50 p-4 md:grid-cols-2 dark:bg-slate-900/50">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("full_name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.full_name")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nik"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("nik")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.nik")} maxLength={16} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birth_place"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("birth_place")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.birth_place")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("birth_date")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("gender")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("placeholders.gender")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="L">{t("gender_male")}</SelectItem>
                          <SelectItem value="P">{t("gender_female")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>{t("address")}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t("placeholders.address")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ------------ SECTION 2: DATA ORANG TUA ------------ */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-bold text-emerald-700 dark:text-emerald-400">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-600">
                  2
                </span>
                {t("section_parents")}
              </h3>
              <div className="grid gap-6 rounded-xl border bg-slate-50/50 p-4 md:grid-cols-2 dark:bg-slate-900/50">
                <FormField
                  control={form.control}
                  name="father_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("father_name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="father_job"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("father_job")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.father_job")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mother_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("mother_name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mother_job"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("mother_job")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.mother_job")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parent_phone"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>{t("parent_phone")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.phone")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ------------ SECTION 3: DATA PENDIDIKAN ------------ */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-bold text-emerald-700 dark:text-emerald-400">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-600">
                  3
                </span>
                {t("section_education")}
              </h3>
              <div className="grid gap-6 rounded-xl border bg-slate-50/50 p-4 md:grid-cols-2 dark:bg-slate-900/50">
                <FormField
                  control={form.control}
                  name="school_origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("school_origin")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.school_origin")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="graduation_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("graduation_year")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("placeholders.year")} maxLength={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="school_address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>{t("school_address")}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t("placeholders.school_address")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full bg-emerald-600 py-6 text-lg hover:bg-emerald-700"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("submitting") : t("submit")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
