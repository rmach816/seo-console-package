import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,
  
  // Enable standalone output for Docker/self-hosting
  output: "standalone",
  
  // Turbopack is now the default dev server
  // Add any custom config here
};

export default nextConfig;
