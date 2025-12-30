import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div className="overflow-hidden rounded-xl border shadow-sm">
        <div className="bg-muted/50 grid grid-cols-6 gap-4 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        <div className="bg-card">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 items-center gap-4 border-b p-4">
              <Skeleton className="col-span-1 h-3 w-full" />
              <Skeleton className="col-span-1 h-4 w-24" />
              <Skeleton className="col-span-1 h-5 w-16 rounded-full" />
              <Skeleton className="col-span-1 h-3 w-full" />
              <Skeleton className="col-span-1 h-3 w-20" />
              <Skeleton className="col-span-1 h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
