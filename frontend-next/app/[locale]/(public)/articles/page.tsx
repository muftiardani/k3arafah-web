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
  // Client-side fetching handled by React Query in ArticlesContent
  return <ArticlesContent />;
}
