"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn, slideUp, staggerContainer } from "@/lib/animations";

import { Article } from "@/lib/services/articleService";

interface ArticleDetailContentProps {
  article: Article;
}

export default function ArticleDetailContent({ article }: ArticleDetailContentProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="container mx-auto max-w-4xl px-4 py-8"
    >
      <motion.div variants={fadeIn} className="mb-8">
        <Button variant="ghost" asChild className="mb-4 pl-0 transition-all hover:pl-2">
          <Link href="/articles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Link>
        </Button>

        <motion.h1
          variants={slideUp}
          className="mb-4 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl"
        >
          {article.title}
        </motion.h1>

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
      </motion.div>

      <motion.div
        variants={fadeIn}
        className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl bg-gray-100"
      >
        {/* Using a placeholder if image fails or for demo */}
        <Image src={article.image} alt={article.title} fill className="object-cover" />
      </motion.div>

      <motion.article variants={fadeIn} className="prose prose-lg dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </motion.article>
    </motion.div>
  );
}
