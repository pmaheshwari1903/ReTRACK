import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.BETTER_AUTH_URL
    ? [new URL(process.env.BETTER_AUTH_URL).hostname]
    : [],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
