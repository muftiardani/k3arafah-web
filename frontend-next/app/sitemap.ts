import { MetadataRoute } from "next";
import { BACKEND_API_URL } from "@/lib/config";

interface Article {
  id: number;
  slug?: string; // Assuming slug might exist or we use ID
  updated_at: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://k3arafah.com";

  // Static routes
  const routes = ["", "/about", "/programs", "/articles", "/contact", "/psb", "/login"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })
  );

  // Dynamic routes (Articles)
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(`${BACKEND_API_URL}/articles`, {
      cache: "no-store",
    });

    if (response.ok) {
      const result = await response.json();
      const articles: Article[] = result.data || [];

      articleRoutes = articles.map((article) => ({
        url: `${baseUrl}/articles/${article.id}`, // Using ID as we typically do in this app
        lastModified: new Date(article.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Failed to generate article sitemap:", error);
  }

  return [...routes, ...articleRoutes];
}
