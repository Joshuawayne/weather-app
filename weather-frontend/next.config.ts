// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Or other existing settings
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        port: '', // Default port (usually empty for https)
        pathname: '/img/wn/**', // Allow any image from the /img/wn/ path and its subpaths
      },
      // You can add other allowed domains here if needed
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'another-image-provider.com',
      // },
    ],
  },
  // ... any other configurations you have (e.g., experimental, webpack, etc.)
  // For example, if you were using experimental features:
  // experimental: {
  //   appDir: true, // This is true by default in Next.js 13.4+
  // },
};

export default nextConfig; // Use ES Module export