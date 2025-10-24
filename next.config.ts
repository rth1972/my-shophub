import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
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
