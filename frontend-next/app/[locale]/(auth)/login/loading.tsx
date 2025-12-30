import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="relative container grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Panel - Visual & Branding Skeleton */}
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />

        {/* Branding Skeleton */}
        <div className="relative z-20 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg bg-white/20" />
          <Skeleton className="h-6 w-32 bg-white/20" />
        </div>

        {/* Quote Skeleton */}
        <div className="relative z-20 mt-auto space-y-2">
          <Skeleton className="h-6 w-full max-w-md bg-white/20" />
          <Skeleton className="h-6 w-3/4 bg-white/20" />
          <Skeleton className="h-4 w-24 bg-white/20" />
        </div>
      </div>

      {/* Right Panel - Login Form Skeleton */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {/* Header Skeleton */}
          <div className="flex flex-col space-y-2 text-center">
            <Skeleton className="mx-auto h-8 w-48" />
            <Skeleton className="mx-auto h-4 w-64" />
          </div>

          {/* Form Skeleton */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Footer Link Skeleton */}
          <div className="flex justify-center">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
