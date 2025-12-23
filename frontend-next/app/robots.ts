import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://k3arafah.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/", // Disallow admin routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
