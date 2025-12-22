import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] p-8 space-y-8 container mx-auto">
      {/* Hero Skeleton */}
      <div className="flex flex-col items-center space-y-4 text-center mt-10">
        <Skeleton className="h-12 w-[300px] md:w-[500px]" />
        <Skeleton className="h-6 w-[200px] md:w-[400px]" />
        <div className="flex gap-4 mt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[200px] rounded-xl" />
      </div>
    </div>
  );
}
