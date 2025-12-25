"use client";

import PSBForm from "@/components/PSBForm";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/lib/animations";

import Image from "next/image";

export default function PSBContent() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="container px-4 py-10 md:px-6"
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left Column: Image & Info */}
        <motion.div variants={slideUp} className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/psb-welcome.png"
                alt="Penerimaan Santri Baru"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h2 className="mb-2 text-3xl font-bold">Bergabung Bersama Kami</h2>
                <p className="text-lg text-gray-200">
                  Mewujudkan generasi Rabbani yang unggul dalam Imtaq dan Iptek.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div variants={slideUp}>
          <PSBForm />
        </motion.div>
      </div>
    </motion.div>
  );
}
