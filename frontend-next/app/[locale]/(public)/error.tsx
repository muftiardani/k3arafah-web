"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";
import { Link } from "@/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    // Log to error tracking service (e.g., Sentry)
    console.error("Public Route Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
        <AlertTriangle
          className="h-10 w-10 text-amber-600 dark:text-amber-400"
          aria-hidden="true"
        />
      </div>

      <h2 className="mb-3 text-2xl font-bold text-gray-800 dark:text-gray-100">{t("title")}</h2>

      <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">{t("description")}</p>

      {error.digest && (
        <p className="mb-6 rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          Error ID: {error.digest}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          onClick={() => reset()}
          className="bg-emerald-600 hover:bg-emerald-700"
          aria-label={t("try_again")}
        >
          {t("try_again")}
        </Button>

        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            {t.rich("back_home", { default: "Beranda" })}
          </Link>
        </Button>
      </div>
    </div>
  );
}
