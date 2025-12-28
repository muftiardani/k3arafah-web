import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function GalleryCardSkeleton() {
  return (
    <Card className="group overflow-hidden">
      {/* Cover image skeleton */}
      <Skeleton className="aspect-video w-full" />

      <div className="space-y-2 p-4">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        {/* Description */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        {/* Photo count */}
        <Skeleton className="h-3 w-20" />
      </div>
    </Card>
  );
}

export function GalleryListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <GalleryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function GalleryDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Photo grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}
