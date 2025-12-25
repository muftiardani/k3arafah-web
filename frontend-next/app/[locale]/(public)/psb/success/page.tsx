import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function SuccessPage() {
  const t = useTranslations("PSB.Success");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8 h-64 w-64 overflow-hidden rounded-full border-4 border-emerald-100 shadow-xl dark:border-emerald-900">
        <Image
          src="/images/psb-success.png"
          alt="Pendaftaran Berhasil"
          fill
          className="object-cover"
        />
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
