import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        <FileQuestion className="h-12 w-12" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">404</h1>
        <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
        <p className="max-w-[500px] text-gray-500 dark:text-gray-400">{t("description")}</p>
      </div>
      <Button asChild className="gap-2">
        <Link href="/">
          <Home className="h-4 w-4" />
          {t("back_home")}
        </Link>
      </Button>
    </div>
  );
}
