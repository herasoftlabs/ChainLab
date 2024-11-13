// src/app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import { ReactNode } from "react";
import { Rajdhani } from 'next/font/google';
import { RootProvider } from "@/providers/RootProvider";
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from "@vercel/analytics/react"

const rajdhani = Rajdhani({
  weight: ['400', '500', '600' ,'700'],  
  subsets: ['latin'],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChainLab",
  description: "ChainLab",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={rajdhani.className}>
      <body>
        <div className="flex h-screen">
          <div className="flex flex-col w-full">
            <RootProvider>
              <main className="">
                {children} 
                <Analytics />
              </main>
            </RootProvider>
          </div>
        </div>
      </body>
    </html>
  );
}