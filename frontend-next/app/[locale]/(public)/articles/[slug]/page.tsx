import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/services/articleService";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Image from "next/image";

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

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 pl-0 transition-all hover:pl-2">
          <Link href="/articles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Link>
        </Button>

        <h1 className="mb-4 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{article.author.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(article.published_at).toLocaleDateString("id-ID", {
                dateStyle: "long",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
        {/* Using a placeholder if image fails or for demo */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          {/* In real app use: <Image src={article.image} alt={article.title} fill className="object-cover" /> */}
          <span className="text-lg">Featured Image: {article.title}</span>
        </div>
      </div>

      <article className="prose prose-lg dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </div>
  );
}
