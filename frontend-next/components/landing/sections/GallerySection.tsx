"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Gallery } from "@/lib/services/galleryService";

interface GallerySectionProps {
  galleries: Gallery[];
}

export default function GallerySection({ galleries }: GallerySectionProps) {
  const tHome = useTranslations("Home");

  return (
    <section className="bg-muted/50 py-16">
      <div className="container px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-emerald-900 md:text-4xl dark:text-emerald-100">
            {tHome("gallery_title")}
          </h2>
          <p className="text-muted-foreground mt-2">{tHome("gallery_desc")}</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4">
          {galleries.length === 0 ? (
            // Empty State / Fallback
            <div className="bg-muted col-span-full flex h-[400px] items-center justify-center rounded-xl">
              <p className="text-muted-foreground">Galeri belum tersedia</p>
            </div>
          ) : (
            // Display photos from galleries (flattened)
            (() => {
              // Display photos from galleries (flattened)
              const allPhotos = galleries
                .flatMap((g) => (g.photos || []).map((p) => ({ ...p, title: g.title })))
                .slice(0, 5); // Take max 5 photos for the grid

              if (allPhotos.length === 0) return null;

              return (
                <>
                  {/* Main Featured Image (First Item) - Spans 2x2 */}
                  {allPhotos[0] && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="group relative col-span-2 row-span-2 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800"
                    >
                      <Image
                        src={allPhotos[0].photo_url}
                        alt={allPhotos[0].title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="font-semibold">{allPhotos[0].title}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Secondary Images */}
                  {allPhotos.slice(1).map((photo) => (
                    <motion.div
                      key={photo.id}
                      whileHover={{ scale: 1.05 }}
                      className="group relative col-span-1 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800"
                    >
                      <Image
                        src={photo.photo_url}
                        alt={photo.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                    </motion.div>
                  ))}
                </>
              );
            })()
          )}
        </div>
      </div>
    </section>
  );
}
