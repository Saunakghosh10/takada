/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
  // Disable static generation - use dynamic rendering for Clerk compatibility
  output: 'standalone',
  // Force dynamic rendering for all pages
};

export default nextConfig;
