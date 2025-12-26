"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public Route Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Oops! Terjadi kesalahan.
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Maaf, kami tidak dapat memuat halaman ini saat ini.
      </p>
      <Button
        onClick={() => reset()}
        variant="default"
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        Coba Lagi
      </Button>
    </div>
  );
}
