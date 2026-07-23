/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages SSR compatibility
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
