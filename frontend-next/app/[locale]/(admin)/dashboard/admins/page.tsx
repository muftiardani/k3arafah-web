"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Shield, ShieldCheck, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useAdmins, useCreateAdmin, useDeleteAdmin } from "@/lib/hooks";
import { useAuthStore } from "@/store/useAuthStore";

const createAdminSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

type CreateAdminFormData = z.infer<typeof createAdminSchema>;

export default function AdminsPage() {
  const t = useTranslations("Dashboard.AdminsPage");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.user);

  const { data: admins, isLoading, error } = useAdmins();
  const { mutate: createAdmin, isPending: isCreating } = useCreateAdmin();
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();

  const form = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: CreateAdminFormData) {
    createAdmin(values, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      },
    });
  }

  function handleDelete(id: number) {
    if (confirm(t("delete_confirm"))) {
      deleteAdmin(id);
    }
  }

  // Check if current user is super_admin
  if (currentUser?.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Shield className="text-muted-foreground mb-4 h-16 w-16" />
        <h2 className="text-xl font-semibold">{t("access_denied")}</h2>
        <p className="text-muted-foreground">{t("super_admin_only")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="bg-muted h-8 w-48 animate-pulse rounded" />
            <div className="bg-muted h-4 w-72 animate-pulse rounded" />
          </div>
          <div className="bg-muted h-10 w-32 animate-pulse rounded" />
        </div>

        <Card>
          <CardHeader>
            <div className="bg-muted mb-2 h-6 w-32 animate-pulse rounded" />
            <div className="bg-muted h-4 w-64 animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="bg-muted/50 grid grid-cols-4 border-b p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-muted h-4 w-20 animate-pulse rounded" />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 items-center gap-4 border-b p-4 last:border-0"
                >
                  <div className="bg-muted h-4 w-8 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                  <div className="bg-muted h-6 w-24 animate-pulse rounded-full" />
                  <div className="flex justify-end">
                    <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive py-12 text-center">{t("error_loading")}</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-lg">{t("description")}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> {t("add_new")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("dialog_title")}</DialogTitle>
              <DialogDescription>{t("dialog_description")}</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.username")}</FormLabel>
                      <FormControl>
                        <Input placeholder="admin_baru" {...field} />
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
                      <FormLabel>{t("form.password")}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("form.creating")}
                      </>
                    ) : (
                      t("form.create")
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("table.title")}</CardTitle>
          <CardDescription>{t("table.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {admins && admins.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t("table.username")}</TableHead>
                    <TableHead>{t("table.role")}</TableHead>
                    <TableHead className="text-right">{t("table.action")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-mono text-sm">{admin.id}</TableCell>
                      <TableCell className="font-medium">{admin.username}</TableCell>
                      <TableCell>
                        <Badge
                          variant={admin.role === "super_admin" ? "default" : "secondary"}
                          className={admin.role === "super_admin" ? "bg-purple-600" : ""}
                        >
                          {admin.role === "super_admin" ? (
                            <ShieldCheck className="mr-1 h-3 w-3" />
                          ) : (
                            <Shield className="mr-1 h-3 w-3" />
                          )}
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDelete(admin.id)}
                          disabled={admin.id === currentUser?.id || isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
              <Shield className="mb-4 h-12 w-12 opacity-20" />
              <p>{t("empty")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
