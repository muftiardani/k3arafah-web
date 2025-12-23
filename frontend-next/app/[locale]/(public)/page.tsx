import LandingPage from "@/components/landing/LandingPage";
import { Article } from "@/types";
import { BACKEND_API_URL } from "@/lib/config";

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/articles`, {
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
