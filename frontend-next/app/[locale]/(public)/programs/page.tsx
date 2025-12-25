import { Metadata } from "next";
import { BookOpen, GraduationCap, School, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";

import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("ProgramsPage");
  return {
    title: t("title"),
    description: t("description"),
  };
}

import { useTranslations } from "next-intl";

export default function ProgramsPage() {
  const t = useTranslations("ProgramsPage");
  const programs = [
    {
      id: "tahfidz",
      title: t("tahfidz_title"),
      description: t("tahfidz_desc"),
      icon: <BookOpen className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />,
      features: [t("tahfidz_f1"), t("tahfidz_f2"), t("tahfidz_f3"), t("tahfidz_f4")],
      color: "bg-emerald-50 dark:bg-emerald-950/50",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
    {
      id: "kitab",
      title: t("kitab_title"),
      description: t("kitab_desc"),
      icon: <GraduationCap className="h-10 w-10 text-amber-600 dark:text-amber-400" />,
      features: [t("kitab_f1"), t("kitab_f2"), t("kitab_f3"), t("kitab_f4")],
      color: "bg-amber-50 dark:bg-amber-950/50",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    {
      id: "formal",
      title: t("formal_title"),
      description: t("formal_desc"),
      icon: <School className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
      features: [t("formal_f1"), t("formal_f2"), t("formal_f3"), t("formal_f4")],
      color: "bg-blue-50 dark:bg-blue-950/50",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-slate-50 py-16 md:py-24 dark:bg-slate-900">
        <div className="container px-4 text-center md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
            {t("hero_title")}
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-gray-600 md:text-xl dark:text-gray-300">
            {t("hero_desc")}
          </p>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:gap-12">
            {programs.map((program, index) => (
              <div
                key={program.id}
                className={`rounded-2xl border p-8 md:p-12 ${program.color} ${program.borderColor} transition-all hover:shadow-lg`}
              >
                <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
                  <div className="shrink-0 rounded-full bg-white p-6 shadow-sm dark:bg-gray-800">
                    {program.icon}
                  </div>
                  <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {program.title}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {program.description}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 shrink-0 md:mt-0">
                    {/* Could add specific CTA per program if needed */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-emerald-600 py-16 text-center text-white">
        <div className="container px-4 md:px-6">
          <h2 className="mb-6 text-3xl font-bold tracking-tighter sm:text-4xl">{t("cta_title")}</h2>
          <p className="mx-auto mb-8 max-w-[600px] text-lg text-emerald-100">{t("cta_desc")}</p>
          <Button asChild size="lg" variant="secondary" className="font-bold text-emerald-900">
            <Link href="/psb">{t("cta_button")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
