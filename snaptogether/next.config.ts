import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
  buildExcludes: [/middleware-manifest\.json$/], // Exclude middleware manifest
  clientsClaim: true, // ✅ Correct placement
  skipWaiting: true, // ✅ Correct placement
});

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"], // ✅ Allow images from Cloudinary
  },
};

export default withPWA(nextConfig); // ✅ Correct export
