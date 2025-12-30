"use client";

import { useEffect, useState } from "react";
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
import { env } from "@/lib/env";

interface Santri {
  id: number;
  full_name: string;
  gender: string;
  status: string;
  created_at: string;
}

export default function RegistrantsPage() {
  const t = useTranslations("Dashboard.RegistrantsPage");
  // Also needed Dashboard.Status for status badges
  const tStatus = useTranslations("Dashboard.Status");
  const [registrants, setRegistrants] = useState<Santri[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);

  // Verification Form
  const [verifyData, setVerifyData] = useState({
    nis: "",
    class: "",
    entry_year: new Date().getFullYear(),
  });
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchRegistrants();
  }, []);

  const fetchRegistrants = async () => {
    try {
      const response = await api.get("/psb/registrants");
      setRegistrants(response.data.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVerify = (santri: Santri) => {
    setSelectedSantri(santri);
    setVerifyData({
      nis: "",
      class: "1A", // Default class
      entry_year: new Date().getFullYear(),
    });
    setVerifyOpen(true);
  };

  const handleVerify = async () => {
    if (!verifyData.nis || !verifyData.class) {
      toast.error(t("dialog.validation_required"));
      return;
    }

    setVerifying(true);
    try {
      await api.put(`/psb/registrants/${selectedSantri?.id}/verify`, verifyData);
      toast.success(t("dialog.toast_success"));
      setVerifyOpen(false);
      fetchRegistrants();
    } catch (error) {
      console.error(error);
      toast.error(t("dialog.toast_fail"));
    } finally {
      setVerifying(false);
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
        <Button
          variant="outline"
          onClick={() => {
            window.open(`${env.NEXT_PUBLIC_API_URL}/export/santri`, "_blank");
            toast.success("Downloading Excel file...");
          }}
        >
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="text-muted-foreground flex items-center justify-center gap-2">
                    <span className="animate-pulse">{t("loading")}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : registrants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
                    <p className="text-lg font-semibold">{t("empty")}</p>
                    <p className="text-sm">Belum ada pendaftar baru.</p>
                  </div>
                </TableCell>
              </TableRow>
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
                      {tStatus(item.status.toLowerCase() as any)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center font-mono text-sm">
                    {new Date(item.created_at).toLocaleDateString()}
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
            <Button onClick={handleVerify} disabled={verifying}>
              {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("dialog.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
