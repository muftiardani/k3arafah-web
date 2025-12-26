"use client";

import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function VideoSection() {
  return (
    <section className="bg-emerald-900 py-16 text-white md:py-24">
      <div className="container px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tighter text-emerald-50 md:text-4xl">
            Video Profil
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-emerald-100/80">
            Mengenal lebih dekat suasana, kegiatan, dan lingkungan belajar para santri di Pondok
            Pesantren K3 Arafah.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
        >
          <div className="aspect-video w-full bg-black">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
              title="Video Profil Pesantren"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
