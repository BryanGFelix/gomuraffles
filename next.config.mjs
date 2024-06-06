/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    ignoreBuildErrors: true,
    env: {
      ALCHEMY_RPC_PROVIDER_SEPOLIA: process.env.ALCHEMY_RPC_PROVIDER_SEPOLIA,
      PRIVATE_KEY: process.env.PRIVATE_KEY,
      CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
      API_ENDPOINT: process.env.API_ENDPOINT
    },
    webpack: config => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      return config;
    },
  };

export default nextConfig;
