import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "BIOVOTE — Voting System Demonstration",
  description:
    "Your Identity. Your Voice. Your Vote. An educational voting prototype with optional camera preview and simulated verification. It does not verify identity or support real elections.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#080c14] text-slate-100 min-h-screen flex flex-col selection:bg-blue-600/30 selection:text-blue-200">
        {/* Prototype Educational Warning Banner */}
        <div className="bg-gradient-to-r from-blue-900/50 via-indigo-950/60 to-purple-900/50 border-b border-blue-500/20 px-4 py-1.5 text-center text-xs text-blue-200 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>
            <strong>EDUCATIONAL DEMO:</strong> Camera access is optional. Prompts are simulated and do not verify identity or liveness. No face matching or biometric templates are used.
          </span>
        </div>

        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
