"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Mic, Crown, Music, BookOpen, Medal, Zap } from "lucide-react";

/**
 * Data Prestasi yang masih hardcoded.
 * Bisa dipindah ke file data terpisah nanti jika perlu.
 */
const achievementsRow1 = [
  {
    icon: <Trophy className="h-6 w-6" />,
    color: "yellow",
    title: "Juara 1 MHQ 10 Juz",
    subtitle: "Tingkat Kabupaten (2024)",
    desc: "Ananda Fulan bin Fulan",
  },
  {
    icon: <Award className="h-6 w-6" />,
    color: "blue",
    title: "Medali Emas OSN Fisika",
    subtitle: "Olimpiade Sains (2024)",
    desc: "Ahmad Dahlan",
  },
  {
    icon: <Mic className="h-6 w-6" />,
    color: "slate",
    title: "Juara 2 Pidato Bahasa Arab",
    subtitle: "Porseni Santri (2023)",
    desc: "Zaki Mubarak",
  },
  {
    icon: <Crown className="h-6 w-6" />,
    color: "amber",
    title: "Juara Umum MtQ Pelajar",
    subtitle: "Tingkat Provinsi (2024)",
    desc: "Kontingen K3 Arafah",
  },
];

const achievementsRow2 = [
  {
    icon: <Music className="h-6 w-6" />,
    color: "purple",
    title: "Juara Harapan 1 Hadrah",
    subtitle: "Festival Seni Islami",
    desc: "Tim Al-Banjari",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    color: "emerald",
    title: "Juara 1 Baca Kitab Kuning",
    subtitle: "MQK Wilayah (2023)",
    desc: "Fatimah Az-Zahra",
  },
  {
    icon: <Medal className="h-6 w-6" />,
    color: "red",
    title: "Juara 2 Pencak Silat",
    subtitle: "Kejuaraan Daerah",
    desc: "Rizky Aditya",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    color: "orange",
    title: "Best Speaker Debat",
    subtitle: "Debat Bahasa Inggris",
    desc: "Siti Aminah",
  },
];

function AchievementCard({ item }: { item: any }) {
  const colorStyles = {
    yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  };

  return (
    <div className="flex w-[350px] shrink-0 items-start space-x-4 rounded-xl border border-emerald-100 bg-white p-5 shadow-sm transition-all hover:scale-105 hover:shadow-md dark:border-emerald-800 dark:bg-slate-900">
      <div
        className={`shrink-0 rounded-full p-3 ${
          colorStyles[item.color as keyof typeof colorStyles] || colorStyles.yellow
        }`}
      >
        {item.icon}
      </div>
      <div>
        <h3 className="font-bold text-emerald-900 dark:text-emerald-100">{item.title}</h3>
        <p className="text-xs font-medium tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
          {item.subtitle}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
      </div>
    </div>
  );
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AchievementSection() {
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
            Prestasi Santri
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-gray-600 dark:text-gray-300">
            Bukti nyata dedikasi dan kesungguhan santri dalam mengembangkan potensi diri.
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="flex flex-col gap-8">
        {/* Row 1: Left to Right */}
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
            {[...achievementsRow1, ...achievementsRow1, ...achievementsRow1].map((item, idx) => (
              <AchievementCard key={`row1-${idx}`} item={item} />
            ))}
          </motion.div>
        </div>

        {/* Row 2: Right to Left */}
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
            {[...achievementsRow2, ...achievementsRow2, ...achievementsRow2].map((item, idx) => (
              <AchievementCard key={`row2-${idx}`} item={item} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
