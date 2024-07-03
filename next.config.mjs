/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ALCHEMY_RPC_PROVIDER_SEPOLIA: process.env.ALCHEMY_RPC_PROVIDER_SEPOLIA,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    API_ENDPOINT: process.env.API_ENDPOINT,
  },
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self' https://client.warpcast.com/ https://stream.warpcast.com wss://ws.warpcast.com/ https://relay.walletconnect.com/ wss://relay.walletconnect.com/ https://explorer-api.walletconnect.com/ wss://www.walletlink.org/ https://*.cloudflarestream.com https://cloudflare-eth.com https://gomurafflesapi.onrender.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
