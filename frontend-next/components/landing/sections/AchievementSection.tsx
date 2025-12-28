"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Mic, Crown, Music, BookOpen, Medal, Zap, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllAchievements, type Achievement } from "@/lib/services/achievementService";

// Map string keys to Lucide components
const ICON_MAP: Record<string, any> = {
  trophy: Trophy,
  award: Award,
  mic: Mic,
  crown: Crown,
  music: Music,
  book: BookOpen,
  medal: Medal,
  zap: Zap,
  star: Star,
};

// Map string keys to Tailwind color classes
const COLOR_STYLES: Record<string, string> = {
  yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
};

function AchievementCard({ item }: { item: Achievement }) {
  const IconComponent = ICON_MAP[item.icon] || Trophy; // Fallback to Trophy
  const colorClass = COLOR_STYLES[item.color] || COLOR_STYLES.yellow;

  return (
    <div className="flex w-[350px] shrink-0 items-start space-x-4 rounded-xl border border-emerald-100 bg-white p-5 shadow-sm transition-all hover:scale-105 hover:shadow-md dark:border-emerald-800 dark:bg-slate-900">
      <div className={`shrink-0 rounded-full p-3 ${colorClass}`}>
        <IconComponent className="h-6 w-6" />
      </div>
      <div>
        <h3 className="font-bold text-emerald-900 dark:text-emerald-100">{item.title}</h3>
        <p className="text-xs font-medium tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
          {item.subtitle}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
      </div>
    </div>
  );
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AchievementSection() {
  const t = useTranslations("Achievements");

  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: getAllAchievements,
  });

  // If no data yet, show skeleton or just empty (or keep static fallback?)
  // Requirement was to make it dynamic. Let's assume emptiness if no data.
  // Or splitting into rows if we have data.

  const items = achievements || [];
  const middleIndex = Math.ceil(items.length / 2);
  const row1 = items.slice(0, middleIndex);
  const row2 = items.slice(middleIndex);

  // If empty, we could hide the section or show a message.
  // For now, if empty, we just render nothing inside the marquee but keep the header.

  return (
    <section className="overflow-hidden bg-emerald-50 py-16 md:py-24">
      <div className="container mb-12 px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tighter text-emerald-900 md:text-4xl dark:text-emerald-50">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-gray-600 dark:text-gray-300">
            {t("description")}
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      {items.length > 0 && (
        <div className="flex flex-col gap-8">
          {/* Row 1: Left to Right */}
          {row1.length > 0 && (
            <div className="relative flex w-full overflow-hidden">
              <div className="absolute top-0 left-0 z-10 h-full w-20 bg-linear-to-r from-emerald-50 to-transparent"></div>
              <div className="absolute top-0 right-0 z-10 h-full w-20 bg-linear-to-l from-emerald-50 to-transparent"></div>

              <motion.div
                className="flex min-w-max gap-6"
                animate={{ x: [0, -1000] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40,
                    ease: "linear",
                  },
                }}
              >
                {/* Duplicate for infinite loop illusion - simplified, might need more items for smoothness */}
                {[...row1, ...row1, ...row1, ...row1].map((item, idx) => (
                  <AchievementCard key={`row1-${idx}`} item={item} />
                ))}
              </motion.div>
            </div>
          )}

          {/* Row 2: Right to Left */}
          {row2.length > 0 && (
            <div className="relative flex w-full overflow-hidden">
              <div className="absolute top-0 left-0 z-10 h-full w-20 bg-linear-to-r from-emerald-50 to-transparent"></div>
              <div className="absolute top-0 right-0 z-10 h-full w-20 bg-linear-to-l from-emerald-50 to-transparent"></div>

              <motion.div
                className="flex min-w-max gap-6"
                animate={{ x: [-1000, 0] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 45,
                    ease: "linear",
                  },
                }}
              >
                {[...row2, ...row2, ...row2, ...row2].map((item, idx) => (
                  <AchievementCard key={`row2-${idx}`} item={item} />
                ))}
              </motion.div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
