import { Metadata } from "next";
import { getAllArticles } from "@/lib/services/articleService";
import { getTranslations } from "next-intl/server";
import ArticlesContent from "@/components/pages/ArticlesContent";

export async function generateMetadata() {
  const t = await getTranslations("Articles");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ArticlesPage() {
  // @ts-ignore - Async component workaround if needed, otherwise standard async function
  const articles = await getAllArticles();

  return <ArticlesContent articles={articles} />;
}
