import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://k3arafah.com"; // Ganti dengan domain environment variable

  // Static routes
  const routes = [
    "",
    "/psb",
    "/articles",
    // Add other static routes here
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic routes example (fetch from API)
  // const articles = await getArticles();
  // const articleRoutes = articles.map(...)

  return [...routes];
}
