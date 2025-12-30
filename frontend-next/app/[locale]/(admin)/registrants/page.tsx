"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/utils/date";
import { useRegistrants, useVerifyRegistrant } from "@/lib/hooks/usePsb";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import type { Santri } from "@/types";

export default function RegistrantsPage() {
  const t = useTranslations("Dashboard.RegistrantsPage");
  const tStatus = useTranslations("Dashboard.Status");

  const [verifyOpen, setVerifyOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [verifyData, setVerifyData] = useState({
    nis: "",
    class: "",
    entry_year: new Date().getFullYear(),
  });

  const { data: registrants = [], isLoading } = useRegistrants();
  const verifyMutation = useVerifyRegistrant();

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
      toast.error("Gagal mengunduh Excel. Pastikan Anda memiliki akses.");
    }
  };

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-lg">
          Kelola data pendaftar baru yang masuk sistem.
        </p>
      </div>

      <div className="flex items-center justify-end">
        <Button variant="outline" onClick={handleExportExcel}>
          <Download className="mr-2 h-4 w-4" />
          Export Excel
        </Button>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border shadow-md transition-all hover:shadow-lg">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-center font-semibold">{t("table.name")}</TableHead>
              <TableHead className="text-center font-semibold">{t("table.gender")}</TableHead>
              <TableHead className="text-center font-semibold">{t("table.status")}</TableHead>
              <TableHead className="text-center font-semibold">{t("table.date")}</TableHead>
              <TableHead className="text-center font-semibold">{t("table.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton cols={5} rows={5} />
            ) : registrants.length === 0 ? (
              <TableEmptyState
                cols={5}
                title={t("empty")}
                description="Belum ada pendaftar baru."
              />
            ) : (
              registrants.map((item) => (
                <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
                  <TableCell className="font-semibold">{item.full_name}</TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    {item.gender === "L" ? (
                      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                        L
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-pink-200 bg-pink-50 text-pink-700">
                        P
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        item.status === "ACCEPTED"
                          ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                          : item.status === "VERIFIED"
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
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
                  <TableCell className="text-center">
                    {item.status !== "ACCEPTED" && (
                      <Button
                        size="sm"
                        className="bg-primary gap-2 shadow-sm transition-all hover:shadow-md"
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

      <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dialog.title")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{t("dialog.name")}</Label>
              <Input value={selectedSantri?.full_name || ""} disabled />
            </div>
            <div className="grid gap-2">
              <Label>{t("dialog.set_nis")}</Label>
              <Input
                value={verifyData.nis}
                onChange={(e) => setVerifyData({ ...verifyData, nis: e.target.value })}
                placeholder={t("dialog.ph_nis")}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t("dialog.initial_class")}</Label>
              <Input
                value={verifyData.class}
                onChange={(e) => setVerifyData({ ...verifyData, class: e.target.value })}
                placeholder={t("dialog.ph_class")}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t("dialog.entry_year")}</Label>
              <Input
                type="number"
                value={verifyData.entry_year}
                onChange={(e) =>
                  setVerifyData({ ...verifyData, entry_year: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyOpen(false)}>
              {t("dialog.cancel")}
            </Button>
            <Button onClick={handleVerify} disabled={verifyMutation.isPending}>
              {verifyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("dialog.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
