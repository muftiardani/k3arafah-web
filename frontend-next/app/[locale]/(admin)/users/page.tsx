"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Search,
  MoreHorizontal,
  ShieldAlert,
  UserCog,
  Filter,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/utils/date";
import { useAdmins, useCreateAdmin, useDeleteAdmin } from "@/lib/hooks/useUsers";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { TableEmptyState } from "@/components/ui/table-empty-state";

export default function UsersPage() {
  const t = useTranslations("Dashboard.UsersPage");
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "admin",
  });

  const { data: users = [], isLoading } = useAdmins();
  const createMutation = useCreateAdmin();
  const deleteMutation = useDeleteAdmin();

  const handleCreate = () => {
    if (!formData.username || !formData.password) {
      toast.error("Username dan Password wajib diisi");
      return;
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        setCreateOpen(false);
        setFormData({ username: "", password: "", role: "admin" });
        toast.success("Admin berhasil dibuat");
      },
    });
  };

  const handleDelete = (id: number) => {
    // Premium confirm dialog could be implemented here, using browser confirm for now
    if (!confirm(t("delete_confirm"))) return;
    deleteMutation.mutate(id);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.username.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-8 pb-10">
        <div className="space-y-2">
          <div className="bg-muted h-9 w-64 animate-pulse rounded-md" />
          <div className="bg-muted h-5 w-96 animate-pulse rounded-md" />
        </div>
        <div className="bg-muted h-[400px] w-full animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-lg">{t("description")}</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105 hover:bg-indigo-700 dark:shadow-indigo-900/20">
              <Plus className="mr-2 h-4 w-4" /> {t("add_new")}
            </Button>
          </DialogTrigger>
          <DialogContent className="border-zinc-200 shadow-2xl sm:max-w-[425px] dark:border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-xl">Tambah Admin Baru</DialogTitle>
              <DialogDescription>Buat akun admin baru untuk mengakses dashboard.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <UserCog className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                  <Input
                    id="username"
                    placeholder="johndoe"
                    className="pl-9"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <ShieldAlert className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) => setFormData({ ...formData, role: val })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-2 w-2 rounded-full p-0" /> Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="super_admin">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" /> Super
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Batal
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Buat User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-slate-950 dark:shadow-black/20">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-zinc-100 bg-zinc-50/50 p-4 md:flex-row dark:border-zinc-800/50 dark:bg-zinc-900/20">
          <div className="relative w-full max-w-sm">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Cari admin..."
              className="border-zinc-200 bg-white pl-9 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-slate-950"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex w-full items-center gap-2 md:w-auto">
            <Filter className="text-muted-foreground mr-1 h-4 w-4" />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px] bg-white dark:bg-slate-950">
                <SelectValue placeholder="Filter Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[250px] font-semibold">{t("table.username")}</TableHead>
                <TableHead className="font-semibold">{t("table.role")}</TableHead>
                <TableHead className="font-semibold">{t("table.created_at")}</TableHead>
                <TableHead className="text-right font-semibold">{t("table.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton cols={4} rows={3} />
              ) : filteredUsers.length === 0 ? (
                <TableEmptyState
                  cols={4}
                  title={t("empty")}
                  description="Belum ada admin yang terdaftar atau sesuai pencarian."
                />
              ) : (
                filteredUsers.map((item) => (
                  <TableRow
                    key={item.id}
                    className="group border-zinc-100 transition-colors hover:bg-zinc-50/80 dark:border-zinc-800/50 dark:hover:bg-zinc-900/30"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-zinc-100 shadow-sm dark:border-zinc-800">
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${item.username}&background=random`}
                          />
                          <AvatarFallback className="bg-indigo-100 font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            {item.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground font-medium">{item.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.role === "super_admin" ? "destructive" : "secondary"}
                        className="capitalize shadow-sm"
                      >
                        {t(`roles.${item.role}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(item.created_at || "")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/10"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Akun
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
