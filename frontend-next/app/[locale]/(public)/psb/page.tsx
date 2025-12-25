import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PSBContent from "@/components/pages/PSBContent";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PSB");
  return {
    title: t("title") + " - Pondok Pesantren K3 Arafah",
    description: t("description"),
  };
}

export default function PSBPage() {
  return <PSBContent />;
}
