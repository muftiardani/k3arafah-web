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
import { submitContactForm } from "@/lib/services/contactService";

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await submitContactForm(values);
      toast.success(t("toast_success"));
      form.reset();
    } catch (error) {
      toast.error(t("toast_fail"));
    } finally {
      setIsSubmitting(false);
    }
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
          className="w-full bg-linear-to-r from-emerald-600 to-teal-600 font-bold text-white shadow-lg transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-500/25"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          aria-describedby={isSubmitting ? "contact-form-loading" : undefined}
        >
          {isSubmitting ? (
            <>
              <span
                className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
              <span id="contact-form-loading">{t("btn_submitting")}</span>
            </>
          ) : (
            t("btn_submit")
          )}
        </Button>
      </form>
    </Form>
  );
}
