"use client";

import { useUIStore } from "@/store/useUIStore";
import { Spinner } from "@/components/ui/spinner";

export function GlobalLoader() {
  const isLoading = useUIStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900">
        <Spinner size={48} />
      </div>
    </div>
  );
}
