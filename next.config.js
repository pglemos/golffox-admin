/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_KEY: process.env.API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.replit.dev',
      },
      // Allow Vercel preview/production domains for remote images
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      // Allow Supabase Storage images
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    // Disable Next.js Image Optimization so data URLs work directly with next/image
    unoptimized: true,
  },
  allowedDevOrigins: [
    'https://*.replit.dev',
    'https://*.repl.co',
    'https://0049f172-4806-447f-8b15-0e7c179c03ef-00-wntq1vd5fy6r.janeway.replit.dev',
    '0049f172-4806-447f-8b15-0e7c179c03ef-00-wntq1vd5fy6r.janeway.replit.dev'
  ],
  experimental: {
    serverActions: {
      allowedOrigins: ['https://*.replit.dev', 'https://*.repl.co', 'https://*.vercel.app']
    }
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias['@'] = require('path').resolve(__dirname);
    return config;
  },
};

module.exports = nextConfig;