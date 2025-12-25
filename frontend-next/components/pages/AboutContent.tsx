"use client";

import { useTranslations } from "next-intl";
import { Users, Target, History, Award } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, slideUp, scaleIn } from "@/lib/animations";

export default function AboutContent() {
  const t = useTranslations("About");

  return (
    <motion.div initial="hidden" animate="visible" className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-emerald-50 py-16 md:py-24 dark:bg-emerald-950">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container px-4 text-center md:px-6"
        >
          <motion.h1
            variants={slideUp}
            className="text-3xl font-bold tracking-tighter text-emerald-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-emerald-100"
          >
            {t("hero_title")}
          </motion.h1>
          <motion.p
            variants={slideUp}
            className="mx-auto mt-4 max-w-[700px] text-gray-600 md:text-xl dark:text-gray-300"
          >
            {t("hero_description")}
          </motion.p>
        </motion.div>
      </section>

      {/* History Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid items-center gap-10 lg:grid-cols-2"
          >
            <motion.div variants={slideUp} className="space-y-4">
              <div className="inline-flex items-center rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                <History className="mr-2 h-4 w-4" />
                {t("history_badge")}
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                {t("history_title")}
              </h2>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                {t("history_content_1")}
              </p>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                {t("history_content_2")}
              </p>
            </motion.div>
            <motion.div
              variants={scaleIn}
              className="relative aspect-video overflow-hidden rounded-xl bg-gray-200 shadow-lg dark:bg-gray-800"
            >
              <Image
                src="/images/history.png"
                alt={t("history_title")}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="bg-slate-50 py-16 md:py-24 dark:bg-slate-900">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-12 text-center"
          >
            <motion.h2
              variants={slideUp}
              className="text-3xl font-bold tracking-tighter md:text-4xl"
            >
              {t("vision_mission_title")}
            </motion.h2>
            <motion.p variants={slideUp} className="mt-4 text-gray-600 dark:text-gray-400">
              {t("vision_mission_desc")}
            </motion.p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">{t("vision_title")}</h3>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {t("vision_content")}
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">{t("mission_title")}</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex gap-2">
                  <span className="font-bold text-emerald-500">•</span>
                  {t("mission_1")}
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-emerald-500">•</span>
                  {t("mission_2")}
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-emerald-500">•</span>
                  {t("mission_3")}
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tighter text-emerald-900 md:text-4xl dark:text-white">
              {t("leadership_title")}
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* Kyai */}
            <motion.div variants={fadeIn} className="group flex flex-col items-center text-center">
              <div className="relative mb-4 h-48 w-48 overflow-hidden rounded-full border-4 border-emerald-100 bg-gray-200 shadow-md">
                <Image
                  src="/images/kyai.png"
                  alt={t("leader_1_name")}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">{t("leader_1_name")}</h3>
              <p className="mt-1 text-sm tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                {t("leader_1_role")}
              </p>
              <p className="mt-2 max-w-xs text-sm text-gray-500">{t("leader_1_desc")}</p>
            </motion.div>

            {/* Ketua Yayasan */}
            <motion.div variants={fadeIn} className="group flex flex-col items-center text-center">
              <div className="relative mb-4 h-48 w-48 overflow-hidden rounded-full border-4 border-emerald-100 bg-gray-200 shadow-md">
                <Image
                  src="/images/chairman.png"
                  alt={t("leader_2_name")}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">{t("leader_2_name")}</h3>
              <p className="mt-1 text-sm tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                {t("leader_2_role")}
              </p>
              <p className="mt-2 max-w-xs text-sm text-gray-500">{t("leader_2_desc")}</p>
            </motion.div>

            {/* Kepala Sekolah */}
            <motion.div variants={fadeIn} className="group flex flex-col items-center text-center">
              <div className="relative mb-4 h-48 w-48 overflow-hidden rounded-full border-4 border-emerald-100 bg-gray-200 shadow-md">
                <Image
                  src="/images/principal.png"
                  alt={t("leader_3_name")}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">{t("leader_3_name")}</h3>
              <p className="mt-1 text-sm tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                {t("leader_3_role")}
              </p>
              <p className="mt-2 max-w-xs text-sm text-gray-500">{t("leader_3_desc")}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
