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

interface Santri {
  id: number;
  full_name: string;
  gender: string;
  status: string;
  created_at: string;
}

export default function RegistrantsPage() {
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
      toast.error("NIS dan Kelas wajib diisi");
      return;
    }

    setVerifying(true);
    try {
      await api.put(`/psb/registrants/${selectedSantri?.id}/verify`, verifyData);
      toast.success("Santri berhasil diverifikasi & diterima");
      setVerifyOpen(false);
      fetchRegistrants();
    } catch (error) {
      console.error(error);
      toast.error("Gagal memverifikasi santri");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">Data Pendaftar Baru</h1>

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Daftar</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : registrants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center">
                  Belum ada pendaftar.
                </TableCell>
              </TableRow>
            ) : (
              registrants.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.full_name}</TableCell>
                  <TableCell>{item.gender === "L" ? "Laki-laki" : "Perempuan"}</TableCell>
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
                      {item.status}
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
                        Verifikasi
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
            <DialogTitle>Verifikasi & Terima Santri</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nama Lengkap</Label>
              <Input value={selectedSantri?.full_name || ""} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Tetapkan NIS</Label>
              <Input
                value={verifyData.nis}
                onChange={(e) => setVerifyData({ ...verifyData, nis: e.target.value })}
                placeholder="Nomor Induk Santri"
              />
            </div>
            <div className="grid gap-2">
              <Label>Kelas Awal</Label>
              <Input
                value={verifyData.class}
                onChange={(e) => setVerifyData({ ...verifyData, class: e.target.value })}
                placeholder="Contoh: 1A"
              />
            </div>
            <div className="grid gap-2">
              <Label>Tahun Masuk</Label>
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
              Batal
            </Button>
            <Button onClick={handleVerify} disabled={verifying}>
              {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verifikasi & Terima
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
