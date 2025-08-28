import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  output: 'export',
  basePath: "/dellmize",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
