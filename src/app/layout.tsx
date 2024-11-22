// src/app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import { ReactNode } from "react";
import { Rajdhani } from "next/font/google";
import { RootProvider } from "@/providers/RootProvider";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react";

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChainLab - No-Code Blockchain Development Platform",
  description:
    "Build decentralized applications without code. Deploy smart contracts, create NFTs, and build DeFi protocols with ease.",
  keywords: "blockchain, smart contracts, no-code, web3, dapp, defi, nft",
  authors: [{ name: "ChainLab Team" }],
  openGraph: {
    title: "ChainLab - No-Code Blockchain Development Platform",
    description: "Build decentralized applications without code",
    url: "https://chainlab.dev",
    siteName: "ChainLab",
    /* images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ], */
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={rajdhani.className}>
      <body className="flex h-screen">
        <div className="flex flex-col w-full">
          <RootProvider>
            <main className="flex-grow">{children}</main>
            <Analytics />
          </RootProvider>
        </div>
      </body>
    </html>
  );
}
