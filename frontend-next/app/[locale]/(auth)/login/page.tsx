"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Lock, School, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

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

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username minimal 2 karakter.",
  }),
  password: z.string().min(6, {
    message: "Password minimal 6 karakter.",
  }),
});

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Hit BFF Proxy to set HTTP-Only Cookie
      await api.post("/auth/login", values);

      toast.success("Login berhasil! Mengalihkan...");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Username atau password salah");
      setIsLoading(false); // Only stop loading on error, otherwise we navigate
    }
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
          K3 Arafah Admin
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Pendidikan adalah senjata paling ampuh yang dapat Anda gunakan untuk mengubah
              dunia.&rdquo;
            </p>
            <footer className="text-sm text-zinc-400">Nelson Mandela</footer>
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
            <h1 className="text-2xl font-semibold tracking-tight">Selamat Datang Kembali</h1>
            <p className="text-muted-foreground text-sm">
              Masukan kredensial Anda untuk mengakses dashboard.
            </p>
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
                      <FormLabel>Username</FormLabel>
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
                      <FormLabel>Password</FormLabel>
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
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>

          <p className="text-muted-foreground px-8 text-center text-sm">
            <Link href="/" className="hover:text-brand underline underline-offset-4">
              Kembali ke Beranda
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
