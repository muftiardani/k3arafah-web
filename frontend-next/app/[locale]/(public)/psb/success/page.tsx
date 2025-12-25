import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SuccessPage() {
  const t = useTranslations("PSB.Success");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-emerald-100 p-6 dark:bg-emerald-900">
        <CheckCircle2 className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-emerald-800 dark:text-emerald-400">
        {t("title")}
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">{t("description")}</p>
      <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
        <Link href="/">{t("back_home")}</Link>
      </Button>
    </div>
  );
}
