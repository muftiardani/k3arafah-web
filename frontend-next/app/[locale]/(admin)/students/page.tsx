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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface Santri {
  id: number;
  full_name: string;
  nis: string;
  class: string;
  entry_year: number;
  status: string;
  parent_phone: string;
}

export default function StudentsPage() {
  const t = useTranslations("Dashboard.StudentsPage");
  const [students, setStudents] = useState<Santri[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Santri[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = students.filter(
      (s) =>
        s.full_name.toLowerCase().includes(lowerSearch) || (s.nis && s.nis.includes(lowerSearch))
    );
    setFilteredStudents(filtered);
  }, [search, students]);

  const fetchStudents = async () => {
    try {
      // Use backend filter for better performance
      const response = await api.get("/psb/registrants?status=ACCEPTED");
      const activeStudents: Santri[] = response.data.data || [];
      setStudents(activeStudents);
      setFilteredStudents(activeStudents);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-lg">{t("description")}</p>
        </div>
      </div>

      <div className="bg-background/50 flex items-center gap-4 rounded-lg border p-4 shadow-sm backdrop-blur-[1px]">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder={t("search_placeholder")}
            className="bg-background focus:ring-primary/20 pl-9 transition-all focus:ring-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border shadow-md transition-all hover:shadow-lg">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-center font-semibold">{t("table.nis")}</TableHead>
              <TableHead className="text-center font-semibold">{t("table.name")}</TableHead>
              <TableHead className="text-center font-semibold">{t("table.class")}</TableHead>
              <TableHead className="text-center font-semibold">{t("table.entry_year")}</TableHead>
              <TableHead className="text-center font-semibold">{t("table.parent_phone")}</TableHead>
              <TableHead className="text-center font-semibold">{t("table.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="text-muted-foreground flex items-center justify-center gap-2">
                    <span className="animate-pulse">{t("loading")}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
                    <p className="text-lg font-semibold">{t("empty")}</p>
                    <p className="text-sm">Tidak ada data santri yang ditemukan.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((item) => (
                <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
                  <TableCell className="text-primary text-center font-mono font-medium">
                    {item.nis || "-"}
                  </TableCell>
                  <TableCell className="font-semibold">{item.full_name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-background">
                      {item.class || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{item.entry_year || "-"}</TableCell>
                  <TableCell className="text-center font-mono text-xs">
                    {item.parent_phone}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                    >
                      {t("active")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
