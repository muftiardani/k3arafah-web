"use client";

import { Article } from "@/lib/services/articleService";
import { Gallery } from "@/lib/services/galleryService";

import HeroSection from "./sections/HeroSection";
import StatsSection from "./sections/StatsSection";
import ProgramSection from "./sections/ProgramSection";
import GallerySection from "./sections/GallerySection";
import VideoSection from "./sections/VideoSection";
import AchievementSection from "./sections/AchievementSection";
import NewsSection from "./sections/NewsSection";

interface LandingPageProps {
  articles: Article[];
  galleries: Gallery[];
}

export default function LandingPage({ articles, galleries }: LandingPageProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <HeroSection />
      <StatsSection />
      <ProgramSection />
      <GallerySection galleries={galleries} />
      <VideoSection />
      <AchievementSection />
      <NewsSection articles={articles} />
    </div>
  );
}
