import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow build to succeed even if there are ESLint errors (useful for previews/demos)
    ignoreDuringBuilds: true,
  },
  images: {
    // Allow remote images we use across the app
    remotePatterns: [
      // Unsplash CDN (direct image assets)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Pexels CDN
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    // Force Turbopack to treat this folder as the workspace root
    root: __dirname,
  },
};

export default nextConfig;
