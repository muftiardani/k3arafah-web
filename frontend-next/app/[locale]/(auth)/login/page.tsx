"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, Variants } from "framer-motion";
import { User, Lock, School, ArrowRight, Loader2, Quote } from "lucide-react";
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

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="relative container grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Panel - Visual & Branding */}
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        {/* Rich Animated Background */}
        <div className="absolute inset-0 overflow-hidden bg-zinc-900">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-900/90 via-slate-900/90 to-zinc-900/95" />
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-600/20 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px]" />

          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-sm shadow-black/5 backdrop-blur-md">
            <School className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">K3 Arafah</span>
        </div>

        <div className="relative z-20 mt-auto max-w-lg">
          <motion.blockquote
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-4 border-l-2 border-emerald-500/50 pl-6"
          >
            <Quote className="mb-2 h-8 w-8 text-emerald-400/50" />
            <p className="text-2xl leading-relaxed font-light tracking-wide text-white/90">
              &ldquo;{t("quote")}&rdquo;
            </p>
            <footer className="flex items-center gap-2 text-sm font-medium text-emerald-200/80">
              <div className="h-px w-8 bg-emerald-500/50" />
              {t("quote_author")}
            </footer>
          </motion.blockquote>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="relative lg:p-8">
        {/* Mobile Background Decoration */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-emerald-50/50 to-transparent lg:hidden" />

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {/* Mobile Header */}
          <div className="flex flex-col items-center space-y-2 text-center lg:hidden">
            <div className="bg-primary/10 shadow-primary/5 border-primary/10 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-sm">
              <School className="text-primary h-7 w-7" />
            </div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight">K3 Arafah</h1>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col space-y-2 text-center"
          >
            <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight">
              {t("hello")}
            </motion.h1>
            <motion.p variants={itemVariants} className="text-muted-foreground text-sm">
              {t("subtitle")}
            </motion.p>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <motion.div variants={itemVariants}>
                      <FormItem>
                        <FormLabel className="text-foreground/80">{t("username_label")}</FormLabel>
                        <FormControl>
                          <div className="group relative">
                            <User className="text-muted-foreground group-hover:text-primary absolute top-3 left-3 z-10 h-4 w-4 transition-colors duration-300" />
                            <Input
                              className="border-muted-foreground/20 focus-visible:ring-primary/20 focus-visible:border-primary bg-background/50 h-10 pl-10 backdrop-blur-sm transition-all duration-300"
                              placeholder="admin"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </motion.div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <motion.div variants={itemVariants}>
                      <FormItem>
                        <FormLabel className="text-foreground/80">{t("password_label")}</FormLabel>
                        <FormControl>
                          <div className="group relative">
                            <Lock className="text-muted-foreground group-hover:text-primary absolute top-3 left-3 z-10 h-4 w-4 transition-colors duration-300" />
                            <Input
                              type="password"
                              className="border-muted-foreground/20 focus-visible:ring-primary/20 focus-visible:border-primary bg-background/50 h-10 pl-10 backdrop-blur-sm transition-all duration-300"
                              placeholder="••••••••"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </motion.div>
                  )}
                />

                <motion.div variants={itemVariants} className="pt-2">
                  <Button
                    className="shadow-primary/25 hover:shadow-primary/40 from-primary to-primary/90 h-10 w-full bg-linear-to-r font-medium shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    type="submit"
                    disabled={isLoading}
                  >
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
                </motion.div>
              </form>
            </Form>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-muted-foreground px-8 text-center text-sm"
          >
            <Link
              href="/"
              className="hover:text-primary underline-offset-4 transition-colors hover:underline"
            >
              {t("back_home")}
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
