"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProgramSection() {
  const tPrograms = useTranslations("Programs");

  return (
    <section id="program" className="bg-background py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-emerald-900 md:text-4xl dark:text-emerald-100">
            {tPrograms("title")}
          </h2>
          <p className="text-muted-foreground mt-4">{tPrograms("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Program Al-Qur'an */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border bg-linear-to-br from-emerald-50 to-white p-8 shadow-sm transition-all hover:shadow-lg dark:from-emerald-950 dark:to-slate-900"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-emerald-100 opacity-50 blur-2xl dark:bg-emerald-900"></div>

            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-emerald-100 p-4 dark:bg-emerald-900">
                <BookOpen className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                {tPrograms("quran_title")}
              </h3>
              <p className="text-muted-foreground">{tPrograms("quran_desc")}</p>
              <ul className="mt-4 space-y-2 text-start text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-emerald-500" /> Target Hafalan Lancar
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-emerald-500" /> Ujian Tasmi&apos; Berkala
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-emerald-500" /> Bersanad Riwayat Hafs
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Program Kitab */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border bg-linear-to-br from-amber-50 to-white p-8 shadow-sm transition-all hover:shadow-lg dark:from-amber-950/30 dark:to-slate-900"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-amber-100 opacity-50 blur-2xl dark:bg-amber-900"></div>

            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-amber-100 p-4 dark:bg-amber-900">
                <GraduationCap className="h-10 w-10 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {tPrograms("kitab_title")}
              </h3>
              <p className="text-muted-foreground">{tPrograms("kitab_desc")}</p>
              <ul className="mt-4 space-y-2 text-start text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-amber-500" /> Metode Sorogan & Bandongan
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-amber-500" /> Bahtsul Masail Rutin
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-amber-500" /> Penguasaan Bahasa Arab
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
