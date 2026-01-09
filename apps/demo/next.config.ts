import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@seo-console/package"],
  // Use webpack config to prevent server-only modules from being bundled in client
  webpack: (config, { isServer }) => {
    // Prevent sharp and other Node.js-only modules from being bundled in client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
        sharp: false,
      };
      // Exclude sharp from client bundle
      if (Array.isArray(config.externals)) {
        config.externals.push("sharp");
      } else if (typeof config.externals === "function") {
        const originalExternals = config.externals;
        config.externals = [
          ...(Array.isArray(originalExternals) ? originalExternals : []),
          ({ request }: { request?: string }) => {
            if (request === "sharp" || request?.includes("sharp")) {
              return true;
            }
            return false;
          },
        ];
      } else {
        config.externals = ["sharp"];
      }
    }
    return config;
  },
};

export default nextConfig;
