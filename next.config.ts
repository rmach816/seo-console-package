import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,
  
  // Enable standalone output for Docker/self-hosting
  output: "standalone",
  
  // Turbopack is now the default dev server
  // Add any custom config here
  
  webpack: (config, { isServer }) => {
    // Externalize Node.js built-in modules to prevent webpack from bundling them
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        "fs/promises": false,
        path: false,
        stream: false,
        events: false,
        glob: false,
      };
    }
    
    // Mark Node.js built-ins as external
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push({
        "node:fs": "commonjs fs",
        "node:fs/promises": "commonjs fs/promises",
        "node:path": "commonjs path",
        "node:stream": "commonjs stream",
        "node:events": "commonjs events",
      });
    }
    
    return config;
  },
};

export default nextConfig;
