import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProgramsContent from "@/components/pages/ProgramsContent";

export async function generateMetadata() {
  const t = await getTranslations("ProgramsPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ProgramsPage() {
  return <ProgramsContent />;
}
