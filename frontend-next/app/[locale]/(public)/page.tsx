import LandingPage from "@/components/landing/LandingPage";
import { getAllArticles } from "@/lib/services/articleService";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Hero");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function Home() {
  const articles = await getAllArticles();
  return <LandingPage articles={articles} />;
}
