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
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, GraduationCap, Users, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useStudents } from "@/lib/hooks/usePsb";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function StudentsPage() {
  const t = useTranslations("Dashboard.StudentsPage");
  const [search, setSearch] = useState("");

  const { data: students = [], isLoading } = useStudents();

  // Simple stats calculation
  const stats = useMemo(() => {
    return {
      total: students.length,
      active: students.length, // Assuming all fetched are active for now
      classes: new Set(students.map((s) => s.class)).size,
    };
  }, [students]);

  const filteredStudents = useMemo(() => {
    if (!search) return students;
    const lowerSearch = search.toLowerCase();
    return students.filter(
      (s) =>
        s.full_name.toLowerCase().includes(lowerSearch) || (s.nis && s.nis.includes(lowerSearch))
    );
  }, [search, students]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-8 pb-10">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="bg-muted h-9 w-48 animate-pulse rounded-md" />
          <div className="bg-muted h-5 w-96 animate-pulse rounded-md" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted h-32 animate-pulse rounded-xl" />
          ))}
        </div>

        {/* Table Skeleton */}
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
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-slate-950">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-bl-full bg-indigo-50 transition-transform hover:scale-110 dark:bg-indigo-900/20" />
          <CardContent className="relative z-10 flex items-center gap-4 p-6">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Santri</p>
              <h3 className="text-3xl font-bold tracking-tight text-indigo-900 dark:text-indigo-100">
                {stats.total}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-slate-950">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-bl-full bg-emerald-50 transition-transform hover:scale-110 dark:bg-emerald-900/20" />
          <CardContent className="relative z-10 flex items-center gap-4 p-6">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Santri Aktif</p>
              <h3 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-100">
                {stats.active}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-slate-950">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-bl-full bg-amber-50 transition-transform hover:scale-110 dark:bg-amber-900/20" />
          <CardContent className="relative z-10 flex items-center gap-4 p-6">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Kelas</p>
              <h3 className="text-3xl font-bold tracking-tight text-amber-900 dark:text-amber-100">
                {stats.classes}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-slate-950 dark:shadow-black/20">
        <div className="flex items-center gap-4 border-b border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800/50 dark:bg-zinc-900/20">
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={t("search_placeholder")}
              className="border-zinc-200 bg-white pl-9 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-slate-950"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px] font-semibold">{t("table.nis")}</TableHead>
                <TableHead className="font-semibold">{t("table.name")}</TableHead>
                <TableHead className="text-center font-semibold">{t("table.class")}</TableHead>
                <TableHead className="text-center font-semibold">{t("table.entry_year")}</TableHead>
                <TableHead className="text-center font-semibold">
                  {t("table.parent_phone")}
                </TableHead>
                <TableHead className="text-center font-semibold">{t("table.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton cols={6} rows={5} />
              ) : filteredStudents.length === 0 ? (
                <TableEmptyState
                  cols={6}
                  title={t("empty")}
                  description="Tidak ada data santri yang ditemukan."
                />
              ) : (
                filteredStudents.map((item) => (
                  <TableRow
                    key={item.id}
                    className="group border-zinc-100 transition-colors hover:bg-zinc-50/80 dark:border-zinc-800/50 dark:hover:bg-zinc-900/30"
                  >
                    <TableCell className="font-mono font-medium text-indigo-600 dark:text-indigo-400">
                      <Badge
                        variant="outline"
                        className="border-indigo-200 bg-indigo-50 font-mono text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300"
                      >
                        #{item.nis || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-zinc-100 shadow-sm dark:border-zinc-800">
                          <AvatarFallback className="bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            {item.full_name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground font-medium">{item.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                      >
                        {item.class || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center">
                      {item.entry_year || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center font-mono text-xs">
                      {item.parent_phone || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="default"
                        className="border border-emerald-200 bg-emerald-100 text-emerald-700 shadow-none hover:bg-emerald-200 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
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
      </Card>
    </div>
  );
}
