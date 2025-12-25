"use client";

import { useTranslations } from "next-intl";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, slideUp, slideInLeft, slideInRight } from "@/lib/animations";

export default function ContactContent() {
  const t = useTranslations("Contact");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-emerald-50 py-16 text-center dark:bg-emerald-950">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container px-4 md:px-6"
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
            {t("hero_desc")}
          </motion.p>
        </motion.div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-12 lg:grid-cols-2"
          >
            {/* Contact Info & Map */}
            <motion.div variants={slideInLeft} className="space-y-8">
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{t("address_title")}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{t("address_desc")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{t("phone_title")}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("phone_1")} {t("phone_1_label")} <br />
                      {t("phone_2")} {t("phone_2_label")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{t("email_title")}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("email_1")} <br />
                      {t("email_2")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{t("hours_title")}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("hours_desc")} <br />
                      {t("hours_desc_2")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="h-[300px] w-full overflow-hidden rounded-xl bg-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.0866946654!2d106.6669!3d-6.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzMnMDAuMCJTIDEwNsKwNDAnMDAuMCJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Lokasi Pesantren"
                ></iframe>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              variants={slideInRight}
              className="rounded-2xl border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <h2 className="mb-6 text-2xl font-bold">{t("send_message")}</h2>
              <ContactForm />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
