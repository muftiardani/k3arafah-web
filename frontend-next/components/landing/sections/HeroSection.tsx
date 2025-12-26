"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function HeroSection() {
  const tHero = useTranslations("Hero");

  return (
    <section className="relative overflow-hidden bg-emerald-50 py-16 md:py-24 lg:py-32 dark:bg-emerald-950">
      <div className="relative z-10 container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col space-y-6 text-center lg:text-left"
          >
            <motion.div variants={fadeIn} className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter text-emerald-900 sm:text-5xl md:text-6xl lg:text-7xl/none dark:text-emerald-50">
                {tHero("title")}
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-gray-600 md:text-xl lg:mx-0 dark:text-gray-300">
                {tHero("subtitle")}
              </p>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 px-8 text-lg font-semibold shadow-lg transition-transform hover:scale-105 hover:bg-emerald-700 hover:shadow-emerald-500/25"
              >
                <Link href="/psb">
                  {tHero("cta_primary")} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-emerald-200 bg-white/50 text-lg font-semibold text-emerald-900 backdrop-blur-xs transition-transform hover:scale-105 hover:bg-white dark:border-emerald-800 dark:bg-black/20 dark:text-emerald-100"
              >
                <Link href="/#about">{tHero("cta_secondary")}</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto w-full max-w-[500px] lg:max-w-none"
          >
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl lg:aspect-4/3">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-yellow-400/20 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl"></div>

              <Image
                src="/images/hero-home.png"
                alt="Suasana Pesantren K3 Arafah"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-sm dark:bg-black/80">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 dark:border-gray-800"
                      ></div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Bergabung bersama
                    </p>
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                      500+ Santri
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
