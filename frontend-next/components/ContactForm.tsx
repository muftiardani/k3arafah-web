"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

// Schema moved inside
// const formSchema = z.object({
//   name: z.string().min(2, { message: "Nama minimal 2 karakter." }),
//   email: z.string().email({ message: "Email tidak valid." }),
//   subject: z.string().min(5, { message: "Subjek minimal 5 karakter." }),
//   message: z.string().min(10, { message: "Pesan minimal 10 karakter." }),
// });

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, { message: t("validation_name") }),
    email: z.string().email({ message: t("validation_email") }),
    subject: z.string().min(5, { message: t("validation_subject") }),
    message: z.string().min(10, { message: t("validation_message") }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // We use useForm hook but validation messages need to be dynamic.
  // Ideally schema is created inside component or we pass t to it.
  // Let's assume for now we keep schema outside but we can't translate easily outside.
  // Converting to inside component schema definition:
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Pesan Anda telah terkirim!");
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form_name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form_name_placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form_email")}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t("form_email_placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form_subject")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form_subject_placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form_message")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("form_message_placeholder")}
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("btn_submitting") : t("btn_submit")}
        </Button>
      </form>
    </Form>
  );
}
