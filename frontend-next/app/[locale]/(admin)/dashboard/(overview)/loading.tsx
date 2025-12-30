import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner Skeleton */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-950/5 p-8 shadow-sm dark:bg-slate-900/50">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <Skeleton className="h-5 w-32 rounded-lg" />
            <Skeleton className="h-10 w-64 md:w-96" />
            <Skeleton className="h-5 w-full md:w-[500px]" />
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content: Recent Registrants Skeleton */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="h-full border-zinc-200 shadow-xl dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-72" />
              </div>
              <Skeleton className="h-9 w-28 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full ring-2 ring-zinc-100 dark:ring-slate-800" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-16 rounded shadow-sm" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Quick Actions Skeleton */}
        <div className="space-y-6">
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="px-0 pt-0 pb-4">
              <div className="space-y-2">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-5 w-56" />
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 p-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-[88px] w-full items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-slate-950"
                >
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="w-full space-y-2 pt-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
