import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable PWA in dev
  buildExcludes: [/middleware-manifest\.json$/],
  workboxOptions: {
    clientsClaim: true,
    skipWaiting: true,
  },
});

module.exports = withPWA({
  reactStrictMode: true,
});


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // ✅ Allow images from Cloudinary
  },
};

export default nextConfig;
