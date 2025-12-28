import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllVideos, type Video } from "@/lib/services/videoService";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeIn } from "@/lib/animations";

// Video Section Skeleton
function VideoSectionSkeleton() {
  return (
    <section className="bg-emerald-900 py-16 text-white md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-10 text-center">
          <Skeleton className="mx-auto h-10 w-64 bg-emerald-800" />
          <Skeleton className="mx-auto mt-4 h-5 w-96 bg-emerald-800" />
        </div>
        <div className="mx-auto mb-12 w-full overflow-hidden rounded-2xl">
          <Skeleton className="aspect-video w-full bg-emerald-800" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl">
              <Skeleton className="aspect-video w-full bg-emerald-800" />
              <div className="bg-emerald-800/50 p-3">
                <Skeleton className="h-4 w-3/4 bg-emerald-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function VideoSection() {
  const t = useTranslations("VideoProfile");
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: videos, isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: getAllVideos,
  });

  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  // Set initial active video when data is loaded
  useEffect(() => {
    if (videos && videos.length > 0 && !activeVideo) {
      setActiveVideo(videos[0]);
    }
  }, [videos, activeVideo]);

  const handleVideoChange = (video: Video) => {
    setActiveVideo(video);
    setIsPlaying(true); // Auto play when switching
  };

  if (isLoading) {
    return <VideoSectionSkeleton />;
  }

  if (!videos || videos.length === 0) {
    // Option: Return null or a placeholder if no videos are found
    // For now, let's just return nothing or a minimal message section
    return null;
  }

  // Ensure activeVideo is set (data might have loaded but effect hasn't run yet, or during render)
  const currentVideo = activeVideo || videos[0];

  const getValidThumbnail = (url: string | undefined | null) => {
    if (!url) return "/images/placeholder.jpg";
    if (url.startsWith("http") || url.startsWith("/")) return url;
    return "/images/placeholder.jpg";
  };

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
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-emerald-100/80">{t("description")}</p>
        </motion.div>

        {/* Main Video Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-12 w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
        >
          <div className="relative aspect-video w-full bg-black">
            {!isPlaying ? (
              <div
                className="group relative h-full w-full cursor-pointer"
                onClick={() => setIsPlaying(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsPlaying(true);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                {/* Custom Cover Image */}
                <Image
                  src={getValidThumbnail(currentVideo.thumbnail)} // Fallback image check
                  alt={currentVideo.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Bottom Left Play Button & Title */}
                <div className="absolute right-6 bottom-6 left-6 flex items-center gap-4 sm:bottom-10 sm:left-10">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-500/90 pl-1 text-white shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500">
                    <Play className="h-6 w-6 fill-current" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-xs font-medium tracking-wider text-emerald-300 uppercase">
                      {t("title")}
                    </span>
                    <h3 className="line-clamp-2 text-lg leading-tight font-bold text-white sm:text-xl">
                      {currentVideo.title}
                    </h3>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideo.youtube_id}?si=OJh_EQxANjr2o-wp&autoplay=1`}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              ></iframe>
            )}
          </div>
        </motion.div>

        {/* Video Menu / Playlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 gap-4 lg:grid-cols-6"
        >
          {videos.map((video, idx) => {
            const isActive = currentVideo.id === video.id;
            return (
              <div
                key={idx}
                className={`group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300 ${
                  isActive
                    ? "scale-[1.02] shadow-[0_0_15px_rgba(52,211,153,0.3)] ring-2 ring-emerald-400"
                    : "ring-1 ring-white/10 hover:-translate-y-1 hover:shadow-lg hover:ring-emerald-400/50"
                }`}
                onClick={() => handleVideoChange(video)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleVideoChange(video);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={getValidThumbnail(video.thumbnail)}
                    alt={video.title}
                    fill
                    className={`object-cover transition-transform duration-700 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                  />

                  {/* Overlay Gradient */}
                  <div
                    className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity ${isActive ? "opacity-80" : "group-hover:opacity-80"}`}
                  />

                  {/* Active Indicator / Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isActive ? (
                      <div className="flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                        </span>
                        PLAYING
                      </div>
                    ) : (
                      <div className="translate-y-4 transform rounded-full bg-white/20 p-2 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <Play className="h-4 w-4 fill-white text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Container */}
                <div
                  className={`flex flex-1 flex-col justify-between p-3 transition-colors ${isActive ? "bg-emerald-900/80" : "bg-white/5 group-hover:bg-white/10"}`}
                >
                  <h4
                    className={`line-clamp-2 text-xs leading-relaxed font-medium ${isActive ? "text-emerald-300" : "text-slate-200 group-hover:text-white"}`}
                  >
                    {video.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
