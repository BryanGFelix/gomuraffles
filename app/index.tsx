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
import Layout from '@/components/layout';
import { Pixelify_Sans } from 'next/font/google';
import RaffleForm from '@/components/RaffleForm/raffleForm';

const config = getDefaultConfig({
    appName: 'GomaRaffles',
    projectId: '0b22a28de703e1ae3b653272093b5eb3',
    chains: [baseSepolia], 
    ssr: true, // If your dApp uses server side rendering (SSR)
  });

const queryClient = new QueryClient();

const pixelify = Pixelify_Sans({ subsets: ['latin'], weight: '400', });

const Home = () => {
    return (
      <main className={pixelify.className}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <div id="modal-root"/>
              <Layout>
                <RaffleForm />
              </Layout>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </main>
    )
}

export default Home;