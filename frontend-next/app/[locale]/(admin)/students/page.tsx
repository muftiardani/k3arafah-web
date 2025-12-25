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
      // In real implementation, we should have a specific endpoint for Active Students
      // For now we use the same getAll endpoints but filter by status client-side or use FindByStatus if exposed
      // Backend PSBHandler GetAll returns all.
      // Ideally we should add query param ?status=ACCEPTED to API.
      // But let's fetch all and filter client side for MVP.
      const response = await api.get("/psb/registrants");
      const allData: Santri[] = response.data.data;
      const activeStudents = allData.filter((s) => s.status === "ACCEPTED");
      setStudents(activeStudents);
      setFilteredStudents(activeStudents);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder={t("search_placeholder")}
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.nis")}</TableHead>
              <TableHead>{t("table.name")}</TableHead>
              <TableHead>{t("table.class")}</TableHead>
              <TableHead>{t("table.entry_year")}</TableHead>
              <TableHead>{t("table.parent_phone")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  {t("loading")}
                </TableCell>
              </TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  {t("empty")}
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.nis || "-"}</TableCell>
                  <TableCell className="font-medium">{item.full_name}</TableCell>
                  <TableCell>{item.class || "-"}</TableCell>
                  <TableCell>{item.entry_year || "-"}</TableCell>
                  <TableCell>{item.parent_phone}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-600">
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
