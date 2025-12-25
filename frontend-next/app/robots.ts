import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://k3arafah.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/*/dashboard/",
        "/*/students/",
        "/*/registrants/",
        "/*/users/",
        "/*/gallery/",
        "/api/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
