import { Metadata } from "next";
import PSBForm from "@/components/PSBForm";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PSB");
  return {
    title: t("title") + " - Pondok Pesantren K3 Arafah",
    description: t("description"),
  };
}

export default function PSBPage() {
  return (
    <div className="container px-4 py-10 md:px-6">
      <PSBForm />
    </div>
  );
}
