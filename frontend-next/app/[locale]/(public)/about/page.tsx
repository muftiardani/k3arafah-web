import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutContent from "@/components/pages/AboutContent";

export async function generateMetadata() {
  const t = await getTranslations("About");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function AboutPage() {
  return <AboutContent />;
}
