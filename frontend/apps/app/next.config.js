/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@zenode/ui'],
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cryptologos.cc',
        pathname: '/**',
      },
    ],
  },
  // Particle auth pulls AWS SDK credential helpers that must not run in the browser bundle
  serverExternalPackages: [
    '@aws-sdk/credential-providers',
    '@aws-sdk/credential-provider-login',
    '@aws-sdk/credential-provider-process',
    '@aws-sdk/credential-provider-sso',
    '@aws-sdk/token-providers',
  ],
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      { module: /node_modules\/ox\// },
      { module: /node_modules\/viem\// },
      /Critical dependency: the request of a dependency is an expression/,
    ];
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@aws-sdk/credential-providers': false,
      };
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
