"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import CountUp from "../CountUp";

export default function StatsSection() {
  const tStats = useTranslations("Stats");

  return (
    <section className="border-y border-emerald-100 bg-white py-12 dark:border-emerald-900 dark:bg-emerald-950/30">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {/* Stats Item 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <div className="text-4xl font-bold text-emerald-900 md:text-5xl dark:text-emerald-100">
              <CountUp value={500} suffix="+" />
            </div>
            <div className="text-sm font-medium tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
              {tStats("students")}
            </div>
          </motion.div>

          {/* Stats Item 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-2"
          >
            <div className="text-4xl font-bold text-emerald-900 md:text-5xl dark:text-emerald-100">
              <CountUp value={50} suffix="+" />
            </div>
            <div className="text-sm font-medium tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
              {tStats("teachers")}
            </div>
          </motion.div>

          {/* Stats Item 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-2"
          >
            <div className="text-4xl font-bold text-emerald-900 md:text-5xl dark:text-emerald-100">
              <CountUp value={1000} suffix="+" />
            </div>
            <div className="text-sm font-medium tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
              {tStats("alumni")}
            </div>
          </motion.div>

          {/* Stats Item 4 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-2"
          >
            <div className="text-4xl font-bold text-emerald-900 md:text-5xl dark:text-emerald-100">
              <CountUp value={15} suffix="" />
            </div>
            <div className="text-sm font-medium tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
              {tStats("years")}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
