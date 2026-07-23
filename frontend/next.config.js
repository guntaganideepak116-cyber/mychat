/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages compatible - keep SSR for Clerk
  // experimental.runtime is not needed in Next.js 14+

  // Allow images from any domain for future use
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Strict mode for better React practices
  reactStrictMode: true,
};

module.exports = nextConfig;
