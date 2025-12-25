import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https", // Allow logo if needed or external images
        hostname: "k3arafah.com",
      },
    ],
  },
};

export default withPWA(withNextIntl(bundleAnalyzer(nextConfig)));
