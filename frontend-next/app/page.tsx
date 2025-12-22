import LandingPage from "@/components/landing/LandingPage";

interface Article {
  id: number;
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
}

async function getArticles(): Promise<Article[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/articles`
      : "http://localhost:8080/api/articles";

    const res = await fetch(apiUrl, {
      cache: "no-store", // disable cache for now to see updates instantly
    });
    if (!res.ok) {
      // Graceful fallback
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const articles = await getArticles();
  return <LandingPage articles={articles} />;
}
