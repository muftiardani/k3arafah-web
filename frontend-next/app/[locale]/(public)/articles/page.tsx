import { Metadata } from "next";
import { Link } from "@/navigation";
import { getAllArticles } from "@/lib/services/articleService";
import { Calendar, User, ArrowRight } from "lucide-react";
import Image from "next/image";

import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Articles");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ArticlesPage() {
  const t = await getTranslations("Articles");
  // @ts-ignore - Async component workaround if needed, otherwise standard async function
  const articles = await getAllArticles();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-slate-50 py-16 text-center dark:bg-slate-900">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
            {t("hero_title")}
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-gray-600 md:text-xl dark:text-gray-300">
            {t("hero_desc")}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-200">
                  {/* Using standard img for now if next/image config is tricky with external or mock urls */}
                  {/* <Image src={article.image} alt={article.title} fill className="object-cover transition-transform group-hover:scale-105" /> */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-700">
                    <span className="text-xs">Image: {article.title}</span>
                  </div>
                  <div className="absolute top-0 right-0 m-4 rounded-md bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                    {t("news_badge")}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author.name}
                    </div>
                  </div>

                  <h3 className="mb-2 text-xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                    {article.title}
                  </h3>

                  <p className="mb-6 line-clamp-3 flex-1 text-sm text-gray-600 dark:text-gray-400">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {t("read_more")}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Added Pagination Placeholder */}
          <div className="mt-16 flex justify-center">
            <div className="flex gap-2">
              <button className="rounded-md border px-4 py-2 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="rounded-md bg-emerald-600 px-4 py-2 text-white">1</button>
              <button className="rounded-md border px-4 py-2">2</button>
              <button className="rounded-md border px-4 py-2">Next</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
