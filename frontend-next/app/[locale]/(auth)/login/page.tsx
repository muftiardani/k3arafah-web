"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, School, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useLogin } from "@/lib/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
  const router = useRouter();
  const t = useTranslations("Login");
  const { mutate: login, isPending: isLoading } = useLogin();

  const formSchema = z.object({
    username: z.string().min(2, {
      message: t("validation.username_min"),
    }),
    password: z.string().min(6, {
      message: t("validation.password_min"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    login(values);
  }

  return (
    <div className="relative container grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Panel - Visual & Branding */}
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />

        {/* Background Pattern/Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20" />

        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="bg-primary/20 mr-2 flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-sm">
            <School className="text-primary-foreground h-5 w-5" />
          </div>
          {t("admin_badge")}
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">&ldquo;{t("quote")}&rdquo;</p>
            <footer className="text-sm text-zinc-400">{t("quote_author")}</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {/* Mobile Text Branding */}
          <div className="flex flex-col space-y-2 text-center lg:hidden">
            <div className="bg-primary/10 mx-auto flex h-10 w-10 items-center justify-center rounded-lg">
              <School className="text-primary h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">K3 Arafah</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-2 text-center"
          >
            <h1 className="text-2xl font-semibold tracking-tight">{t("hello")}</h1>
            <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("username_label")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                          <Input className="pl-9" placeholder="admin" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("password_label")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                          <Input type="password" className="pl-9" placeholder="******" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("btn_submitting")}
                    </>
                  ) : (
                    <>
                      {t("btn_submit")} <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>

          <p className="text-muted-foreground px-8 text-center text-sm">
            <Link href="/" className="hover:text-brand underline underline-offset-4">
              {t("back_home")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
