import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'learn2earnhq.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'puzzlepro.learn2earnhq.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.learn2earnhq.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'resultspro.ng',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.resultspro.ng',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.resultspro.ng',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
