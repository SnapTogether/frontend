import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
  clientsClaim: true, // ✅ Correct placement
  skipWaiting: true, // ✅ Correct placement
  buildExcludes: [/middleware-manifest\.json$/, /.*\.gif$/],
  experimental: { appDir: true }
});

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"], // ✅ Allow images from Cloudinary
  },
};

export default withPWA(nextConfig); // ✅ Correct export
