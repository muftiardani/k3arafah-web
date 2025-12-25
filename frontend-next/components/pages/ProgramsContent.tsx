"use client";

import { useTranslations } from "next-intl";
import { BookOpen, GraduationCap, School, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, slideUp, scaleIn } from "@/lib/animations";
import Image from "next/image";

export default function ProgramsContent() {
  const t = useTranslations("ProgramsPage");
  type Program = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    color: string;
    borderColor: string;
    image: string;
  };

  const programs: Program[] = [
    {
      id: "tahfidz",
      title: t("tahfidz_title"),
      description: t("tahfidz_desc"),
      icon: <BookOpen className="h-6 w-6 text-white" />,
      features: [t("tahfidz_f1"), t("tahfidz_f2"), t("tahfidz_f3"), t("tahfidz_f4")],
      color: "bg-emerald-50/50 dark:bg-emerald-950/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      image: "/images/program-tahfidz.png",
    },
    {
      id: "kitab",
      title: t("kitab_title"),
      description: t("kitab_desc"),
      icon: <GraduationCap className="h-6 w-6 text-white" />,
      features: [t("kitab_f1"), t("kitab_f2"), t("kitab_f3"), t("kitab_f4")],
      color: "bg-amber-50/50 dark:bg-amber-950/20",
      borderColor: "border-amber-200 dark:border-amber-800",
      image: "/images/program-kitab.png",
    },
    {
      id: "formal",
      title: t("formal_title"),
      description: t("formal_desc"),
      icon: <School className="h-6 w-6 text-white" />,
      features: [t("formal_f1"), t("formal_f2"), t("formal_f3"), t("formal_f4")],
      color: "bg-blue-50/50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      image: "/images/program-formal.png",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-slate-50 py-16 md:py-24 dark:bg-slate-900">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container px-4 text-center md:px-6"
        >
          <motion.h1
            variants={slideUp}
            className="text-3xl font-bold tracking-tighter text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white"
          >
            {t("hero_title")}
          </motion.h1>
          <motion.p
            variants={slideUp}
            className="mx-auto mt-4 max-w-[700px] text-gray-600 md:text-xl dark:text-gray-300"
          >
            {t("hero_desc")}
          </motion.p>
        </motion.div>
      </section>

      {/* Programs List */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-8 lg:gap-12"
          >
            {programs.map((program) => (
              <motion.div
                key={program.id}
                variants={fadeIn}
                className="group bg-card relative overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-xl dark:border-gray-800"
              >
                {/* Image Header */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="mb-2 inline-flex rounded-full bg-white/20 p-2 backdrop-blur-sm">
                      {program.icon}
                    </div>
                  </div>
                </div>

                <div className={`p-6 md:p-8 ${program.color} h-full`}>
                  <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {program.title}
                  </h2>
                  <p className="mb-6 text-gray-600 dark:text-gray-300">{program.description}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {program.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-emerald-600 py-16 text-center text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container px-4 md:px-6"
        >
          <motion.h2
            variants={scaleIn}
            className="mb-6 text-3xl font-bold tracking-tighter sm:text-4xl"
          >
            {t("cta_title")}
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="mx-auto mb-8 max-w-[600px] text-lg text-emerald-100"
          >
            {t("cta_desc")}
          </motion.p>
          <motion.div variants={fadeIn}>
            <Button asChild size="lg" variant="secondary" className="font-bold text-emerald-900">
              <Link href="/psb">{t("cta_button")}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
