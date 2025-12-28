import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Thumbnail skeleton */}
      <Skeleton className="h-48 w-full rounded-none" />

      <CardHeader className="space-y-2">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />
        {/* Date skeleton */}
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Excerpt lines */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>

      <CardFooter>
        {/* Read more button skeleton */}
        <Skeleton className="h-9 w-32" />
      </CardFooter>
    </Card>
  );
}

export function ArticleListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      {/* Title */}
      <Skeleton className="h-10 w-3/4" />

      {/* Meta info */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Featured image */}
      <Skeleton className="h-64 w-full rounded-xl md:h-96" />

      {/* Content paragraphs */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </article>
  );
}
