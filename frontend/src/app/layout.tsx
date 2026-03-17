import type { Metadata } from "next";
import { Syne, DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { UIStateProvider } from "@/hooks/useUIState";
import { Sidebar } from "@/components/layout/Sidebar";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400", "600", "700", "800"] });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "SkillSync — AI Career Intelligence Platform",
  description: "An award-winning AI career intelligence system with ML models, simulations, and privacy-preserving analysis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable} ${dmSans.variable}`}>
      <body className="font-dm-sans bg-[#05050f] text-[#ede9ff] min-h-screen overflow-x-hidden antialiased">
        {/* Global Ambient Background */}
        <div className="fixed inset-0 z-0 pointer-events-none mesh-bg animate-bg-pan" />
        <UIStateProvider>
          <div className="flex min-h-screen relative z-10 w-full">
            <Sidebar />
            <main className="ml-[260px] flex-1 p-10 min-w-0 min-h-screen">
              {children}
            </main>
          </div>
        </UIStateProvider>
      </body>
    </html>
  );
}
