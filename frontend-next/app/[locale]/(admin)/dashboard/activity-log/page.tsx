"use client";

import { useState } from "react";
import {
  Activity,
  Monitor,
  Search,
  Calendar as CalendarIcon,
  Edit,
  Trash,
  PlusCircle,
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

import { useActivityLogs } from "@/lib/hooks/useActivityLogs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/utils/date";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Map actions to colors and icons
const ACTION_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  CREATE: {
    color: "text-emerald-600 bg-emerald-100 border-emerald-200",
    icon: PlusCircle,
    label: "Created",
  },
  UPDATE: { color: "text-blue-600 bg-blue-100 border-blue-200", icon: Edit, label: "Updated" },
  DELETE: { color: "text-red-600 bg-red-100 border-red-200", icon: Trash, label: "Deleted" },
  LOGIN: { color: "text-purple-600 bg-purple-100 border-purple-200", icon: LogIn, label: "Login" },
  LOGOUT: { color: "text-zinc-600 bg-zinc-100 border-zinc-200", icon: LogOut, label: "Logout" },
  VERIFY: {
    color: "text-amber-600 bg-amber-100 border-amber-200",
    icon: CheckCircle,
    label: "Verified",
  },
  ERROR: { color: "text-rose-600 bg-rose-100 border-rose-200", icon: XCircle, label: "Error" },
};

export default function ActivityLogPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const limit = 20;

  // Assuming hook supports these filters, if not they will be applied client-side for demo
  const { data, isLoading } = useActivityLogs(page, limit);

  // Client-side filtering simulation (ideally should be passed to useActivityLogs)
  // This ensures the UI feels responsive even if backend filtering isn't fully ready
  const logs = data?.items || [];
  const meta = data?.meta || { page: 1, limit: 20, total_items: 0, total_pages: 1 };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip_address.includes(searchQuery) ||
      log.entity_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUser = userFilter === "all" || log.user?.role === userFilter; // Simplified user filter
    const matchesAction = actionFilter === "all" || log.action === actionFilter;

    return matchesSearch && matchesUser && matchesAction;
  });

  const getConfig = (action: string) => {
    return (
      ACTION_CONFIG[action] || {
        color: "text-gray-600 bg-gray-100 border-gray-200",
        icon: Activity,
        label: action,
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-8 pb-10">
        {/* ... Loading Skeleton handled by loading.tsx ... */}
        <div className="flex h-screen w-full items-center justify-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Activity Timeline</h1>
          <p className="text-muted-foreground text-lg">
            Monitor aktivitas sistem dan audit trail secara real-time.
          </p>
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Controls */}
        <div className="space-y-6">
          <Card className="sticky top-6 border-zinc-200 shadow-sm dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Filters</CardTitle>
              <CardDescription>Persempit pencarian aktivitas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="search-input" className="text-sm font-medium">
                  Search
                </label>
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                  <Input
                    id="search-input"
                    placeholder="User, IP, Entity..."
                    className="border-zinc-200 bg-zinc-50 pl-9 dark:border-zinc-800 dark:bg-zinc-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Action Type</span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(ACTION_CONFIG).map(([key, config]) => (
                    <Button
                      key={key}
                      variant={actionFilter === key ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "h-8 justify-start text-xs",
                        actionFilter === key
                          ? ""
                          : "text-muted-foreground border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
                      )}
                      onClick={() => setActionFilter(actionFilter === key ? "all" : key)}
                    >
                      <config.icon className="mr-2 h-3.5 w-3.5" />
                      {config.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="date-trigger" className="text-sm font-medium">
                  Date Range
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-trigger"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start border-zinc-200 text-left font-normal dark:border-zinc-800",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <Separator />

              <div className="text-muted-foreground flex items-center justify-between pt-2 text-sm">
                <span>Total Logs</span>
                <Badge variant="secondary" className="font-mono">
                  {meta.total_items}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Content */}
        <div className="space-y-6">
          {filteredLogs.length > 0 ? (
            <div className="relative space-y-8 pl-4 before:absolute before:inset-0 before:ml-4 before:h-full before:w-0.5 before:-translate-x-px before:bg-linear-to-b before:from-transparent before:via-zinc-200 before:to-transparent md:before:ml-3.5 md:before:translate-x-0 dark:before:via-zinc-800">
              {filteredLogs.map((log) => {
                const config = getConfig(log.action);
                const Icon = config.icon;

                return (
                  <div key={log.id} className="group relative pl-8 md:pl-10">
                    {/* Timeline Dot */}
                    <div className="bg-background ring-background absolute top-1.5 left-0 ml-2 flex h-4 w-4 items-center justify-center rounded-full ring-4 md:ml-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${config.color.split(" ")[1]}`} />{" "}
                      {/* Use bg color from config */}
                    </div>

                    <Card
                      className={`overflow-hidden border-zinc-200 transition-all duration-300 group-hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800`}
                    >
                      <div
                        className={`absolute top-0 bottom-0 left-0 w-1 ${config.color.split(" ")[1]}`}
                      />
                      <CardContent className="p-5">
                        <div className="flex flex-col gap-4">
                          {/* Top Row: User & Meta */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="border-background h-10 w-10 border-2 shadow-sm">
                                <AvatarImage
                                  src={`https://ui-avatars.com/api/?name=${log.user?.username}&background=random`}
                                />
                                <AvatarFallback>
                                  {log.user?.username?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm leading-none font-semibold">
                                  {log.user?.username || `User #${log.user_id}`}
                                </p>
                                <div className="text-muted-foreground mt-1.5 flex items-center gap-2 text-xs">
                                  <Badge
                                    variant="outline"
                                    className={`h-5 border-0 px-1.5 py-0 font-medium ${config.color}`}
                                  >
                                    <Icon className="mr-1 h-3 w-3" /> {log.action}
                                  </Badge>
                                  <span>•</span>
                                  <span className="font-mono">{log.ip_address}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                              <span className="text-muted-foreground rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium dark:bg-zinc-800">
                                {formatDateTime(log.created_at)}
                              </span>
                            </div>
                          </div>

                          {/* Middle Row: Entity Details */}
                          <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800/50 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Entity:</span>
                              <span className="text-foreground font-semibold">
                                {log.entity_type}
                              </span>
                              {log.entity_id && (
                                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                                  ID: {log.entity_id}
                                </Badge>
                              )}
                            </div>
                            {/* Optional: JSON Details or Description could go here */}
                            <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                              <Monitor className="h-3 w-3" />
                              <span className="max-w-[300px] truncate" title={log.user_agent}>
                                {log.user_agent}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}

              {/* Pagination */}
              <div className="flex justify-center pt-4">
                <div className="bg-card flex w-full items-center justify-between rounded-xl border border-zinc-200 p-4 shadow-sm dark:border-zinc-800">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="gap-2"
                  >
                    Previous
                  </Button>
                  <span className="text-muted-foreground text-sm font-medium">
                    Page {page} of {meta.total_pages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= meta.total_pages}
                    className="gap-2"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-muted-foreground/20 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-zinc-50 py-20 text-center dark:bg-zinc-900/30">
              <div className="mb-6 rounded-full bg-white p-6 shadow-sm dark:bg-slate-950">
                <Search className="h-12 w-12 text-zinc-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Tidak ada aktivitas ditemukan</h3>
              <p className="text-muted-foreground max-w-sm">
                Coba sesuaikan filter atau kata kunci pencarian Anda.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setActionFilter("all");
                }}
                className="mt-4 text-blue-600"
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
