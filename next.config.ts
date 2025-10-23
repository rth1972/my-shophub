import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**', // Wildcard to match ANY hostname
        pathname: '**', // Wildcard to match ANY path
      },
      {
        protocol: 'https',
        hostname: '**', // Wildcard to match ANY hostname
        pathname: '**', // Wildcard to match ANY path
      },
    ],
  },
};

export default nextConfig;
