import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  turbopack: { resolveAlias: { "@/*": ["./src/*"] } },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },

  experimental: {
    useLightningcss: false,
  },
};

export default nextConfig;
