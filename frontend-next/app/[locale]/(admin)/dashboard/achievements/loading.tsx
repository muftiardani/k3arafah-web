import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="bg-muted h-8 w-48 animate-pulse rounded-lg" />
          <div className="bg-muted h-4 w-64 animate-pulse rounded-lg" />
        </div>
        <div className="bg-muted h-10 w-32 animate-pulse rounded-lg" />
      </div>

      {/* Stats & Search Skeleton */}
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <Skeleton className="h-[88px] w-full rounded-xl" />
        <Skeleton className="h-[88px] w-full min-w-[300px] rounded-xl" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="group relative flex h-[300px] flex-col overflow-hidden rounded-2xl border p-6 shadow-sm"
          >
            <div className="bg-muted mx-auto mb-5 h-14 w-14 animate-pulse rounded-2xl" />

            <div className="flex flex-1 flex-col items-center space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="mt-4 h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
