import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/services/articleService";
import ArticleDetailContent from "@/components/pages/ArticleDetailContent";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

// 1. Dynamic Metadata Generator
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.published_at,
      authors: [article.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

// 2. Page Component
export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetailContent article={article} />;
}
