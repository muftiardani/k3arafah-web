"use client";

import { useState, useMemo } from "react";
import api from "@/lib/api";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CheckCircle2,
  Loader2,
  Download,
  Users,
  UserCheck,
  Clock,
  XCircle,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/utils/date";
import { useRegistrants, useVerifyRegistrant } from "@/lib/hooks/usePsb";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Santri } from "@/types";

export default function RegistrantsPage() {
  const t = useTranslations("Dashboard.RegistrantsPage");
  const tStatus = useTranslations("Dashboard.Status");

  const [verifyOpen, setVerifyOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [search, setSearch] = useState("");
  const [verifyData, setVerifyData] = useState({
    nis: "",
    class: "",
    entry_year: new Date().getFullYear(),
  });

  const { data: registrants = [], isLoading } = useRegistrants();
  const verifyMutation = useVerifyRegistrant();

  // Calculate Stats
  const stats = useMemo(() => {
    return {
      total: registrants.length,
      accepted: registrants.filter((r) => r.status === "ACCEPTED").length,
      pending: registrants.filter((r) => r.status === "PENDING" || r.status === "VERIFIED").length,
      rejected: registrants.filter((r) => r.status === "REJECTED").length,
    };
  }, [registrants]);

  const filteredRegistrants = useMemo(() => {
    if (!search) return registrants;
    return registrants.filter((r) => r.full_name.toLowerCase().includes(search.toLowerCase()));
  }, [registrants, search]);

  const handleOpenVerify = (santri: Santri) => {
    setSelectedSantri(santri);
    setVerifyData({
      nis: "",
      class: "1A",
      entry_year: new Date().getFullYear(),
    });
    setVerifyOpen(true);
  };

  const handleVerify = () => {
    if (!verifyData.nis || !verifyData.class) {
      toast.error(t("dialog.validation_required"));
      return;
    }

    if (!selectedSantri) return;

    verifyMutation.mutate(
      { id: selectedSantri.id, data: verifyData },
      {
        onSuccess: () => {
          setVerifyOpen(false);
          toast.success("Santri berhasil diverifikasi!");
        },
      }
    );
  };

  const handleExportExcel = async () => {
    try {
      toast.info("Memproses export Excel...");
      const response = await api.get("/export/santri/excel", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `santri-export-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Excel berhasil diunduh!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal mengunduh Excel.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-8 pb-10">
        <div className="space-y-2">
          <div className="bg-muted h-9 w-48 animate-pulse rounded-md" />
          <div className="bg-muted h-5 w-96 animate-pulse rounded-md" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted h-24 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="bg-muted h-[400px] w-full animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            {t("description") || "Kelola data pendaftar baru yang masuk sistem."}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExportExcel}
          className="shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md dark:hover:bg-emerald-900/20"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Excel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-slate-950">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Total Pendaftar
              </p>
              <h3 className="text-2xl font-bold tracking-tight">{stats.total}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-slate-950">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-green-50 p-3 text-green-600 dark:bg-green-900/20 dark:text-green-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Diterima
              </p>
              <h3 className="text-2xl font-bold tracking-tight">{stats.accepted}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-slate-950">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Menunggu
              </p>
              <h3 className="text-2xl font-bold tracking-tight">{stats.pending}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-slate-950">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Ditolak
              </p>
              <h3 className="text-2xl font-bold tracking-tight">{stats.rejected}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-slate-950 dark:shadow-black/20">
        <div className="flex items-center gap-4 border-b border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800/50 dark:bg-zinc-900/20">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Cari nama pendaftar..."
              className="border-zinc-200 bg-white pl-9 focus-visible:ring-emerald-500 dark:border-zinc-800 dark:bg-slate-950"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px] font-semibold">{t("table.name")}</TableHead>
                <TableHead className="text-center font-semibold">{t("table.gender")}</TableHead>
                <TableHead className="text-center font-semibold">{t("table.status")}</TableHead>
                <TableHead className="text-center font-semibold">{t("table.date")}</TableHead>
                <TableHead className="pr-6 text-right font-semibold">{t("table.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton cols={5} rows={5} />
              ) : filteredRegistrants.length === 0 ? (
                <TableEmptyState
                  cols={5}
                  title={t("empty")}
                  description={search ? "Tidak ada hasil pencarian." : "Belum ada pendaftar baru."}
                />
              ) : (
                filteredRegistrants.map((item) => (
                  <TableRow
                    key={item.id}
                    className="group border-zinc-100 transition-colors hover:bg-zinc-50/80 dark:border-zinc-800/50 dark:hover:bg-zinc-900/30"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-zinc-100 shadow-sm dark:border-zinc-800">
                          {item.photo_url ? (
                            <AvatarImage src={item.photo_url} className="object-cover" />
                          ) : (
                            <AvatarFallback className="bg-emerald-100 font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                              {item.full_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-foreground font-semibold transition-colors group-hover:text-emerald-600">
                          {item.full_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.gender === "L" ? (
                        <Badge
                          variant="secondary"
                          className="border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          Laki-laki
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="border-pink-100 bg-pink-50 text-pink-700 hover:bg-pink-100"
                        >
                          Perempuan
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={
                          item.status === "ACCEPTED"
                            ? "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : item.status === "VERIFIED"
                              ? "border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : "border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        }
                        variant="outline"
                      >
                        {tStatus(
                          item.status.toLowerCase() as
                            | "pending"
                            | "verified"
                            | "accepted"
                            | "rejected"
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center font-mono text-sm">
                      {formatDate(item.created_at)}
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      {item.status !== "ACCEPTED" && (
                        <Button
                          size="sm"
                          className="gap-2 bg-emerald-600 text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
                          onClick={() => handleOpenVerify(item)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {t("verify")}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <DialogContent className="border-zinc-200 shadow-2xl sm:max-w-md dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle>{t("dialog.title")}</DialogTitle>
            <DialogDescription>
              Verifikasi data santri sebelum menerima pendaftaran.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex items-center gap-4 rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
              <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-700">
                <AvatarFallback className="bg-emerald-100 text-emerald-600">
                  {selectedSantri?.full_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-muted-foreground text-sm font-medium">{t("dialog.name")}</p>
                <p className="text-foreground font-semibold">{selectedSantri?.full_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nis">{t("dialog.set_nis")}</Label>
                <Input
                  id="nis"
                  value={verifyData.nis}
                  onChange={(e) => setVerifyData({ ...verifyData, nis: e.target.value })}
                  placeholder="CTH: 2024001"
                  className="bg-white font-mono dark:bg-zinc-950"
                  // autoFocus removed for accessibility
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="class">{t("dialog.initial_class")}</Label>
                <Input
                  id="class"
                  value={verifyData.class}
                  onChange={(e) => setVerifyData({ ...verifyData, class: e.target.value })}
                  placeholder="CTH: 1A"
                  className="bg-white dark:bg-zinc-950"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">{t("dialog.entry_year")}</Label>
              <Input
                id="year"
                type="number"
                value={verifyData.entry_year}
                onChange={(e) =>
                  setVerifyData({ ...verifyData, entry_year: parseInt(e.target.value) })
                }
                className="bg-white dark:bg-zinc-950"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyOpen(false)}>
              {t("dialog.cancel")}
            </Button>
            <Button
              onClick={handleVerify}
              disabled={verifyMutation.isPending}
              className="bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 dark:shadow-emerald-900/20"
            >
              {verifyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("dialog.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
