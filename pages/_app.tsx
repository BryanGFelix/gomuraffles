'use client';
import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    base, baseSepolia,
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import { Pixelify_Sans } from 'next/font/google';
import './globals.css';
import Layout from '@/components/layout';
import ToastManager from '@/components/Toast/ToastManager';

const config = getDefaultConfig({
    appName: 'GomaRaffles',
    projectId: '0b22a28de703e1ae3b653272093b5eb3',
    chains: [baseSepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });

const queryClient = new QueryClient();

const pixelify = Pixelify_Sans({ subsets: ['latin'], weight: '400', });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={pixelify.className}>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <Layout>
                        <ToastManager />
                        <Component {...pageProps} />
                    </Layout>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
  </main>
  );
}

export default MyApp;