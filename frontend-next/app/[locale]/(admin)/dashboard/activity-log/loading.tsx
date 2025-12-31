import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Header Skeleton */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-9 w-48 rounded-lg" />
            </div>
            <Skeleton className="h-5 w-96 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-4">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Separator />
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Skeleton */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-none bg-transparent shadow-none">
            <CardContent className="space-y-8 p-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-muted relative border-l pl-8">
                  <div className="bg-muted ring-background absolute top-2 left-[-5px] h-2.5 w-2.5 rounded-full ring-4" />
                  <div className="bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-20 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <div className="flex items-center gap-4 pt-2">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
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
