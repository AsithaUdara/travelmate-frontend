import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow remote images from Unsplash used on the landing page
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  turbopack: {
    // Force Turbopack to treat this folder as the workspace root
    root: __dirname,
  },
};

export default nextConfig;
