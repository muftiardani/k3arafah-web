import LandingPage from "@/components/landing/LandingPage";
import { getAllArticles } from "@/lib/services/articleService";
import { getAllGalleries } from "@/lib/services/galleryService";
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
  // Fetch data in parallel
  const [articles, galleries] = await Promise.all([getAllArticles(), getAllGalleries()]);

  return <LandingPage articles={articles} galleries={galleries} />;
}
