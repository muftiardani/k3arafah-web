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
import { CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

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
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">{t("title")}</h1>

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.name")}</TableHead>
              <TableHead>{t("table.gender")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.date")}</TableHead>
              <TableHead className="text-right">{t("table.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center">
                  {t("loading")}
                </TableCell>
              </TableRow>
            ) : registrants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center">
                  {t("empty")}
                </TableCell>
              </TableRow>
            ) : (
              registrants.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.full_name}</TableCell>
                  <TableCell>
                    {item.gender === "L" ? t("gender.male") : t("gender.female")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "ACCEPTED"
                          ? "default"
                          : item.status === "VERIFIED"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {/* Use dynamic key based on status enum lowercased */}
                      {tStatus(item.status.toLowerCase() as any)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {item.status !== "ACCEPTED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 text-green-600 hover:text-green-700"
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
