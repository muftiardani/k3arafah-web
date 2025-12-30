"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Activity, User, Clock, Monitor, Globe } from "lucide-react";

import { useActivityLogs } from "@/lib/hooks/useActivityLogs";
import { type ActivityLog } from "@/lib/services/activityLogService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/utils/date";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  LOGIN: "bg-purple-100 text-purple-700",
  LOGOUT: "bg-gray-100 text-gray-700",
  VERIFY: "bg-amber-100 text-amber-700",
};

export default function ActivityLogPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useActivityLogs(page, limit);

  const getActionBadge = (action: string) => {
    const colorClass = ACTION_COLORS[action] || "bg-gray-100 text-gray-700";
    return <Badge className={`${colorClass} font-medium`}>{action}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-8 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="bg-muted h-10 w-10 animate-pulse rounded-lg" />
            <div className="space-y-2">
              <div className="bg-muted h-9 w-48 animate-pulse rounded" />
              <div className="bg-muted h-4 w-72 animate-pulse rounded" />
            </div>
          </div>
        </div>

        <Separator className="bg-border/60" />

        <div className="overflow-hidden rounded-xl border shadow-sm">
          <div className="bg-muted/50 grid grid-cols-6 gap-4 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-muted h-4 w-20 animate-pulse rounded" />
            ))}
          </div>
          <div className="bg-card">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 items-center gap-4 border-b p-4">
                <div className="bg-muted col-span-1 h-3 w-full animate-pulse rounded" />
                <div className="bg-muted col-span-1 h-4 w-24 animate-pulse rounded" />
                <div className="bg-muted col-span-1 h-5 w-16 animate-pulse rounded-full" />
                <div className="bg-muted col-span-1 h-3 w-full animate-pulse rounded" />
                <div className="bg-muted col-span-1 h-3 w-20 animate-pulse rounded" />
                <div className="bg-muted col-span-1 h-3 w-full animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const logs = data?.items || [];
  const meta = data?.meta || { page: 1, limit: 20, total_items: 0, total_pages: 1 };

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
            <p className="text-muted-foreground text-lg">
              Lihat semua aktivitas sistem dan audit trail
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-border/60" />

      {logs.length > 0 ? (
        <>
          <div className="bg-card overflow-hidden rounded-xl border shadow-md">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Waktu
                    </div>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      User
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                  <TableHead className="w-[120px]">Entity</TableHead>
                  <TableHead className="w-[100px]">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      IP
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      User Agent
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30">
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDateTime(log.created_at)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {log.user?.username || `User #${log.user_id}`}
                      </span>
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm">
                        {log.entity_type}
                        {log.entity_id && (
                          <span className="ml-1 text-xs opacity-60">#{log.entity_id}</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {log.ip_address}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate text-xs">
                      {log.user_agent}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, meta.total_items)} of{" "}
              {meta.total_items} entries
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.total_pages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-muted/30 border-muted-foreground/20 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20 text-center">
          <div className="bg-background mb-6 rounded-full p-6 shadow-sm">
            <Activity className="text-muted-foreground/50 h-12 w-12" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Belum Ada Activity Log</h3>
          <p className="text-muted-foreground max-w-sm">
            Activity log akan muncul setelah ada aktivitas di sistem.
          </p>
        </div>
      )}
    </div>
  );
}
