"use client";

import { useState } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/utils/date";
import { useAdmins, useCreateAdmin, useDeleteAdmin } from "@/lib/hooks/useUsers";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { TableEmptyState } from "@/components/ui/table-empty-state";

export default function UsersPage() {
  const t = useTranslations("Dashboard.UsersPage");
  const [createOpen, setCreateOpen] = useState(false);
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
      },
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm(t("delete_confirm"))) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> {t("add_new")}
        </Button>
      </div>

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.username")}</TableHead>
              <TableHead>{t("table.role")}</TableHead>
              <TableHead>{t("table.created_at")}</TableHead>
              <TableHead className="text-right">{t("table.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton cols={4} rows={3} />
            ) : users.length === 0 ? (
              <TableEmptyState cols={4} title={t("empty")} />
            ) : (
              users.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.username}</TableCell>
                  <TableCell>
                    <Badge variant={item.role === "super_admin" ? "destructive" : "secondary"}>
                      {t(`roles.${item.role}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.created_at || "")}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      title={t("table.action")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Admin Baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Username</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buat User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
