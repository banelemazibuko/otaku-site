import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@consumet/extensions", "got-scraping", "cheerio"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
};

export default nextConfig;
