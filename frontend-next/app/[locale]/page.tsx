import LandingPage from "@/components/landing/LandingPage";
import { Article } from "@/types";

async function getArticles(): Promise<Article[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    const res = await fetch(`${apiUrl}/articles`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

// Ensure params are handled as Promise
export default async function Home() {
  const articles = await getArticles();
  return <LandingPage articles={articles} />;
}
