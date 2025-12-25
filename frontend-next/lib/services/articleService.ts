import { notFound } from "next/navigation";

// Mock Data Type
export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  published_at: string;
  author: {
    name: string;
  };
};

// Mock Fetch Function (Replace with real API call later)
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock Database
  const articles: Article[] = [
    {
      id: 1,
      slug: "penerimaan-santri-baru-2025",
      title: "Penerimaan Santri Baru Tahun Ajaran 2025/2026",
      excerpt: "Pondok Pesantren K3 Arafah membuka pendaftaran santri baru...",
      content: "<p>Detail konten pendaftaran...</p>",
      image: "/images/psb-banner.jpg",
      published_at: "2025-01-01T08:00:00Z",
      author: { name: "Admin" },
    },
    {
      id: 2,
      slug: "kegiatan-ramadhan-di-pesantren",
      title: "Semarak Kegiatan Ramadhan di Pesantren",
      excerpt: "Berbagai kegiatan positif mengisi bulan suci Ramadhan...",
      content: "<p>Detail kegiatan ramadhan...</p>",
      image: "/images/ramadhan.jpg",
      published_at: "2025-03-10T08:00:00Z",
      author: { name: "Ustadz Hanif" },
    },
  ];

  const article = articles.find((a) => a.slug === slug);
  return article || null;
}
