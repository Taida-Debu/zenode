/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@zenode/ui'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
