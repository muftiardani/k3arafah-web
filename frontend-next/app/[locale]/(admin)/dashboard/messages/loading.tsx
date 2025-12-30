import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-6 w-96" />
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-4">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-64" /> {/* Search */}
            <Skeleton className="h-9 w-24" /> {/* Filter */}
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t">
            {/* Table Header */}
            <div className="bg-muted/30 grid grid-cols-12 gap-4 p-4">
              <Skeleton className="col-span-1 h-4" />
              <Skeleton className="col-span-3 h-4" />
              <Skeleton className="col-span-4 h-4" />
              <Skeleton className="col-span-2 h-4" />
              <Skeleton className="col-span-2 h-4" />
            </div>

            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-12 items-center gap-4 border-b p-4 last:border-0"
              >
                <Skeleton className="col-span-1 h-4 w-4 rounded-sm" />
                <div className="col-span-3 flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="col-span-4 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="col-span-2 h-6 w-16 rounded-full" />
                <div className="col-span-2 flex justify-end gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
