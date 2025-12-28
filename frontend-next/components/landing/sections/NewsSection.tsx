"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { Article } from "@/lib/services/articleService";
import { fadeIn, staggerContainer } from "@/lib/animations";

interface NewsSectionProps {
  articles: Article[];
}

export default function NewsSection({ articles }: NewsSectionProps) {
  const tHome = useTranslations("Home");

  return (
    <section id="berita" className="bg-muted/30 py-16">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-10 flex flex-col items-center justify-center space-y-4 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tighter text-emerald-900 md:text-4xl dark:text-emerald-100">
            {tHome("news_title")}
          </h2>
          <p className="text-muted-foreground max-w-[700px]">{tHome("news_desc")}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {articles.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center">{tHome("news_empty")}</p>
          ) : (
            articles
              .filter((a) => a.is_published)
              .map((article) => (
                <motion.div
                  variants={fadeIn}
                  key={article.id}
                  className="group bg-card relative flex flex-col space-y-3 rounded-lg border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link href={`/articles/${article.slug}`} className="absolute inset-0 z-10">
                    <span className="sr-only">Read more</span>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.published_at || article.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </div>
                  <h3 className="line-clamp-2 text-lg font-semibold transition-colors group-hover:text-emerald-700">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 text-sm">
                    {/* Strip HTML tags for preview if content is HTML */}
                    {article.excerpt || article.content.replace(/<[^>]*>?/gm, "")}
                  </p>
                </motion.div>
              ))
          )}
        </motion.div>
      </div>
    </section>
  );
}
