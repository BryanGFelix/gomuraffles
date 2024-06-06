import '@rainbow-me/rainbowkit/styles.css';
import { getFrameMetadata } from 'frog/next';
import type { Metadata } from 'next';
import RaffleHome from '.';

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || 'http://localhost:3000'}/api`,
  )
  return {
    other: frameTags,
  }
}

export default function Home() {
  return (
    <RaffleHome/>
  )
}
